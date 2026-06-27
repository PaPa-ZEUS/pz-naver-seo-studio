import test from "node:test";
import assert from "node:assert/strict";
import { hasMetaInformation, hasRequiredMarkdownSections, renderRewriteMarkdown } from "../../lib/pz-naver-seo/markdownRenderer";
import { buildFallbackRewrite } from "../../lib/pz-naver-seo/rewritePipeline";

const result = buildFallbackRewrite({
  original: "조경 설계는 예산, 일정, 현장 조건, 유지관리 기준을 함께 검토해야 합니다.",
  primaryKeyword: "상업공간 조경 설계",
  secondaryKeywords: "조경 견적, 유지관리",
  audience: "상업시설 운영자",
  tone: "professional",
  intent: "commercial",
  forbiddenWords: "최고"
});

test("Markdown에 10개 필수 섹션이 포함된다", () => {
  const markdown = renderRewriteMarkdown(result);
  assert.equal(hasRequiredMarkdownSections(markdown), true);
});

test("Meta Title과 Meta Description이 존재한다", () => {
  const markdown = renderRewriteMarkdown(result);
  assert.equal(hasMetaInformation(markdown), true);
});
