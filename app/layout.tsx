import type { Metadata } from "next";
import Script from "next/script";
import "../src/index.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ngalam-traiteur.fr"),

  title: {
    default: "Ngalam Traiteur à Bailly | Traiteur Événementiel en Yvelines",
    template: "%s | Ngalam Traiteur",
  },

  description:
    "Ngalam Traiteur à Bailly (78) vous propose un service de traiteur pour mariages, événements privés et professionnels. Cuisine raffinée et prestations sur mesure dans les Yvelines.",

  keywords: [
    "traiteur Bailly",
    "traiteur Yvelines",
    "traiteur mariage Bailly",
    "traiteur événementiel Yvelines",
    "traiteur Versailles",
    "Ngalam Traiteur",
  ],

  authors: [{ name: "Ngalam Traiteur" }],
  creator: "Ngalam Traiteur",
  publisher: "Ngalam Traiteur",

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "Ngalam Traiteur à Bailly | Traiteur Événementiel",
    description:
      "Traiteur événementiel à Bailly dans les Yvelines. Mariages, événements privés et professionnels avec des menus sur mesure.",
    url: "https://ngalam-traiteur.fr",
    siteName: "Ngalam Traiteur",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ngalam Traiteur Bailly",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ngalam Traiteur à Bailly",
    description:
      "Service de traiteur gastronomique pour vos événements à Bailly et dans les Yvelines.",
    images: ["/images/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://ngalam-traiteur.fr",
  },

  other: {
    "geo.placename": "Bailly",
    "geo.position": "48.8362401;2.072829",
    "geo.region": "FR",
    ICBM: "48.8362401, 2.072829",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}

        <Script
          id="restaurant-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "Ngalam Traiteur",
              image: "https://ngalam-traiteur.fr/images/og-image.jpg",
              telephone: "+33666030342",
              email: "ndiayeaboubakry@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "4 Chemin des Princes",
                addressLocality: "Bailly",
                postalCode: "78870",
                addressCountry: "FR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 48.8362401,
                longitude: 2.072829,
              },
              servesCuisine: "French",
              priceRange: "€€",
            }),
          }}
        />
      </body>
    </html>
  );
}