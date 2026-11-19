import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JuegoPreguntas from "@/components/juegos/JuegoPreguntas";
import JuegoDetective from "@/components/juegos/JuegoDetective";
import JuegoPresupuesto from "@/components/juegos/JuegoPresupuesto";
import {
  DATOS_CONSTELACIONES,
  DATOS_DETECTIVE,
  DATOS_MADIDI,
  DATOS_MAPA,
  DATOS_PRESUPUESTO,
  DATOS_PRIMEROS_AUXILIOS,
} from "@/lib/juegos-datos";
import { JUEGOS_IDS, esJuegoId, juegoPorId, type JuegoId } from "@/lib/juegos";

export function generateStaticParams() {
  return JUEGOS_IDS.map((juego) => ({ juego }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ juego: string }>;
}): Promise<Metadata> {
  const { juego } = await params;
  if (!esJuegoId(juego)) return { title: "Juego no encontrado | CEPO" };
  const info = juegoPorId(juego);
  return {
    title: `${info.titulo} | Juegos CEPO`,
    description: info.descripcion,
  };
}

export default async function PaginaJuego({
  params,
}: {
  params: Promise<{ juego: string }>;
}) {
  const { juego } = await params;
  if (!esJuegoId(juego)) notFound();
  const id: JuegoId = juego;

  switch (id) {
    case "madidi":
      return <JuegoPreguntas juego={id} datos={DATOS_MADIDI} />;
    case "mapa":
      return <JuegoPreguntas juego={id} datos={DATOS_MAPA} />;
    case "constelaciones":
      return <JuegoPreguntas juego={id} datos={DATOS_CONSTELACIONES} />;
    case "primeros-auxilios":
      return <JuegoPreguntas juego={id} datos={DATOS_PRIMEROS_AUXILIOS} />;
    case "detective":
      return <JuegoDetective datos={DATOS_DETECTIVE} />;
    case "presupuesto":
      return <JuegoPresupuesto datos={DATOS_PRESUPUESTO} />;
  }
}
