import type { Metadata } from "next";
import { Montserrat, Geist_Mono, Merriweather } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/context/ThemeProvider";
import SonnerToaster from "@/components/Layout/SonnerToaster";
import { ClerkProvider } from "@clerk/nextjs";
import { PageTransition } from "@/components/Layout/PageTransition";

const montserrat = Montserrat({
  variable: "--font-montserrat-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dropion",
  description: "Share Files Without The Fuss",
  metadataBase: new URL("https://dropion.sameersaharan.com"),
  alternates: {
    canonical: "https://dropion.sameersaharan.com",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Dropion",
    description:
      "A lightweight and modern web-app for managing and sharing files.",
    url: "https://dropion.sameersaharan.com",
    siteName: "Dropion",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Dropion - A lightweight and modern web-app for managing and sharing files.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dropion",
    description:
      "A lightweight and modern web-app for managing and sharing files.",
    images: ["/og.png"],
    creator: "@sameersaharanx",
  },
  keywords: ["file sharing", "dropbox", "Dropion", "dropion", "sameer saharan"],
  authors: [{ name: "Sameer Saharan", url: "https://sameersaharan.com" }],
  creator: "Sameer Saharan",
  publisher: "Sameer Saharan",
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body
          className={`${montserrat.variable} ${geistMono.variable} ${merriweather.variable} antialiased font-mono transition-theme ease-initial duration-200 animate-accordion-down`}
        >
          <ThemeProvider>
            <PageTransition>
              <main>
                {children}
                <SonnerToaster />
              </main>
            </PageTransition>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
