import type { Metadata } from "next";
import CuestionarioVocacional, {
  type DatosVocacional,
} from "./CuestionarioVocacional";
import { supabaseConfigurado } from "@/lib/supabase/config";
import datosJson from "@/data/vocacional.json";

export const metadata: Metadata = {
  title: "¿Qué te gusta hacer? — Cuestionario vocacional | CEPO",
  description:
    "Cuestionario vocacional de CEPO (modelo RIASEC): 18 frases sobre lo que te gusta hacer. Orientativo: no es un test psicológico ni una prueba oficial.",
};

export const dynamic = "force-dynamic";

/**
 * Página del cuestionario vocacional. El contenido se lee del archivo
 * editable data/vocacional.json (ver data/README.md).
 */
export default function PaginaVocacional() {
  const datos = datosJson as unknown as DatosVocacional;
  return (
    <CuestionarioVocacional
      datos={datos}
      supabaseConfigurado={supabaseConfigurado}
    />
  );
}
