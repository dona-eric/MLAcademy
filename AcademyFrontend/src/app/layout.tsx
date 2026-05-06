import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import {
  ConditionalHeader,
  ConditionalFooter,
  MainWrapper,
} from "../components/layout/ConditionalLayoutHelpers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MLAcademy - Apprenez la Data Science et le Machine Learning",
  description:
    "La plateforme de référence francophone pour se former en Machine Learning, Data Science et IA. Cours, notebooks interactifs et certifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${outfit.variable}`}
    >
      <body>
        <AuthProvider>
          <ConditionalHeader />
          <MainWrapper>{children}</MainWrapper>
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
