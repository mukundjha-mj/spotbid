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
  title: "SpotBid | Bid to rank. Get seen.",
  description:
    "The live attention leaderboard. Bid to secure high-visibility spots on the public board. When someone outbids you, you get replaced.",
  metadataBase: new URL("https://spotbid.top"),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "SpotBid | Bid to rank. Get seen.",
    description: "The live attention leaderboard. Real-time bidding for public brand placement.",
    url: "https://spotbid.top",
    siteName: "SpotBid",
    locale: "en",
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
    description: "The live attention leaderboard. Real-time bidding for public brand placement.",
    images: ["https://spotbid.top/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
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
