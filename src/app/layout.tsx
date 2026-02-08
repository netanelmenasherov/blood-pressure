import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Antigravity BP Log",
  description: "Simple, fast, and secure blood pressure tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clsx(inter.variable, "antialiased")}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
        <main className="flex-1 w-full max-w-lg mx-auto p-4 sm:p-6 md:max-w-xl lg:max-w-2xl">
          {children}
        </main>
        <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-600">
          <p>© {new Date().getFullYear()} Antigravity BP Log. Not medical advice.</p>
        </footer>
      </body>
    </html >
  );
}
