import type { Metadata } from "next";
import "@/styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  metadataBase: new URL("https://artina-gallery.vercel.app"),
  title: "Artina",
  description: "Where art meets you.",
  openGraph: {
    title: "Artina",
    description: "Where art meets you | AI Docent",
    siteName: "Artina",
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
      <GoogleAnalytics gaId={"G-VZ4FZ5CQYL"} />
      <body className={`antialiased`}>{children}</body>
    </html>
  );
};

export default RootLayout;
