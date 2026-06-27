import test from "node:test";
import assert from "node:assert/strict";
import { calculateQualityScore, sumScoreItems } from "../../lib/pz-naver-seo/scoring";

const request = {
  original: "사무실 인테리어는 예산, 일정, 현장 조건, 시공 리스크를 함께 검토해야 안정적인 결과를 만들 수 있습니다.",
  primaryKeyword: "사무실 인테리어",
  secondaryKeywords: "인테리어 견적, 디자인빌드",
  audience: "사무실 이전을 검토하는 대표",
  tone: "professional" as const,
  intent: "commercial" as const,
  forbiddenWords: "최고, 무조건"
};

test("점수 합계가 항목 점수 합과 일치한다", () => {
  const score = calculateQualityScore(request);
  assert.equal(score.total, sumScoreItems(score));
});

test("총점이 100점을 넘지 않는다", () => {
  const score = calculateQualityScore({
    ...request,
    original: `${request.original} 예산 일정 현장 조건 시공 유지관리 견적 상담 `.repeat(12)
  });
  assert.ok(score.total <= 100);
});
