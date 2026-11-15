import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configure the clean, modern Marketplace-style sans-serif font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Buy and sell items locally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Adding inter.className and font-sans ensures no serif fonts leak through */}
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
