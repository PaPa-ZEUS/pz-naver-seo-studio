import test from "node:test";
import assert from "node:assert/strict";
import {
  validateForbiddenWords,
  validateKeywordDensity,
  validateOriginal,
  validatePracticalCriteria
} from "../../lib/pz-naver-seo/validators";

test("원문 누락을 감지한다", () => {
  const issues = validateOriginal({ original: "" });
  assert.equal(issues[0]?.code, "MISSING_ORIGINAL");
});

test("키워드 과다 반복을 감지한다", () => {
  const issues = validateKeywordDensity("인테리어 인테리어 인테리어 인테리어 인테리어 견적", "인테리어");
  assert.equal(issues[0]?.code, "KEYWORD_OVERUSE");
});

test("금지어를 감지한다", () => {
  const issues = validateForbiddenWords("무조건 최고 결과를 보장합니다.", "무조건");
  assert.equal(issues[0]?.code, "FORBIDDEN_WORD");
});

test("건축/인테리어/조경/부동산 분야 실무 판단 기준 포함 여부를 검증한다", () => {
  const missing = validatePracticalCriteria("감각적인 공간을 제안합니다.");
  const passed = validatePracticalCriteria("예산, 일정, 현장 조건, 시공 리스크를 기준으로 판단합니다.");

  assert.equal(missing[0]?.code, "MISSING_PRACTICAL_CRITERIA");
  assert.equal(passed.length, 0);
});
