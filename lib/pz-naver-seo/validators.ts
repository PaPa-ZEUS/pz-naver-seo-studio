import { hasRequiredMarkdownSections } from "./markdownRenderer";
import { sumScoreItems } from "./scoring";
import type { RewriteRequest, ScoreBreakdown, ValidationIssue } from "./types";

const EXAGGERATED_WORDS = ["최고", "무조건", "완벽", "압도적", "1위", "100%", "반드시 성공"];
const PRACTICAL_CRITERIA = ["예산", "일정", "현장", "법규", "구조", "시공", "유지관리", "인허가", "리스크", "동선", "마감", "견적"];

function splitList(value = "") {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function countOccurrences(text: string, keyword: string) {
  if (!keyword) return 0;
  return (text.match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) ?? []).length;
}

export function validateOriginal(input: Pick<RewriteRequest, "original">): ValidationIssue[] {
  return input.original?.trim()
    ? []
    : [{ code: "MISSING_ORIGINAL", message: "원문이 누락되었습니다.", severity: "error" }];
}

export function validateRequiredSections(markdown: string): ValidationIssue[] {
  return hasRequiredMarkdownSections(markdown)
    ? []
    : [{ code: "MISSING_REQUIRED_SECTION", message: "최종 Markdown에 필수 10개 섹션이 모두 포함되어야 합니다.", severity: "error" }];
}

export function validateScoreTotal(score: ScoreBreakdown): ValidationIssue[] {
  const total = sumScoreItems(score);
  if (total > 100 || score.total > 100) {
    return [{ code: "SCORE_OVER_100", message: "점수 합계가 100점을 초과했습니다.", severity: "error" }];
  }
  if (total !== score.total) {
    return [{ code: "SCORE_TOTAL_MISMATCH", message: "총점이 항목 점수 합과 일치하지 않습니다.", severity: "error" }];
  }
  return [];
}

export function validateKeywordDensity(text: string, keyword: string): ValidationIssue[] {
  const normalized = text.trim();
  if (!keyword || !normalized) return [];
  const wordCount = Math.max(1, normalized.split(/\s+/).length);
  const occurrences = countOccurrences(normalized, keyword);
  return occurrences >= 5 && occurrences / wordCount > 0.08
    ? [{ code: "KEYWORD_OVERUSE", message: "키워드가 과다 반복되었습니다.", severity: "warning" }]
    : [];
}

export function validateForbiddenWords(text: string, forbiddenWords = ""): ValidationIssue[] {
  const forbidden = [...splitList(forbiddenWords), ...EXAGGERATED_WORDS];
  const found = Array.from(new Set(forbidden.filter((word) => word && text.includes(word))));
  return found.length
    ? [{ code: "FORBIDDEN_WORD", message: `금지어 또는 과장 표현이 포함되었습니다: ${found.join(", ")}`, severity: "warning" }]
    : [];
}

export function validatePracticalCriteria(text: string): ValidationIssue[] {
  const found = PRACTICAL_CRITERIA.filter((item) => text.includes(item));
  return found.length >= 2
    ? []
    : [{ code: "MISSING_PRACTICAL_CRITERIA", message: "건축/인테리어/조경/부동산 분야의 실무 판단 기준이 부족합니다.", severity: "warning" }];
}

export function validateRewrite(input: RewriteRequest, markdown: string, score: ScoreBreakdown): ValidationIssue[] {
  const text = `${input.original}\n${markdown}`;
  return [
    ...validateOriginal(input),
    ...validateRequiredSections(markdown),
    ...validateScoreTotal(score),
    ...validateKeywordDensity(text, input.primaryKeyword),
    ...validateForbiddenWords(text, input.forbiddenWords),
    ...validatePracticalCriteria(text)
  ];
}
