import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Suspense } from "react";
import UTMTracker from "@/components/UTMTracker";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spotbid.top"),
  title: "SpotBid | Bid to rank. Get seen.",
  description:
    "The live attention leaderboard. Real-time bidding for public brand placement.",
  keywords: [
    "billboard ad space",
    "buy billboard ad online",
    "attention billboard",
    "indie hacker marketing",
    "startup promotion",
    "public attention board",
    "real-time advertising auction",
    "outbid billboard",
    "buy website ad banner",
    "tech product discovery",
  ],
  authors: [{ name: "SpotBid", url: "https://spotbid.top" }],
  creator: "SpotBid",
  publisher: "SpotBid",
  alternates: {
    canonical: "https://spotbid.top/",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    url: "https://spotbid.top/",
    siteName: "SpotBid",
    title: "SpotBid | Bid to rank. Get seen.",
    description:
      "The live attention leaderboard. Real-time bidding for public brand placement.",
    images: [
      {
        url: "https://spotbid.top/social-card.png",
        width: 1200,
        height: 630,
        alt: "SpotBid - The Live Attention Billboard",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpotBid | Bid to rank. Get seen.",
    description:
      "The live attention leaderboard. Real-time bidding for public brand placement.",
    images: [
      {
        url: "https://spotbid.top/social-card.png",
        alt: "SpotBid - The Live Attention Billboard",
      },
    ],
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SpotBid",
    url: "https://spotbid.top",
    description:
      "The live attention leaderboard. Real-time bidding for public brand placement.",
  };

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HK8NPSVDJP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HK8NPSVDJP');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "y9nk5o05ph");
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
        <Suspense fallback={null}>
          <UTMTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
