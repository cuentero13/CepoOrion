import type { Metadata } from "next";
import FormularioBuzon from "./FormularioBuzon";

export const metadata: Metadata = { title: "Buzón privado | CEPO" };

export default function Pagina() {
  return <FormularioBuzon />;
}
