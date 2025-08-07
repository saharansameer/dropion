"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  Shield,
  Zap,
  LinkIcon,
  Cloud,
  FileText,
  ImageIcon,
  Video,
  FileType,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const floatingFiles = [
    { icon: FileText, delay: 0, x: -20, y: -30, color: "text-blue-500" },
    { icon: ImageIcon, delay: 0.2, x: 20, y: -20, color: "text-green-500" },
    { icon: Video, delay: 0.4, x: 0, y: -40, color: "text-purple-500" },
    { icon: FileType, delay: 0.6, x: -30, y: 10, color: "text-orange-500" },
  ];

  const supportedTypes = [
    {
      icon: ImageIcon,
      name: "Images",
      formats: "JPG, PNG, WebP, JPEG",
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      icon: Video,
      name: "Videos",
      formats: "MP4, MOV, WebM",
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      icon: FileText,
      name: "Documents",
      formats: "PDF, TXT",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Storage",
      description:
        "Your files are stored securely with ImageKit's infrastructure",
    },
    {
      icon: Zap,
      title: "Fast Uploads",
      description: "Quick file uploads and downloads with global CDN delivery",
    },
    {
      icon: LinkIcon,
      title: "Easy Sharing",
      description: "Generate shareable links for your files instantly",
    },
  ];

  const steps = [
    {
      step: 1,
      title: "Upload",
      desc: "Select or drag & drop your files",
      icon: Upload,
    },
    {
      step: 2,
      title: "Store",
      desc: "Files saved to ImageKit storage",
      icon: Cloud,
    },
    {
      step: 3,
      title: "Share",
      desc: "Get a link to share with others",
      icon: LinkIcon,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex justify-center overflow-hidden bg-gradient-to-br from-background via-muted/20 to-muted/40">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.05),transparent_50%)]" />

        <div className="container px-4 md:px-6 z-10 max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Dropion Logo */}
            <motion.div
              className="flex items-center space-x-2 mt-5 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="/logo.png"
                alt="Dropion Logo"
                width={50}
                height={50}
              />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-3xl font-sans text-primary">
                  Dropion
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                Share files
                <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  effortlessly
                </span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed sm:px-20">
                A simple file sharing app built with Next.js and ImageKit.
                Upload your images, videos, PDFs, and text files, then manage
                them with ease.
              </p>
            </motion.div>

            {/* Animated File Upload Visual */}
            <motion.div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-48 sm:h-52 md:h-56 mx-auto mb-20 mt-5">
              <motion.div
                className="w-full h-full relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center h-full p-12">
                  <div>
                    <Cloud className="w-20 h-20 sm:w-32 sm:h-32 text-primary" />
                  </div>
                </div>

                {floatingFiles.map((file, index) => {
                  const baseAngle = index * (360 / floatingFiles.length);
                  const radius = 120;

                  return (
                    <motion.div
                      key={index}
                      className="absolute"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 12 + index * 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      style={{
                        top: "50%",
                        left: "50%",
                        transformOrigin: "0px 0px",
                      }}
                    >
                      <motion.div
                        className="bg-card/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 m-10 sm:m-14 shadow-lg border border-border/20"
                        style={{
                          transform: `translate(${radius}px, 0px) rotate(-${baseAngle}deg)`,
                        }}
                        animate={{
                          rotate: -360,
                        }}
                        transition={{
                          duration: 12 + index * 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <file.icon
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${file.color}`}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* CTA Links */}
            <motion.div
              className="flex w-full max-w-xs mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                href="/sign-up"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 group font-medium"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Supported File Types */}
      <section className="py-20 bg-muted/60">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Supported file types
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload and share these file formats
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {supportedTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:bg-card/80 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <type.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {type.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {type.formats}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple file sharing in three steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent -translate-x-1/2" />
                )}
                <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="w-52 mx-auto">
                  <h3 className="font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/60">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for basic file sharing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:bg-card/80 transition-all duration-300 group h-full">
                  <CardContent className="p-6 text-center">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg group-hover:scale-110 transition-transform w-fit mx-auto mb-4">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-2 sm:py-4 border-t border-border bg-background antialiased">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground font-sans">
              &copy; 2025 Dropion. All Rights Reserved.
            </p>

            <div className="flex items-center space-x-1 text-xs text-muted-foreground font-sans">
              <p>built by</p>
              <Link
                href={"https://sameersaharan.com"}
                className="cursor-pointer hover:underline text-accent-foreground"
              >
                Sameer Saharan
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
