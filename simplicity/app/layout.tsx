import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/toaster";
import { FilterProvider } from "@/components/layout/FilterContext";
import { SearchProvider } from "@/components/layout/SearchContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simplicity",
  description:
    "Simplicity is an app that shows poetries that are simple and deserves to be read.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://supalytics.co/track.js"
          data-website-id="89d21cd1-5922-47a3-9e9f-6ecabd65704e"
        ></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <FilterProvider>
              <SearchProvider>
                <Navbar />
                {children}
                <Toaster />
              </SearchProvider>
            </FilterProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
