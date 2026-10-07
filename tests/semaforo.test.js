/**
 * Pruebas de la lógica del semáforo y del avance de Kotter.
 * Ejecutar con:  node tests/semaforo.test.js
 */
const assert = require("node:assert/strict");
const { evaluarKPI, textoMeta, avancePaso, estadoPaso, resumenKPI } = require("../js/semaforo.js");

let ok = 0;
function prueba(nombre, fn) {
  try {
    fn();
    ok++;
    console.log(`  ✔ ${nombre}`);
  } catch (e) {
    console.error(`  ✘ ${nombre}\n    ${e.message}`);
    process.exitCode = 1;
  }
}

console.log("Semáforo de KPI");
const mayor = { op: ">=", meta: 85 };
const menor = { op: "<=", meta: 10 };
const cero = { op: "<=", meta: 0 };
const rango = { op: "rango", meta: [0.9, 1.1] };

prueba("≥: valor igual a la meta es verde", () => assert.equal(evaluarKPI(mayor, 85), "verde"));
prueba("≥: dentro del 10 % es ámbar", () => assert.equal(evaluarKPI(mayor, 77), "ambar"));
prueba("≥: lejos de la meta es rojo", () => assert.equal(evaluarKPI(mayor, 60), "rojo"));
prueba("≤: por debajo de la meta es verde", () => assert.equal(evaluarKPI(menor, 8), "verde"));
prueba("≤: dentro del 10 % es ámbar", () => assert.equal(evaluarKPI(menor, 11), "ambar"));
prueba("≤: muy por encima es rojo", () => assert.equal(evaluarKPI(menor, 15), "rojo"));
prueba("meta 0: cero es verde", () => assert.equal(evaluarKPI(cero, 0), "verde"));
prueba("meta 0: uno es ámbar", () => assert.equal(evaluarKPI(cero, 1), "ambar"));
prueba("meta 0: dos o más es rojo", () => assert.equal(evaluarKPI(cero, 2), "rojo"));
prueba("rango: dentro es verde", () => assert.equal(evaluarKPI(rango, 1.0), "verde"));
prueba("rango: cerca es ámbar", () => assert.equal(evaluarKPI(rango, 0.85), "ambar"));
prueba("rango: lejos es rojo", () => assert.equal(evaluarKPI(rango, 0.5), "rojo"));
prueba("sin valor devuelve sin-dato", () => {
  assert.equal(evaluarKPI(mayor, undefined), "sin-dato");
  assert.equal(evaluarKPI(mayor, ""), "sin-dato");
});
prueba("operador desconocido lanza error", () => assert.throws(() => evaluarKPI({ op: "x", meta: 1 }, 1)));

console.log("Textos de meta");
prueba("formatea ≥ con unidad", () => assert.equal(textoMeta({ op: ">=", meta: 85, unidad: "%" }), "≥ 85 %"));
prueba("formatea rango con coma decimal", () =>
  assert.equal(textoMeta({ op: "rango", meta: [0.9, 1.1], unidad: "ratio" }), "0,9 – 1,1 ratio"));

console.log("Avance de Kotter");
prueba("0 de 4 actividades = 0 %", () => assert.equal(avancePaso([false, false, false, false]), 0));
prueba("3 de 4 actividades = 75 %", () => assert.equal(avancePaso([true, true, true, false]), 75));
prueba("estado según avance", () => {
  assert.equal(estadoPaso(0), "Pendiente");
  assert.equal(estadoPaso(40), "En curso");
  assert.equal(estadoPaso(100), "Completado");
});

console.log("Resumen");
prueba("cuenta estados correctamente", () => {
  const kpis = [{ id: "a", op: ">=", meta: 10 }, { id: "b", op: "<=", meta: 5 }, { id: "c", op: ">=", meta: 1 }];
  assert.deepEqual(resumenKPI(kpis, { a: 12, b: 9 }), { verde: 1, ambar: 0, rojo: 1, "sin-dato": 1 });
});

console.log(`\n${ok} pruebas aprobadas.`);
