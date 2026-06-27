# AGENTS.md

## 프로젝트 목적

PZ Naver SEO Studio는 네이버 SEO 콘텐츠의 진단, 재작성, 품질 점수화, 발행 전 점검을 지원하는 업무용 Next.js 앱입니다.

## 작업 원칙

- 기존 UI와 사용자 흐름을 보존합니다.
- Rewrite Framework 로직은 `lib/pz-naver-seo` 아래 모듈로 분리합니다.
- API 응답 구조는 `ok`, `markdown`, `result` 형태를 유지합니다.
- `OPENAI_API_KEY`가 없을 때도 규칙 기반 fallback이 정상 동작해야 합니다.
- 품질 점수는 7개 항목 합계가 100점을 초과하지 않아야 합니다.
- 최종 Markdown은 필수 10개 섹션을 항상 포함해야 합니다.

## 검증

변경 후 다음 명령을 확인합니다.

```bash
npm test
npm run build
```

## 운영 환경

- `OPENAI_API_KEY`: OpenAI API 사용 시 설정합니다.
- `OPENAI_MODEL`: 기본값은 `gpt-5.5`입니다.
