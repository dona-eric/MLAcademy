import type { Metadata } from "next";
import { Geist, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import {ConditionalHeader,ConditionalFooter,MainWrapper,} from "../components/layout/ConditionalLayoutHelpers";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MLAcademy: Apprenez la Data Science et le Machine Learning",
  description:
    "La plateforme de référence francophone pour se former en Machine Learning, Data Science et IA. Cours, notebooks interactifs et certifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geist.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] min-h-screen flex flex-col">
        <AuthProvider>
          <ConditionalHeader />
          <MainWrapper>{children}</MainWrapper>
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
