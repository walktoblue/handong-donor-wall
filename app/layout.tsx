import type { Metadata } from "next";
import { Noto_Serif, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "한동대학교 온라인 도너월",
  description: "한동대 후원자가 이름을 검색하면 갈대상자 컨셉의 감사 메시지를 받는 기부자 감사 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSerif.variable} ${notoSansKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
