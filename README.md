# Tablero de seguimiento Kotter + KPI — Proyecto ERP

Aplicación web para dar seguimiento al **plan de gestión del cambio de los 8 pasos de Kotter** y a los **72 KPI** definidos para el desarrollo e implementación de un ERP (actividad *FACTORES CRÍTICOS DE ÉXITO EN INTEGRACIÓN* del curso Sistemas de Información Integrados — UPAO).

**Alumno:** Liu Dai, Yan Hui · **Docente:** Mendoza Corpus, Carlos Alfredo · 2026

## Funcionalidades

- **8 pasos de Kotter** agrupados en sus tres bloques (crear el clima, involucrar a la organización, implementar y sostener). Cada paso tiene:
  - objetivo, periodo e indicador de control;
  - lista de actividades que se marcan al completarse;
  - barra de avance y estado (*Pendiente / En curso / Completado*);
  - notas para registrar evidencias.
- **Resumen general**: avance global del plan, paso actual y número de KPI en meta.
- **KPI del producto** (12 por categoría): productividad del equipo, calidad del software, usuario, valor del producto, seguridad en el uso y seguridad de la base de datos.
  - Se ingresa el valor medido y se calcula el **semáforo** automáticamente:
    - 🟢 **En meta**
    - 🟡 **Cerca**: a menos del 10 % de la meta (o a 1 unidad, si la meta es 0)
    - 🔴 **Fuera de meta**
  - Filtros por categoría y por estado.
- **Persistencia** en el navegador (`localStorage`).
- **Exportar / importar** el estado en JSON.
- **Datos de ejemplo** para demostrar el tablero (escenario: mes 4 del proyecto).

## Estructura

```
tablero-kotter-erp/
├── index.html            # Estructura de la página
├── css/styles.css        # Estilos (responsive)
├── js/data.js            # Pasos de Kotter, catálogo de KPI y datos de ejemplo
├── js/semaforo.js        # Lógica de evaluación (sin dependencias del navegador)
├── js/app.js             # Interfaz, eventos y almacenamiento
└── tests/semaforo.test.js# Pruebas unitarias con Node
```

## Cómo ejecutarlo

No requiere instalar dependencias.

1. Abrir la carpeta en **VS Code**.
2. Opción A: instalar la extensión recomendada **Live Server**, clic derecho sobre `index.html` → *Open with Live Server*.
   Opción B: abrir `index.html` directamente con doble clic en el navegador.

### Pruebas

Con [Node.js](https://nodejs.org) instalado:

```bash
node tests/semaforo.test.js
```


## Cómo se relaciona con el informe

| Sección del informe | Dónde está en el tablero |
|---|---|
| Caso 1 — Plan de los 8 pasos de Kotter | Pestaña *Los 8 pasos de Kotter* (`js/data.js → KOTTER_STEPS`) |
| Caso 3 — Catálogo de KPI | Pestaña *KPI del producto* (`js/data.js → KPIS`) |
| Anexo — Semáforo verde/ámbar/rojo | `js/semaforo.js → evaluarKPI()` |
