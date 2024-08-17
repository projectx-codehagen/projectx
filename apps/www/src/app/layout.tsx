import "../styles/globals.css";

import { fontHeading, fontSans, fontUrban } from "@/assets/fonts";

import { Toaster } from "@dingify/ui/components/sonner";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Analytics } from "@/components/analytics";
import { ModalProvider } from "@/components/modal-provider";
import { Providers } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["badget", "open source", "tracker", "free", "budget", "finance"],
  authors: [
    {
      name: "christer",
    },
  ],
  creator: "codehagen",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@codehagen",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontUrban.variable,
          fontHeading.variable,
        )}
      >
        <Providers attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
          <Toaster richColors />
          <ModalProvider />
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
