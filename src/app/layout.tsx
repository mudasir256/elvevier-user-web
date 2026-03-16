import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Evlevier – Cozy Fashion for Everyone",
  description:
    "Men's, women's & kids clothing, shoes, belts, caps, bags and more. Free shipping on orders above Rs. 2,500.",
  icons: {
    icon: "/kairo/favicon.png",
    apple: "/kairo/favicon.png",
  },
};

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
