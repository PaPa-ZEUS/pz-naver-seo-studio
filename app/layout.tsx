import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PZ Naver SEO Studio",
  description: "Rewrite Mode for Naver SEO content planning and rewriting"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
