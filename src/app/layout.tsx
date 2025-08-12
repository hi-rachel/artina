import type { Metadata } from "next";
import "@/styles/globals.css";
import { GoogleTagManager } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Artina",
  description: "Where art meets you.",
  openGraph: {
    title: "Artina",
    description: "Where art meets you | AI Docent",
    images: [
      {
        url: "/artina-og.png",
        width: 1200,
        height: 630,
        alt: "Artina - Where art meets you",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artina",
    description: "Where art meets you | AI Docent",
    images: ["/artina-og.png"],
  },
  icons: {
    icon: [
      {
        url: "/icon",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    apple: [
      {
        url: "/apple-icon",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  manifest: "/manifest.json",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="G-VZ4FZ5CQYL" />
      <body className={`antialiased`}>{children}</body>
    </html>
  );
};

export default RootLayout;
