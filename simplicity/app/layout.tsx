import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Newsreader } from "next/font/google";
import { Toaster } from "sonner";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { MobileTabBar } from "@/components/site/nav-links";
import { ThemeProvider } from "@/components/site/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { absoluteUrl } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: { default: "Simplicity — where words bloom", template: "%s · Simplicity" },
  description:
    "A community for poetry, short stories, essays and micro-writing. Read, write, and keep the words that move you.",
  openGraph: { siteName: "Simplicity", type: "website" },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#14161d" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${fraunces.variable}`}
    >
      <body className="min-h-dvh font-sans">
        <ThemeProvider>
          <TooltipProvider delayDuration={300}>
            <Header />
            <main className="min-h-[70vh]">{children}</main>
            <Footer />
            <MobileTabBar />
            <Toaster position="bottom-center" toastOptions={{ className: "font-sans" }} />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
