/**
 * semaforo.js — Lógica de evaluación de KPI y de avance de los pasos de Kotter.
 * No depende del navegador, por eso también puede probarse con Node (ver tests/).
 */

const TOLERANCIA = 0.10; // 10 % de tolerancia para el estado "ámbar"

/**
 * Evalúa un KPI y devuelve "verde", "ambar", "rojo" o "sin-dato".
 * @param {{op: string, meta: number|number[]}} kpi
 * @param {number|null|undefined} valor
 */
function evaluarKPI(kpi, valor) {
  if (valor === null || valor === undefined || valor === "" || Number.isNaN(Number(valor))) {
    return "sin-dato";
  }
  const v = Number(valor);

  if (kpi.op === ">=") {
    const meta = kpi.meta;
    if (v >= meta) return "verde";
    const margen = Math.max(Math.abs(meta) * TOLERANCIA, 1e-9);
    return v >= meta - margen ? "ambar" : "rojo";
  }

  if (kpi.op === "<=") {
    const meta = kpi.meta;
    if (v <= meta) return "verde";
    // Para metas en cero (p. ej. "0 vulnerabilidades") se tolera 1 unidad como ámbar.
    const margen = meta === 0 ? 1 : Math.abs(meta) * TOLERANCIA;
    return v <= meta + margen ? "ambar" : "rojo";
  }

  if (kpi.op === "rango") {
    const [min, max] = kpi.meta;
    if (v >= min && v <= max) return "verde";
    const ancho = (max - min) || 1;
    const margen = ancho * 0.5;
    return v >= min - margen && v <= max + margen ? "ambar" : "rojo";
  }

  throw new Error(`Operador desconocido: ${kpi.op}`);
}

/** Texto legible de la meta, p. ej. "≥ 85 %" o "0,9 – 1,1". */
function textoMeta(kpi) {
  const fmt = (n) => String(n).replace(".", ",");
  const u = kpi.unidad ? ` ${kpi.unidad}` : "";
  if (kpi.op === ">=") return `≥ ${fmt(kpi.meta)}${u}`;
  if (kpi.op === "<=") return `≤ ${fmt(kpi.meta)}${u}`;
  return `${fmt(kpi.meta[0])} – ${fmt(kpi.meta[1])}${u}`;
}

/** Porcentaje de avance de un paso de Kotter según sus actividades completadas. */
function avancePaso(done) {
  if (!done || done.length === 0) return 0;
  const hechas = done.filter(Boolean).length;
  return Math.round((hechas / done.length) * 100);
}

/** Estado textual de un paso a partir de su avance. */
function estadoPaso(avance) {
  if (avance >= 100) return "Completado";
  if (avance > 0) return "En curso";
  return "Pendiente";
}

/** Resumen de semáforos para una lista de KPI y sus valores. */
function resumenKPI(kpis, valores) {
  const r = { verde: 0, ambar: 0, rojo: 0, "sin-dato": 0 };
  for (const kpi of kpis) r[evaluarKPI(kpi, valores[kpi.id])]++;
  return r;
}

if (typeof module !== "undefined") {
  module.exports = { evaluarKPI, textoMeta, avancePaso, estadoPaso, resumenKPI, TOLERANCIA };
}
