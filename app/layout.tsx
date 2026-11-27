import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  // Solo 700 y 800: todo uso de font-display en el sitio es font-bold o
  // font-extrabold (verificado 19-nov-2026); 500/600 nunca se renderizan.
  weight: ["700", "800"],
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
  metadataBase: new URL("https://cepo-orion.vercel.app"),
  title: "CEPO — Centro Educativo Privado Orion | Ixiamas, Bolivia",
  description:
    "Centro Educativo Privado Orion (CEPO) en Ixiamas, Iturralde, La Paz, Bolivia. Educación secundaria con orgullo amazónico: diagnóstico académico, juegos de conocimiento y progreso personal.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
  keywords: [
    "CEPO",
    "Centro Educativo Privado Orion",
    "educación secundaria",
    "Ixiamas",
    "Bolivia",
    "diagnóstico académico",
    "apoyo escolar",
  ],
  authors: [{ name: "CEPO — Centro Educativo Privado Orion" }],
  openGraph: {
    title: "CEPO — Centro Educativo Privado Orion",
    description:
      "Aprendamos en la selva. Educación secundaria en Ixiamas, puerta del norte amazónico paceño.",
    url: "/",
    siteName: "CEPO — Centro Educativo Privado Orion",
    images: ["/icons/icon-192.svg"],
    type: "website",
    locale: "es_BO",
  },
  twitter: {
    card: "summary",
    title: "CEPO — Centro Educativo Privado Orion",
    description:
      "Aprendamos en la selva. Educación secundaria en Ixiamas, Bolivia.",
    images: ["/icons/icon-192.svg"],
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
      {/*
        Aplica el tema (claro/oscuro) y el tamaño de letra guardados ANTES
        del primer pintado, para que no haya flash al cargar. Lee las
        mismas claves que Nav.tsx ("cepo-tema", "cepo-letra").
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("cepo-tema");if(t==="oscuro")document.documentElement.classList.add("dark");var l=localStorage.getItem("cepo-letra");if(l)document.documentElement.classList.add(l);}catch(e){}})();`,
        }}
      />
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
