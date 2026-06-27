import { renderRewriteMarkdown } from "./markdownRenderer";
import { buildRewritePrompt, PZ_NAVER_SEO_SYSTEM_PROMPT } from "./prompts";
import { calculateQualityScore } from "./scoring";
import type { RewriteApiResponse, RewriteRequest, RewriteResult, SearchIntent, Tone } from "./types";

const toneLabels: Record<Tone, string> = {
  professional: "전문가형",
  friendly: "친근형",
  premium: "프리미엄형",
  local: "지역 밀착형"
};

const intentLabels: Record<SearchIntent, string> = {
  informational: "정보 탐색",
  commercial: "구매 검토",
  local: "지역 검색",
  comparison: "비교 분석"
};

function splitList(value = "") {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function firstSentence(value: string, fallback: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.split(/[.!?。！？]/)[0]?.trim() || fallback;
}

export function buildFallbackRewrite(input: RewriteRequest): RewriteResult {
  const primaryKeyword = input.primaryKeyword?.trim() || "핵심 키워드";
  const secondaryKeywords = splitList(input.secondaryKeywords);
  const audience = input.audience?.trim() || "의사결정자";
  const tone = input.tone ?? "professional";
  const intent = input.intent ?? "commercial";
  const supportKeywords = secondaryKeywords.length ? secondaryKeywords.join(", ") : "관련 검색어";
  const source = firstSentence(input.original, "원문에서 핵심 메시지를 추출해 검색 의도에 맞게 재구성합니다");
  const score = calculateQualityScore({ ...input, primaryKeyword, audience, tone, intent });

  return {
    analysis: {
      mode: "fallback",
      targetAudience: audience,
      searchIntent: intent,
      primaryKeyword,
      secondaryKeywords
    },
    diagnosis: {
      strengths: ["대표 키워드가 명확함", "실무 판단 기준으로 확장 가능함"],
      risks: ["근거 없는 최상급 표현 사용 시 신뢰도 저하", "보조 키워드 반복 삽입 시 품질 저하"],
      practicalCriteria: ["예산", "일정", "현장 조건", "시공 리스크", "유지관리"]
    },
    score,
    improvements: [
      `${primaryKeyword}를 제목, 도입문, 중간 소제목에 자연스럽게 배치합니다.`,
      `${audience}가 실제로 비교하는 예산, 일정, 현장 조건, 시공 리스크를 본문에 포함합니다.`,
      `${supportKeywords}는 반복보다 문맥별 역할을 나눠 배치합니다.`
    ],
    seoPackage: {
      title: `실무자가 확인할 ${primaryKeyword} 가이드`,
      metaTitle: `${primaryKeyword} 실무 가이드 | PZ Naver SEO Studio`,
      metaDescription: `${primaryKeyword}를 검토하는 ${audience}를 위해 ${supportKeywords} 기준의 판단 포인트를 정리했습니다.`,
      body: [
        `${primaryKeyword}는 검색 노출만을 위한 문장이 아니라 실제 의사결정에 필요한 근거를 담아야 합니다. ${source}.`,
        "",
        `먼저 독자의 상황을 분명히 제시해야 합니다. ${audience}는 예산, 일정, 현장 조건, 법규 또는 인허가, 시공 리스크를 함께 검토하기 때문에 단순한 장점 나열보다 판단 기준이 중요합니다.`,
        "",
        `${toneLabels[tone]} 문체에서는 단정적 표현보다 확인 가능한 기준을 앞세우는 편이 안정적입니다. ${intentLabels[intent]} 의도에 맞춰 문제 상황, 선택 기준, 실행 순서, 상담 전 확인 사항을 순서대로 배치합니다.`,
        "",
        `보조 키워드인 ${supportKeywords}는 문맥 안에서 나눠 사용합니다. 견적, 공정, 마감, 유지관리 항목을 분리하면 키워드 밀도와 가독성을 동시에 관리할 수 있습니다.`
      ].join("\n"),
      faq: [
        {
          question: `${primaryKeyword} 콘텐츠에서 가장 먼저 보강할 부분은 무엇인가요?`,
          answer: "독자의 현재 상황과 예산, 일정, 현장 조건을 먼저 제시해야 검색 의도와 전환 흐름이 안정됩니다."
        },
        {
          question: "보조 키워드는 얼마나 반복해야 하나요?",
          answer: "반복 횟수보다 배치 맥락이 중요합니다. 소제목, 사례, 체크리스트에 나누어 자연스럽게 포함하는 것이 안전합니다."
        }
      ],
      internalLinks: [`/${primaryKeyword.replace(/\s+/g, "-")}`, "/portfolio", "/consulting"],
      imageIdeas: ["현장 전후 비교 이미지", "예산·일정·공정 요약 다이어그램", "마감재와 동선 계획 이미지"]
    },
    checklist: [
      "10개 필수 Markdown 섹션 포함",
      "Meta Title과 Meta Description 포함",
      "예산, 일정, 현장 조건, 시공 리스크 중 2개 이상 포함",
      "금지어와 과장 표현 제거",
      "대표 키워드 과다 반복 여부 확인"
    ]
  };
}

async function callOpenAI(input: RewriteRequest, apiKey: string, model: string) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: PZ_NAVER_SEO_SYSTEM_PROMPT },
        { role: "user", content: buildRewritePrompt(input) }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.output_text || data.output?.flatMap((item: any) => item.content ?? []).map((item: any) => item.text ?? "").join("\n") || "";
}

export async function runRewritePipeline(input: RewriteRequest): Promise<RewriteApiResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-5.5";
  const fallbackResult = buildFallbackRewrite(input);
  let markdown = renderRewriteMarkdown(fallbackResult);
  let result = fallbackResult;

  if (apiKey) {
    try {
      const openAiMarkdown = await callOpenAI(input, apiKey, model);
      if (openAiMarkdown.trim()) {
        result = {
          ...fallbackResult,
          analysis: { ...fallbackResult.analysis, mode: "openai" }
        };
        markdown = openAiMarkdown;
      }
    } catch {
      result = fallbackResult;
      markdown = renderRewriteMarkdown(fallbackResult);
    }
  }

  return {
    ok: true,
    markdown,
    result
  };
}
