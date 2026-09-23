import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "EKT AI — прототип", description: "ИИ-консультант по каталогу ekt.kz" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
