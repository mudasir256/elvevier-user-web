import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider, type CartItem } from "@/context/CartContext";
import { MetaPixelPageView } from "@/components/MetaPixel";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { readCartCookie } from "@/lib/cartToken";
import { ReduxProvider } from "@/store/ReduxProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteTitle = "Empulse – Fashion that feels like home";
const siteDescription =
  "Men's, women's & kids clothing, shoes, belts, caps, bags and more. Free shipping on orders above Rs. 5,000.";

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
    icon: [{ url: "/favicon.png?v=4", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png?v=4", sizes: "180x180" }],
    shortcut: "/favicon.ico?v=4",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "Empulse",
    type: "website",
    images: [
      {
        url: "/og.png?v=4",
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
    images: ["/og.png?v=4"],
  },
  };
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialItems = readCartCookie(cookieStore.get("empulse_cart_items")?.value) as CartItem[];

  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <Script id="meta-pixel" strategy="beforeInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2266171220896490');
          if (location.pathname.indexOf('/admin') !== 0) fbq('track', 'PageView');
        `}</Script>
      </head>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2266171220896490&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <MetaPixelPageView />
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
          <CartProvider initialItems={initialItems}>
            {children}
            <WhatsAppButton />
          </CartProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
