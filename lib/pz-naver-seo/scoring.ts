import type { RewriteRequest, ScoreBreakdown } from "./types";

const SCORE_LIMITS = {
  searchIntent: 20,
  readability: 15,
  expertise: 15,
  originality: 15,
  structure: 15,
  seo: 10,
  conversion: 10
} as const;

export const SCORE_LABELS: Record<keyof typeof SCORE_LIMITS, string> = {
  searchIntent: "검색 의도 충족도",
  readability: "가독성",
  expertise: "전문성",
  originality: "독창성",
  structure: "구조 완성도",
  seo: "SEO 적합성",
  conversion: "전환 가능성"
};

function clamp(value: number, max: number) {
  return Math.max(0, Math.min(Math.round(value), max));
}

function splitList(value = "") {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function calculateQualityScore(input: RewriteRequest): ScoreBreakdown {
  const original = input.original?.trim() ?? "";
  const primaryKeyword = input.primaryKeyword?.trim() ?? "";
  const secondaryKeywords = splitList(input.secondaryKeywords);
  const text = `${original} ${primaryKeyword} ${secondaryKeywords.join(" ")}`;
  const sentenceCount = Math.max(1, original.split(/[.!?。！？\n]/).filter((item) => item.trim()).length);
  const averageSentenceLength = original.length / sentenceCount;
  const hasPracticalCriteria = /(예산|일정|현장|법규|구조|시공|유지관리|인허가|리스크|동선|마감|견적)/.test(text);

  const searchIntent = clamp((input.intent ? 9 : 4) + (input.audience ? 5 : 2) + (primaryKeyword ? 6 : 0), SCORE_LIMITS.searchIntent);
  const readability = clamp(15 - Math.max(0, averageSentenceLength - 90) / 12 + (sentenceCount >= 2 ? 2 : 0), SCORE_LIMITS.readability);
  const expertise = clamp((hasPracticalCriteria ? 9 : 3) + (/(근거|기준|검토|조건|판단)/.test(text) ? 6 : 2), SCORE_LIMITS.expertise);
  const originality = clamp(8 + Math.min(7, Math.floor(new Set(original.split(/\s+/).filter(Boolean)).size / 10)), SCORE_LIMITS.originality);
  const structure = clamp((original.length > 80 ? 5 : 2) + (secondaryKeywords.length ? 4 : 1) + (input.forbiddenWords ? 3 : 1) + 3, SCORE_LIMITS.structure);
  const seo = clamp((primaryKeyword && text.includes(primaryKeyword) ? 5 : 1) + Math.min(5, secondaryKeywords.length * 2), SCORE_LIMITS.seo);
  const conversion = clamp((/(문의|상담|견적|방문|검토|결정|제안)/.test(text) ? 6 : 2) + (input.audience ? 4 : 1), SCORE_LIMITS.conversion);
  const total = Math.min(100, searchIntent + readability + expertise + originality + structure + seo + conversion);

  return {
    searchIntent,
    readability,
    expertise,
    originality,
    structure,
    seo,
    conversion,
    total
  };
}

export function sumScoreItems(score: ScoreBreakdown) {
  return score.searchIntent + score.readability + score.expertise + score.originality + score.structure + score.seo + score.conversion;
}
