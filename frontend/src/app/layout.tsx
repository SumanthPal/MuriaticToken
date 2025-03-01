import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '../app/global.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muriatic Token Dashboard",
  description: "ERC-20 Token Frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f0e17] text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}