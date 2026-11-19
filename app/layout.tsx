import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CEPO — Centro Educativo Privado Orion | Ixiamas, Bolivia",
  description:
    "Centro Educativo Privado Orion (CEPO) en Ixiamas, Abel Iturralde, La Paz, Bolivia. Educación secundaria con orgullo amazónico: diagnóstico académico, juegos de conocimiento y progreso personal.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
  openGraph: {
    title: "CEPO — Centro Educativo Privado Orion",
    description:
      "Bajo Orión, aprendemos de la selva. Educación secundaria en Ixiamas, puerta del norte amazónico paceño.",
    type: "website",
    locale: "es_BO",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D1B3E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="flex min-h-screen flex-col font-body antialiased">
        <RegisterSW />
        <Nav />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
