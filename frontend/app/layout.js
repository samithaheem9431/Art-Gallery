import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Zarmina Bashir Art — Original Paintings",
    template: "%s | Zarmina Bashir Art",
  },
  description:
    "Original paintings by Zarmina Bashir, a painter based in Islamabad, Pakistan. Explore Stallions, Figurative and Abstract collections.",
  keywords: ["Zarmina Bashir", "art", "paintings", "Pakistani art", "oil painting", "abstract art"],
  openGraph: {
    title: "Zarmina Bashir Art — Original Paintings",
    description: "Original paintings by Zarmina Bashir. Explore the collections.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
