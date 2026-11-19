import type { Metadata } from "next";
import ExamenDiagnostico from "./ExamenDiagnostico";
import { supabaseConfigurado } from "@/lib/supabase/config";
import type { Pregunta } from "@/lib/diagnostico";
import bancoJson from "@/data/preguntas.json";

export const metadata: Metadata = {
  title: "Examen diagnóstico académico | CEPO",
  description:
    "Examen diagnóstico adaptativo de CEPO: Matemática, Lenguaje, Ciencias Naturales, Ciencias Sociales e Inglés. Descubre tu nivel en cada área y recibe recomendaciones de estudio.",
};

export const dynamic = "force-static";

/**
 * Página del examen diagnóstico. El banco de preguntas se lee del
 * archivo editable data/preguntas.json (ver data/README.md) y se pasa
 * al componente cliente, que hace el flujo adaptativo en el navegador.
 */
export default function PaginaDiagnostico() {
  const preguntas = (bancoJson as { preguntas: Pregunta[] }).preguntas ?? [];
  return (
    <ExamenDiagnostico
      banco={preguntas}
      supabaseConfigurado={supabaseConfigurado}
    />
  );
}
