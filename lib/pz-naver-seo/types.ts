export type Tone = "professional" | "friendly" | "premium" | "local";

export type SearchIntent = "informational" | "commercial" | "local" | "comparison";

export type RewriteRequest = {
  original: string;
  primaryKeyword: string;
  secondaryKeywords?: string;
  audience?: string;
  tone?: Tone;
  intent?: SearchIntent;
  forbiddenWords?: string;
};

export type ScoreBreakdown = {
  searchIntent: number;
  readability: number;
  expertise: number;
  originality: number;
  structure: number;
  seo: number;
  conversion: number;
  total: number;
};

export type RewriteAnalysis = {
  mode: "openai" | "fallback";
  targetAudience: string;
  searchIntent: SearchIntent;
  primaryKeyword: string;
  secondaryKeywords: string[];
};

export type RewriteDiagnosis = {
  strengths: string[];
  risks: string[];
  practicalCriteria: string[];
};

export type SeoPackage = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  body: string;
  faq: Array<{ question: string; answer: string }>;
  internalLinks: string[];
  imageIdeas: string[];
};

export type RewriteResult = {
  analysis: RewriteAnalysis;
  diagnosis: RewriteDiagnosis;
  score: ScoreBreakdown;
  seoPackage: SeoPackage;
  checklist: string[];
  improvements: string[];
};

export type RewriteApiResponse = {
  ok: true;
  markdown: string;
  result: RewriteResult;
};

export type ValidationIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};
