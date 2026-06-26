"use client";

import { useMemo, useState } from "react";

type Tone = "professional" | "friendly" | "premium" | "local";
type Intent = "informational" | "commercial" | "local" | "comparison";

type RewriteInput = {
  original: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  audience: string;
  tone: Tone;
  intent: Intent;
  forbiddenWords: string;
};

const toneLabels: Record<Tone, string> = {
  professional: "전문가형",
  friendly: "친근형",
  premium: "프리미엄형",
  local: "지역 밀착형"
};

const intentLabels: Record<Intent, string> = {
  informational: "정보 탐색",
  commercial: "구매 검토",
  local: "지역 검색",
  comparison: "비교 분석"
};

const intentGuides: Record<Intent, string> = {
  informational: "핵심 개념, 판단 기준, 실무 체크포인트를 순서대로 정리합니다.",
  commercial: "문제, 선택 기준, 의사결정 근거, 상담 전 확인 사항을 명확히 제시합니다.",
  local: "지역명, 현장 조건, 방문 가능성, 실제 사례의 신뢰감을 강화합니다.",
  comparison: "대안별 차이, 장단점, 선택 기준을 표 형태의 문장 흐름으로 풀어냅니다."
};

const sampleText = "강남 사무실 인테리어는 단순히 예쁜 공간을 만드는 일이 아닙니다. 업무 효율, 브랜드 이미지, 공사 일정, 예산 관리까지 함께 고려해야 안정적인 결과를 만들 수 있습니다.";

const initialInput: RewriteInput = {
  original: sampleText,
  primaryKeyword: "강남 사무실 인테리어",
  secondaryKeywords: "사무공간 리모델링, 인테리어 견적, 디자인빌드",
  audience: "사무실 이전 또는 리모델링을 검토 중인 대표와 실무 담당자",
  tone: "professional",
  intent: "commercial",
  forbiddenWords: "최고, 무조건, 1위"
};

