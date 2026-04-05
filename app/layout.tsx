import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RFP-Copilot | AI-Powered RFP Response Automation",
  description: "Enterprise AI Platform for Industrial Manufacturers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
