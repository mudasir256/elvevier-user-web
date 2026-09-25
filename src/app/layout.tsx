import type { Metadata } from "next";
import { headers } from "next/headers";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ReduxProvider } from "@/store/ReduxProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteTitle = "Empulse – Cozy Fashion for Everyone";
const siteDescription =
  "Men's, women's & kids clothing, shoes, belts, caps, bags and more. Free shipping on orders above Rs. 2,500.";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto =
    headerList.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https");
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (host ? `${proto}://${host}` : "http://localhost:3000");

  return {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: "Empulse",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "Empulse",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Empulse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.png"],
  },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <Script id="strip-bis" strategy="beforeInteractive">{`
          (function(){
            function strip(el){el.removeAttribute('bis_skin_checked');}
            document.querySelectorAll('[bis_skin_checked]').forEach(strip);
            new MutationObserver(function(mutations){
              mutations.forEach(function(m){
                if(m.type==='attributes'&&m.attributeName==='bis_skin_checked'){
                  strip(m.target);
                }
                if(m.type==='childList'){
                  m.addedNodes.forEach(function(n){
                    if(n.nodeType===1){
                      strip(n);
                      n.querySelectorAll('[bis_skin_checked]').forEach(strip);
                    }
                  });
                }
              });
            }).observe(document.documentElement,{attributes:true,attributeFilter:['bis_skin_checked'],childList:true,subtree:true});
          })();
        `}</Script>
        <ReduxProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
