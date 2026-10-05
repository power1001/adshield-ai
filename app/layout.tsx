import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdShield AI | Pre-Flight Ad Compliance & Landing Page Policy Scanner",
  description:
    "Reduce the risk of ad disapprovals and account penalties. Pre-flight AI compliance scanner for Meta (Facebook/Instagram), Google Ads, and TikTok with destination landing page audits.",
  keywords: [
    "facebook ad policy checker",
    "meta ad compliance scanner",
    "google ads destination checker",
    "ad copy policy checker",
    "landing page compliance audit",
    "tiktok ad policy scanner",
    "pre-flight ad checker",
    "ad approval risk calculator",
  ],
  authors: [{ name: "AdShield AI Technologies" }],
  creator: "AdShield AI",
  publisher: "AdShield AI",
  metadataBase: new URL("https://adshield.ai"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "en-GB": "/en-gb",
      "en-CA": "/en-ca",
      "en-AU": "/en-au",
      "es-ES": "/es",
      "pt-BR": "/pt",
      "de-DE": "/de",
      "fr-FR": "/fr",
      "hi-IN": "/hi",
    },
  },
  openGraph: {
    title: "AdShield AI — Pre-Flight Ad Compliance & Policy Protection",
    description:
      "Audit your Meta & Google ad copy and destination landing pages before hitting publish. Instant policy risk scores, 6-factor compliance matrix, and compliant AI rewrites.",
    url: "https://adshield.ai",
    siteName: "AdShield AI",
    images: [
      {
        url: "/og-adshield.png",
        width: 1200,
        height: 630,
        alt: "AdShield AI Pre-Flight Compliance Scanner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdShield AI | Check Your Ad Before You Publish",
    description: "AI-driven ad copy and landing page compliance auditor for Meta, Google & TikTok advertisers.",
    images: ["/og-adshield.png"],
    creator: "@adshieldai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "US",
    "geo.placename": "United States",
    "geo.position": "37.0902;-95.7129",
    ICBM: "37.0902, -95.7129",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AdShield AI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://adshield.ai",
  description:
    "AI-powered pre-flight ad compliance scanner and destination landing page auditor for digital advertisers.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    category: "Free Pre-Flight Scan",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1240",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-emerald-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
