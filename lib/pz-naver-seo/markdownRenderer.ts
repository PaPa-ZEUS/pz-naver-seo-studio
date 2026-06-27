import { SCORE_LABELS } from "./scoring";
import type { RewriteResult } from "./types";

export const REQUIRED_MARKDOWN_SECTIONS = [
  "## 1. SEO 진단 결과",
  "## 2. 품질 점수",
  "## 3. 개선 포인트",
  "## 4. 최적화 제목",
  "## 5. 최적화 본문",
  "## 6. FAQ",
  "## 7. 메타 정보",
  "## 8. 내부 링크 추천",
  "## 9. 이미지 추천",
  "## 10. 최종 체크리스트"
] as const;

export function renderRewriteMarkdown(result: RewriteResult) {
  const scoreRows = Object.entries(SCORE_LABELS)
    .map(([key, label]) => `- ${label}: ${result.score[key as keyof typeof SCORE_LABELS]}점`)
    .join("\n");
  const faq = result.seoPackage.faq.map((item) => `- Q. ${item.question}\n  A. ${item.answer}`).join("\n");

  return [
    "## 1. SEO 진단 결과",
    `- 실행 모드: ${result.analysis.mode}`,
    `- 대표 키워드: ${result.analysis.primaryKeyword}`,
    `- 검색 의도: ${result.analysis.searchIntent}`,
    `- 강점: ${result.diagnosis.strengths.join(", ")}`,
    `- 리스크: ${result.diagnosis.risks.join(", ")}`,
    "",
    "## 2. 품질 점수",
    scoreRows,
    `- 총점: ${result.score.total}점`,
    "",
    "## 3. 개선 포인트",
    result.improvements.map((item) => `- ${item}`).join("\n"),
    "",
    "## 4. 최적화 제목",
    result.seoPackage.title,
    "",
    "## 5. 최적화 본문",
    result.seoPackage.body,
    "",
    "## 6. FAQ",
    faq,
    "",
    "## 7. 메타 정보",
    `- Meta Title: ${result.seoPackage.metaTitle}`,
    `- Meta Description: ${result.seoPackage.metaDescription}`,
    "",
    "## 8. 내부 링크 추천",
    result.seoPackage.internalLinks.map((item) => `- ${item}`).join("\n"),
    "",
    "## 9. 이미지 추천",
    result.seoPackage.imageIdeas.map((item) => `- ${item}`).join("\n"),
    "",
    "## 10. 최종 체크리스트",
    result.checklist.map((item) => `- ${item}`).join("\n")
  ].join("\n");
}

export function hasRequiredMarkdownSections(markdown: string) {
  return REQUIRED_MARKDOWN_SECTIONS.every((section) => markdown.includes(section));
}

export function hasMetaInformation(markdown: string) {
  return /Meta Title:\s*\S/.test(markdown) && /Meta Description:\s*\S/.test(markdown);
}
