import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "AI VIDEO PROMPT STUDIO", description: "Biến dữ liệu sản phẩm thật thành prompt video nhất quán." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="vi"><body>{children}</body></html>; }
