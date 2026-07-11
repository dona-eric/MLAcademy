import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import {ConditionalHeader, ConditionalFooter, MainWrapper } from "@/components/layout/ConditionalLayoutHelpers";
import { GlobalAIAssistant } from "@/components/GlobalAIAssistant";

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
    <html lang="fr" className="antialiased font-sans">
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] min-h-screen flex flex-col">
        <AuthProvider>
          <ConditionalHeader />
          <MainWrapper>{children}</MainWrapper>
          <GlobalAIAssistant />
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
