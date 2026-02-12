import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DBKL Flat Management",
  description: "Finance and management portal for DBKL flats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <div className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
              <Sidebar />
            </div>

            {/* Main Content */}
            <main className="md:pl-72 flex flex-col flex-1 h-full min-h-screen transition-all duration-300 ease-in-out relative">
              <Header />
              <div className="flex-1 p-6 md:p-8 space-y-6 overflow-auto">
                {children}
              </div>
              <Footer />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
