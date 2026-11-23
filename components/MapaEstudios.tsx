"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import datos from "@/data/mapa-estudios.json";

/**
 * Mapa «¿Dónde quieres estudiar?» (fase j).
 * Leaflet + tiles de OpenStreetMap, sin API key. El mapa solo se carga en
 * el navegador: Leaflet se importa de forma dinámica dentro de useEffect,
 * así nunca se ejecuta en el servidor. Los puntos son divIcon de color
 * CEPO (el icono por defecto de Leaflet se rompe con el bundler).
 * Datos: data/mapa-estudios.json — solo carreras e instituciones del
 * informe oficial y de data/despues-del-cole.json. Cero sueldos.
 */

type TipoMarcador = "origen" | "cerca" | "virtual" | "ciudad";

type Institucion = {
  nombre: string;
  carreras: string[];
  enlace: string | null;
  nota?: string;
};

type Marcador = {
  id: string;
  ciudad: string;
  departamento: string;
  lat: number;
  lng: number;
  tipo: TipoMarcador;
  estado: "vigente" | "por confirmar";
  fuente: string;
  nota?: string;
  instituciones: Institucion[];
};

const COLORES: Record<TipoMarcador, string> = {
  origen: "#C62828",
  cerca: "#1B5E20",
  virtual: "#00897B",
  ciudad: "#E65100",
};

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function MapaEstudios() {
  const refContenedor = useRef<HTMLDivElement>(null);
  const refMapa = useRef<import("leaflet").Map | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelado || !refContenedor.current || refMapa.current) return;
      const mapa = L.map(refContenedor.current, {
        scrollWheelZoom: false,
      }).setView([-16.5, -64.5], 5);
      refMapa.current = mapa;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapa);
      const puntos: [number, number][] = [];
      (datos.marcadores as Marcador[]).forEach((m) => {
        puntos.push([m.lat, m.lng]);
        const icono = L.divIcon({
          className: "cepo-marcador",
          html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${COLORES[m.tipo]};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.45);"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
          popupAnchor: [0, -10],
        });
        const institucionesHtml = m.instituciones
          .map((inst) => {
            const carreras = inst.carreras
              .map((c) => `<li>${escapar(c)}</li>`)
              .join("");
            const enlace = inst.enlace
              ? `<p><a href="${escapar(inst.enlace)}" target="_blank" rel="noopener noreferrer">${escapar(inst.enlace)}</a></p>`
              : "";
            const nota = inst.nota ? `<p>${escapar(inst.nota)}</p>` : "";
            return `<p><strong>${escapar(inst.nombre)}</strong></p><ul>${carreras}</ul>${nota}${enlace}`;
          })
          .join("");
        const estado =
          m.estado === "por confirmar" ? " <em>(por confirmar)</em>" : "";
        const nota = m.nota ? `<p>${escapar(m.nota)}</p>` : "";
        L.marker([m.lat, m.lng], { icon: icono })
          .addTo(mapa)
          .bindPopup(
            `<div style="font-size:14px;line-height:1.45"><p><strong>${escapar(m.ciudad)} (${escapar(m.departamento)})</strong>${estado}</p>${institucionesHtml}${nota}<p style="font-size:12px;color:#666">Fuente: ${escapar(m.fuente)}</p></div>`,
            { maxWidth: 280 },
          );
      });
      mapa.fitBounds(L.latLngBounds(puntos).pad(0.12));
      setListo(true);
    })();
    return () => {
      cancelado = true;
      refMapa.current?.remove();
      refMapa.current = null;
    };
  }, []);

  return (
    <div>
      <div
        ref={refContenedor}
        className="h-[420px] w-full overflow-hidden rounded-3xl border-2 border-rio/20 md:h-[480px]"
        aria-label="Mapa de lugares donde estudiar después del bachillerato"
      >
        {!listo && (
          <p className="flex h-full items-center justify-center px-4 text-center text-sm font-bold text-neutral-500">
            Cargando mapa…
          </p>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
        <p>
          <span
            className="mr-1 inline-block h-3 w-3 rounded-full align-middle"
            style={{ background: "#C62828" }}
          />{" "}
          Estás aquí (Ixiamas) ·{" "}
          <span
            className="mr-1 inline-block h-3 w-3 rounded-full align-middle"
            style={{ background: "#1B5E20" }}
          />{" "}
          Cerca de Ixiamas ·{" "}
          <span
            className="mr-1 inline-block h-3 w-3 rounded-full align-middle"
            style={{ background: "#00897B" }}
          />{" "}
          Se puede estudiar sin mudarse (virtual) ·{" "}
          <span
            className="mr-1 inline-block h-3 w-3 rounded-full align-middle"
            style={{ background: "#E65100" }}
          />{" "}
          Ciudades con universidad pública
        </p>
        <p>
          Los programas abren o pausan según el año: verificá en el enlace
          oficial antes de viajar.
        </p>
        <p>
          Sin mudarse: UAP virtual y Becas Tecnológicas MinEdu (100%
          virtuales).
        </p>
      </div>
    </div>
  );
}
