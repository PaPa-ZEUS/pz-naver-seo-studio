import type { RewriteRequest } from "./types";

export const PZ_NAVER_SEO_SYSTEM_PROMPT = [
  "You are PZ Naver SEO Rewrite Framework v1.1.",
  "Return practical Korean SEO diagnosis and rewrite output for Naver search.",
  "Focus on architecture, interior, landscape, real estate, and design-build business decisions.",
  "Avoid unsupported exaggeration. Include budget, schedule, site condition, construction, maintenance, and risk criteria when relevant."
].join("\n");

export function buildRewritePrompt(input: RewriteRequest) {
  return [
    "다음 입력을 바탕으로 네이버 SEO 진단과 재작성 결과를 작성하세요.",
    `원문: ${input.original}`,
    `대표 키워드: ${input.primaryKeyword}`,
    `보조 키워드: ${input.secondaryKeywords ?? ""}`,
    `타깃 독자: ${input.audience ?? ""}`,
    `문체: ${input.tone ?? "professional"}`,
    `검색 의도: ${input.intent ?? "commercial"}`,
    `제외 표현: ${input.forbiddenWords ?? ""}`,
    "",
    "반드시 다음 10개 Markdown 섹션을 같은 제목으로 포함하세요.",
    "## 1. SEO 진단 결과",
    "## 2. 품질 점수",
    "## 3. 개선 포인트",
    "## 4. 최적화 제목",
    "## 5. 최적화 본문",
    "## 6. FAQ",
    "## 7. 메타 정보",
    "## 8. 내부 링크 추천",
    "## 9. 이미지 추천",
    "## 10. 최종 체크리스트",
    "",
    "품질 점수는 검색 의도 충족도 20점, 가독성 15점, 전문성 15점, 독창성 15점, 구조 완성도 15점, SEO 적합성 10점, 전환 가능성 10점 기준으로 작성하세요.",
    "메타 정보에는 Meta Title과 Meta Description을 반드시 포함하세요."
  ].join("\n");
}
