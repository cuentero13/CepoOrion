import type { Metadata } from "next";
import EnConstruccion from "@/components/EnConstruccion";

export const metadata: Metadata = { title: "Examen diagnóstico académico | CEPO" };

export default function Pagina() {
  return (
    <EnConstruccion
      titulo="Examen diagnóstico académico"
      fase="d"
      descripcion="Diagnóstico por área (Matemática, Lenguaje, Ciencias Naturales, Ciencias Sociales, Inglés) con preguntas adaptativas, nivel final (Inicial, Básico, Intermedio, Avanzado), gráfico radar por área y recomendaciones de estudio. Banco mínimo de 10 preguntas por área, cada una con su fuente."
    />
  );
}
