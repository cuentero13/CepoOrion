/**
 * Marcador — muestra un dato pendiente de completar por la dirección.
 * Se usa en lugar de inventar información: el texto del marcador se lee
 * tal cual está en config/institucion.json.
 */
export default function Marcador({
  texto,
  titulo = "Dato pendiente de la dirección",
}: {
  texto: string;
  titulo?: string;
}) {
  return (
    <p className="rounded-2xl border-2 border-dashed border-sol bg-sol/10 p-4 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
      <strong className="block font-display text-base font-bold text-tierra dark:text-sol">
        {titulo}
      </strong>
      <span className="mt-1 block">{texto}</span>
    </p>
  );
}
