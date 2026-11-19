import type { Metadata } from "next";
import EnConstruccion from "@/components/EnConstruccion";

export const metadata: Metadata = { title: "Juegos de conocimiento útil | CEPO" };

export default function Pagina() {
  return (
    <EnConstruccion
      titulo="Juegos de conocimiento útil"
      fase="e"
      descripcion="Aventura Madidi, Mi primer presupuesto, Detective de noticias, Primeros auxilios, Mapa de Bolivia y Constelaciones. Sistema de puntos, insignias y niveles, sin ranking público que exponga a menores."
    />
  );
}
