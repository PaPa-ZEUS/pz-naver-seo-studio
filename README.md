# PZ Naver SEO Studio

PZ Naver SEO Studio Rewrite Mode는 네이버 검색 노출을 고려해 원문, 대표 키워드, 보조 키워드, 타깃 독자, 문체, 검색 의도를 입력하고 즉시 재작성 초안을 만드는 Next.js 앱입니다.

## 주요 기능

- 원문 기반 SEO 재작성 초안 생성
- 대표 키워드와 보조 키워드의 문맥형 배치 제안
- 검색 의도별 문장 구조 조정
- 제외 표현 점검
- 제목, 메타 설명, 도입문, 본문 섹션, 발행 체크리스트, 태그 출력
- 클라이언트 사이드 실행으로 별도 API 키 없이 사용 가능

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 빌드

```bash
npm run build
npm run start
```

## 기술 구성

- Next.js App Router
- TypeScript
- React
- 전역 CSS 기반의 단순한 스타일 구조

## 운영 메모

현재 버전은 안정적인 초기 운영을 위해 외부 AI API 없이 규칙 기반으로 동작합니다. 이후 OpenAI API, Notion, Google Sheets, Naver 데이터랩 등과 연동하면 키워드 리서치, 콘텐츠 히스토리 관리, 품질 점수 자동화까지 확장할 수 있습니다.
