import type { Metadata } from "next";
import ListaJuegos from "@/components/juegos/ListaJuegos";

export const metadata: Metadata = { title: "Juegos de conocimiento útil | CEPO" };

export default function Pagina() {
  return <ListaJuegos />;
}
