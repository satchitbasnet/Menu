import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { FirebaseAppCheck } from "@/components/FirebaseAppCheck";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Menu-To-Table | Premium Private Chef Marketplace",
  description:
    "Book world-class private chefs for intimate dinners, weekly meal prep, and hands-on cooking classes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <FirebaseAppCheck />
        {children}
      </body>
    </html>
  );
}
