import { NextResponse } from "next/server";
import { runRewritePipeline } from "../../../lib/pz-naver-seo/rewritePipeline";
import { validateOriginal } from "../../../lib/pz-naver-seo/validators";
import type { RewriteRequest } from "../../../lib/pz-naver-seo/types";

export async function POST(request: Request) {
  let payload: RewriteRequest;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const originalIssues = validateOriginal(payload);
  if (originalIssues.some((issue) => issue.severity === "error")) {
    return NextResponse.json({ ok: false, error: "VALIDATION_ERROR", issues: originalIssues }, { status: 400 });
  }

  const response = await runRewritePipeline(payload);
  return NextResponse.json(response);
}
