import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seeker",
  description: "Job application tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-14 max-w-7xl items-center px-4 md:px-6 lg:px-8">
            <a href="/" className="font-semibold tracking-tight">
              Seeker
            </a>
            <div className="flex-1" />
            <nav className="flex items-center gap-4 text-sm">
              <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl flex-1">{children}</main>
      </body>
    </html>
  );
}