import type { Metadata } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  title: "Le Délice Traiteur - Service de Traiteur Gastronomique",
  description: "Découvrez nos menus gastronomiques et nos plats délicieux",
  openGraph: {
    image: "https://bolt.new/static/og_default.png",
  },
  twitter: {
    card: "summary_large_image",
    image: "https://bolt.new/static/og_default.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
