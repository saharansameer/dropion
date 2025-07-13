import type { Metadata } from "next";
import { Montserrat, Geist_Mono, Merriweather } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/context/ThemeProvider";
import SonnerToaster from "@/components/Layout/SonnerToaster";
// import DisableContextMenu from "@/components/Layout/DisableContextMenu";
import { ClerkProvider } from "@clerk/nextjs";

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
  description:
    "A lightweight and modern file-sharing web-app to manage your drops with ease.",
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
          className={`${montserrat.variable} ${geistMono.variable} ${merriweather.variable} antialiased font-mono`}
        >
          <ThemeProvider>
            <main>
              {children}
              <SonnerToaster />
            </main>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
