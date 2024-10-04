import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/toaster";
import { FilterProvider } from "@/components/layout/FilterContext";
import { SearchProvider } from "@/components/layout/SearchContext";
import { ClerkProvider } from "@clerk/nextjs";

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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <ClerkProvider>
              <FilterProvider>
                <SearchProvider>
                  <Navbar />
                  {children}
                  <Toaster />
                </SearchProvider>
              </FilterProvider>
            </ClerkProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