function splitList(value: string) {
  return value
    .split(/[,,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function sentenceTrim(value: string, fallback: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return fallback;
  const firstSentence = normalized.split(/[.!?。！？]/)[0]?.trim();
  return firstSentence || fallback;
}

function buildRewrite(input: RewriteInput) {
  const primary = input.primaryKeyword.trim() || "핵심 키워드";
  const secondary = splitList(input.secondaryKeywords);
  const forbidden = splitList(input.forbiddenWords);
  const audience = input.audience.trim() || "의사결정자";
  const source = sentenceTrim(input.original, "원문에서 핵심 메시지를 추출해 검색 의도에 맞게 재구성합니다");
  const supportKeywords = secondary.length ? secondary.join(", ") : "관련 검색어";
  const titlePrefix = input.intent === "local" ? "지역 조건까지 보는" : input.intent === "comparison" ? "선택 전 비교하는" : "실무자가 확인할";
  const title = `${titlePrefix} ${primary} 가이드`;
  const meta = `${primary}를 검토하는 ${audience}를 위해 ${supportKeywords} 기준으로 판단 포인트를 정리했습니다.`;

  const lead = `${primary}는 검색 노출만을 위한 문장이 아니라 실제 의사결정에 필요한 근거를 담아야 합니다. ${source}. 이 글은 ${audience}가 빠르게 판단할 수 있도록 ${intentLabels[input.intent]} 관점으로 재작성되었습니다.`;

  const body = [
    {
      heading: `${primary}를 먼저 정의해야 하는 이유`,
      text: `${primary} 관련 콘텐츠는 문제 상황을 분명히 보여줄수록 체류 시간이 안정됩니다. 독자가 처한 조건, 예산 범위, 일정 제약을 먼저 제시하면 검색 의도와 본문 흐름이 자연스럽게 연결됩니다.`
    },
    {
      heading: `${supportKeywords}를 본문에 배치하는 방식`,
      text: `보조 키워드는 반복 삽입보다 문맥 안에서 역할을 나누는 편이 안전합니다. ${secondary[0] || "세부 주제"}는 배경 설명에, ${secondary[1] || "검토 기준"}은 선택 기준에, ${secondary[2] || "실행 방식"}은 실행 단계에 배치하면 과도한 키워드 사용을 피할 수 있습니다.`
    },
    {
      heading: `${toneLabels[input.tone]} 톤의 전환 포인트`,
      text: `${toneLabels[input.tone]} 문체에서는 단정적 표현보다 확인 가능한 근거가 중요합니다. ${intentGuides[input.intent]} 독자가 바로 비교할 수 있도록 체크 항목과 판단 기준을 함께 제시합니다.`
    }
  ];

  const checklist = [
    `${primary}가 제목, 첫 문단, 중간 소제목에 자연스럽게 포함되었는지 확인`,
    `본문이 ${audience}의 실제 질문에 답하는지 확인`,
    forbidden.length ? `금지어 제거: ${forbidden.join(", ")}` : "과장 표현과 근거 없는 최상급 표현 제거",
    "문의 전 확인할 기준 또는 다음 행동을 마지막 문단에 배치"
  ];

  const hashtags = [primary, ...secondary.slice(0, 4)]
    .map((tag) => `#${tag.replace(/\s+/g, "")}`)
    .join(" ");

  return { title, meta, lead, body, checklist, hashtags };
}

function scoreContent(input: RewriteInput) {
  const text = `${input.original} ${input.primaryKeyword} ${input.secondaryKeywords}`.toLowerCase();
  const primary = input.primaryKeyword.trim().toLowerCase();
  const secondary = splitList(input.secondaryKeywords);
  const forbidden = splitList(input.forbiddenWords);
  const keywordScore = primary && text.includes(primary) ? 25 : 8;
  const secondaryScore = clamp(secondary.length * 7, 0, 25);
  const lengthScore = clamp(Math.round(input.original.trim().length / 12), 0, 25);
  const riskPenalty = forbidden.some((word) => input.original.includes(word)) ? 12 : 0;
  return clamp(keywordScore + secondaryScore + lengthScore + 25 - riskPenalty, 0, 100);
}

export default function Home() {
  const [input, setInput] = useState<RewriteInput>(initialInput);
  const result = useMemo(() => buildRewrite(input), [input]);
  const score = useMemo(() => scoreContent(input), [input]);

  const update = <K extends keyof RewriteInput>(key: K, value: RewriteInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className="studio-shell">
      <section className="workspace-header">
        <div>
          <p className="eyebrow">PZ Naver SEO Studio</p>
          <h1>Rewrite Mode</h1>
        </div>
        <div className="score-panel" aria-label="SEO readiness score">
          <span>SEO Readiness</span>
          <strong>{score}</strong>
        </div>
      </section>

      <section className="studio-grid">
        <form className="input-panel">
          <label>
            원문
            <textarea value={input.original} onChange={(event) => update("original", event.target.value)} rows={9} />
          </label>

          <div className="field-row">
            <label>
              대표 키워드
              <input value={input.primaryKeyword} onChange={(event) => update("primaryKeyword", event.target.value)} />
            </label>
            <label>
              타깃 독자
              <input value={input.audience} onChange={(event) => update("audience", event.target.value)} />
            </label>
          </div>

          <label>
            보조 키워드
            <input value={input.secondaryKeywords} onChange={(event) => update("secondaryKeywords", event.target.value)} />
          </label>

          <div className="control-row">
            <fieldset>
              <legend>문체</legend>
              <div className="segmented-control">
                {(Object.keys(toneLabels) as Tone[]).map((tone) => (
                  <button key={tone} type="button" className={input.tone === tone ? "active" : ""} onClick={() => update("tone", tone)}>
                    {toneLabels[tone]}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>검색 의도</legend>
              <div className="segmented-control">
                {(Object.keys(intentLabels) as Intent[]).map((intent) => (
                  <button key={intent} type="button" className={input.intent === intent ? "active" : ""} onClick={() => update("intent", intent)}>
                    {intentLabels[intent]}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <label>
            제외 표현
            <input value={input.forbiddenWords} onChange={(event) => update("forbiddenWords", event.target.value)} />
          </label>
        </form>

        <section className="output-panel" aria-live="polite">
          <div className="output-section title-block">
            <span>추천 제목</span>
            <h2>{result.title}</h2>
            <p>{result.meta}</p>
          </div>

          <div className="output-section">
            <span>도입문</span>
            <p>{result.lead}</p>
          </div>

          <div className="rewrite-list">
            {result.body.map((section) => (
              <article key={section.heading} className="rewrite-card">
                <h3>{section.heading}</h3>
                <p>{section.text}</p>
              </article>
            ))}
          </div>

          <div className="quality-grid">
            <div className="output-section">
              <span>발행 체크</span>
              <ul>
                {result.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="output-section">
              <span>태그</span>
              <p className="hashtags">{result.hashtags}</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
