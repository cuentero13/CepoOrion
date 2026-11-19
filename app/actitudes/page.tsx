import type { Metadata } from "next";
import CuestionarioActitudes, {
  type DatosActitudes,
} from "./CuestionarioActitudes";
import { supabaseConfigurado } from "@/lib/supabase/config";
import datosJson from "@/data/actitudes.json";

export const metadata: Metadata = {
  title: "Actitudes y hábitos de estudio | CEPO",
};

export const dynamic = "force-dynamic";

/**
 * Página del cuestionario de actitudes y hábitos. El contenido se lee
 * del archivo editable data/actitudes.json (ver data/README.md).
 */
export default function PaginaActitudes() {
  const datos = datosJson as unknown as DatosActitudes;
  return (
    <CuestionarioActitudes
      datos={datos}
      supabaseConfigurado={supabaseConfigurado}
    />
  );
}
