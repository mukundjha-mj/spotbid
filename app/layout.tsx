import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpotBid | Bid to rank. Get seen. The Public Attention Billboard",
  description:
    "SpotBid is a live attention billboard and transparent bidding board. Claim high-visibility ad spots, outbid competitors, and showcase your startup or brand to global tech traffic.",
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
  metadataBase: new URL("https://spotbid.top"),
  alternates: {
    canonical: "https://spotbid.top",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "SpotBid | Bid to rank. Get seen.",
    description: "The live attention billboard. Real-time bidding for public brand placement.",
    url: "https://spotbid.top",
    siteName: "SpotBid",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://spotbid.top/og-image.png",
        width: 1200,
        height: 630,
        alt: "SpotBid | Bid to rank. Get seen.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpotBid | Bid to rank. Get seen.",
    description: "The live attention billboard. Real-time bidding for public brand placement.",
    images: ["https://spotbid.top/og-image.png"],
    creator: "@spotbid",
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
    description: "The live attention billboard. Real-time bidding for public brand placement.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://spotbid.top/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        {/* Canonical Link */}
        <link rel="canonical" href="https://spotbid.top" />

        {/* Explicit OpenGraph & Twitter Card Meta Tags */}
        <meta property="og:title" content="SpotBid | Bid to rank. Get seen." />
        <meta
          property="og:description"
          content="The live attention leaderboard. Real-time bidding for public brand placement."
        />
        <meta property="og:image" content="https://spotbid.top/og-image.png" />
        <meta property="og:url" content="https://spotbid.top" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SpotBid" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SpotBid | Bid to rank. Get seen." />
        <meta
          name="twitter:description"
          content="The live attention leaderboard. Real-time bidding for public brand placement."
        />
        <meta name="twitter:image" content="https://spotbid.top/og-image.png" />

        {/* Structured Data (JSON-LD) for Search Engines */}
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
        {children}
      </body>
    </html>
  );
}
