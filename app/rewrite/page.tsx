"use client";

import { useMemo, useState } from "react";
import type { RewriteApiResponse, RewriteRequest, SearchIntent, Tone } from "../../lib/pz-naver-seo/types";

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

const initialInput: Required<RewriteRequest> = {
  original: "강남 사무실 인테리어는 단순히 예쁜 공간을 만드는 일이 아닙니다. 업무 효율, 브랜드 이미지, 공사 일정, 예산 관리까지 함께 고려해야 안정적인 결과를 만들 수 있습니다.",
  primaryKeyword: "강남 사무실 인테리어",
  secondaryKeywords: "사무공간 리모델링, 인테리어 견적, 디자인빌드",
  audience: "사무실 이전 또는 리모델링을 검토 중인 대표와 실무 담당자",
  tone: "professional",
  intent: "commercial",
  forbiddenWords: "최고, 무조건, 1위"
};

function splitList(value = "") {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function localPreview(input: Required<RewriteRequest>) {
  const secondary = splitList(input.secondaryKeywords);
  const primary = input.primaryKeyword.trim() || "핵심 키워드";
  const supportKeywords = secondary.length ? secondary.join(", ") : "관련 검색어";

  return {
    title: `실무자가 확인할 ${primary} 가이드`,
    meta: `${primary}를 검토하는 ${input.audience}를 위해 ${supportKeywords} 기준의 판단 포인트를 정리했습니다.`,
    lead: `${primary}는 검색 노출만을 위한 문장이 아니라 실제 의사결정에 필요한 근거를 담아야 합니다. 예산, 일정, 현장 조건, 시공 리스크를 함께 검토하는 흐름으로 재작성합니다.`,
    body: [
      {
        heading: `${primary}를 먼저 정의해야 하는 이유`,
        text: "문제 상황과 의사결정 기준을 먼저 제시하면 검색 의도와 본문 흐름이 자연스럽게 연결됩니다."
      },
      {
        heading: `${supportKeywords}를 본문에 배치하는 방식`,
        text: "보조 키워드는 반복 삽입보다 배경 설명, 선택 기준, 실행 단계에 나누어 배치하는 편이 안전합니다."
      }
    ],
    checklist: ["원문 누락 확인", "필수 10개 Markdown 섹션 확인", "Meta Title과 Meta Description 확인", "금지어 제거"],
    hashtags: [primary, ...secondary.slice(0, 4)].map((tag) => `#${tag.replace(/\s+/g, "")}`).join(" ")
  };
}

function scorePreview(input: Required<RewriteRequest>) {
  const lengthScore = Math.min(25, Math.round(input.original.length / 12));
  const keywordScore = input.original.includes(input.primaryKeyword) ? 25 : 8;
  const secondaryScore = Math.min(25, splitList(input.secondaryKeywords).length * 7);
  return Math.min(100, keywordScore + secondaryScore + lengthScore + 25);
}

export default function RewritePage() {
  const [input, setInput] = useState<Required<RewriteRequest>>(initialInput);
  const [apiResult, setApiResult] = useState<RewriteApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const preview = useMemo(() => localPreview(input), [input]);
  const score = apiResult?.result.score.total ?? scorePreview(input);

  const update = <K extends keyof Required<RewriteRequest>>(key: K, value: Required<RewriteRequest>[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  async function submitRewrite() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Rewrite request failed");
      }

      setApiResult(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Rewrite request failed");
    } finally {
      setIsLoading(false);
    }
  }

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
        <form className="input-panel" onSubmit={(event) => event.preventDefault()}>
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
                {(Object.keys(intentLabels) as SearchIntent[]).map((intent) => (
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

          <button className="primary-action" type="button" onClick={submitRewrite} disabled={isLoading}>
            {isLoading ? "진단 중" : "SEO 진단 및 재작성"}
          </button>
          {error ? <p className="error-message">{error}</p> : null}
        </form>

        <section className="output-panel" aria-live="polite">
          <div className="output-section title-block">
            <span>추천 제목</span>
            <h2>{apiResult?.result.seoPackage.title ?? preview.title}</h2>
            <p>{apiResult?.result.seoPackage.metaDescription ?? preview.meta}</p>
          </div>

          <div className="output-section">
            <span>도입문</span>
            <p>{preview.lead}</p>
          </div>

          <div className="rewrite-list">
            {preview.body.map((section) => (
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
                {(apiResult?.result.checklist ?? preview.checklist).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="output-section">
              <span>태그</span>
              <p className="hashtags">{preview.hashtags}</p>
            </div>
          </div>

          <div className="output-section markdown-output">
            <span>최종 Markdown</span>
            <pre>{apiResult?.markdown ?? "SEO 진단 및 재작성 실행 후 10개 섹션 Markdown이 표시됩니다."}</pre>
          </div>
        </section>
      </section>
    </main>
  );
}
