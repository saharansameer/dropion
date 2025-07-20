import type { Metadata } from "next";
import HeroSection from "@/components/Hero/hero-section";

export const metadata: Metadata = {
  title: "Dropion",
  description: "A lightweight and modern file-sharing web-app.",
};

export default function Home() {
  return <HeroSection />;
}
