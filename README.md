# PZ Naver SEO Studio

PZ Naver SEO Studio Rewrite Mode는 네이버 검색 노출을 고려해 원문, 대표 키워드, 보조 키워드, 타깃 독자, 문체, 검색 의도를 입력하고 SEO 진단과 재작성 Markdown을 생성하는 Next.js 앱입니다.

## 주요 기능

- `/rewrite` 화면에서 원문 기반 SEO 재작성 실행
- `POST /api/rewrite` API 제공
- OpenAI API 키가 있으면 실제 SEO 진단 및 재작성 요청
- OpenAI API 키가 없으면 규칙 기반 fallback 실행
- 7개 항목 품질 점수 계산
- 필수 10개 Markdown 섹션 렌더링
- 금지어, 과장 표현, 키워드 과다 반복, 실무 판단 기준 누락 검증

## 로컬 실행법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000/rewrite`로 접속합니다. 루트 경로 `/`는 `/rewrite`로 이동합니다.

## 테스트와 빌드

```bash
npm test
npm run build
```

## Vercel 배포법

1. Vercel에서 GitHub 저장소 `PaPa-ZEUS/pz-naver-seo-studio`를 Import합니다.
2. Framework Preset은 Next.js를 선택합니다.
3. Build Command는 `npm run build`를 사용합니다.
4. 필요 시 Environment Variables에 `OPENAI_API_KEY`, `OPENAI_MODEL`을 추가합니다.
5. Deploy를 실행합니다.

## OPENAI_API_KEY 설정법

로컬에서는 `.env.local` 파일을 만들고 다음 값을 설정합니다.

```bash
OPENAI_API_KEY=sk-...
```

설정하지 않으면 `/api/rewrite`는 규칙 기반 fallback으로 동작합니다.

## OPENAI_MODEL 설정법

기본 모델 값은 `.env.example` 기준 `gpt-5.5`입니다.

```bash
OPENAI_MODEL=gpt-5.5
```

운영 환경에서 다른 모델을 사용할 경우 Vercel Environment Variables 또는 `.env.local`에서 변경합니다.

## /rewrite 사용법

1. 원문을 입력합니다.
2. 대표 키워드와 보조 키워드를 입력합니다.
3. 타깃 독자, 문체, 검색 의도를 선택합니다.
4. 제외 표현을 입력합니다.
5. `SEO 진단 및 재작성` 버튼을 눌러 최종 Markdown을 생성합니다.

## /api/rewrite 사용법

요청:

```bash
curl -X POST http://localhost:3000/api/rewrite \
  -H "Content-Type: application/json" \
  -d '{
    "original": "사무실 인테리어는 예산, 일정, 현장 조건을 함께 검토해야 합니다.",
    "primaryKeyword": "사무실 인테리어",
    "secondaryKeywords": "인테리어 견적, 디자인빌드",
    "audience": "사무실 이전을 검토하는 대표",
    "tone": "professional",
    "intent": "commercial",
    "forbiddenWords": "최고, 무조건"
  }'
```

응답:

```json
{
  "ok": true,
  "markdown": "...",
  "result": {
    "analysis": {},
    "diagnosis": {},
    "score": {},
    "seoPackage": {},
    "checklist": []
  }
}
```

## 필수 Markdown 섹션

최종 출력은 다음 10개 섹션을 포함합니다.

- `## 1. SEO 진단 결과`
- `## 2. 품질 점수`
- `## 3. 개선 포인트`
- `## 4. 최적화 제목`
- `## 5. 최적화 본문`
- `## 6. FAQ`
- `## 7. 메타 정보`
- `## 8. 내부 링크 추천`
- `## 9. 이미지 추천`
- `## 10. 최종 체크리스트`
