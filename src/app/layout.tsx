import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ReduxProvider } from "@/store/ReduxProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { BottomTab } from "@/components/BottomTab";

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
          document.querySelectorAll('[bis_skin_checked]').forEach(function(e){e.removeAttribute('bis_skin_checked')});
          new MutationObserver(function(m,o){m.forEach(function(r){r.addedNodes.forEach(function(n){if(n.nodeType===1){n.removeAttribute('bis_skin_checked');n.querySelectorAll('[bis_skin_checked]').forEach(function(e){e.removeAttribute('bis_skin_checked')})}})});o.disconnect()}).observe(document.documentElement,{childList:true,subtree:true});
        `}</Script>
        <ReduxProvider>
          <CartProvider>
            <div className="contents" suppressHydrationWarning>
              <Header />
              <main className="flex-1 pb-14 md:pb-0">{children}</main>
              <Footer />
              <BottomTab />
              <CartDrawer />
            </div>
          </CartProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
