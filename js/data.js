/**
 * data.js — Datos base del tablero.
 * Contiene los 8 pasos de Kotter (con sus actividades) y el catálogo de KPI
 * definidos en el informe "Actividad ERP e IA".
 *
 * Tipos de meta (campo "op"):
 *   ">="   el valor debe ser mayor o igual que la meta
 *   "<="   el valor debe ser menor o igual que la meta
 *   "rango" el valor debe estar entre min y max
 */

const KOTTER_STEPS = [
  {
    id: 1, bloque: "Crear el clima para el cambio",
    titulo: "Crear sentido de urgencia", periodo: "Semanas 1–3",
    objetivo: "Que al menos el 80 % de los jefes de área reconozca que mantener el sistema actual es más costoso que cambiar.",
    actividades: [
      "Levantar evidencia de costos ocultos (cierre contable, diferencias de inventario, pedidos perdidos)",
      "Presentar el business case al directorio",
      "Realizar talleres de «dolor del proceso» con cada área",
      "Comparar con competidores que ya usan información integrada",
    ],
    indicador: "% de jefes que firman el acta de inicio",
  },
  {
    id: 2, bloque: "Crear el clima para el cambio",
    titulo: "Formar la coalición guía", periodo: "Semanas 2–4",
    objetivo: "Constituir un Comité ERP con autoridad real para decidir y remover obstáculos.",
    actividades: [
      "Nombrar patrocinador ejecutivo y jefe de proyecto",
      "Seleccionar usuarios clave por módulo",
      "Incorporar a TI y al proveedor/consultor del ERP",
      "Definir matriz RACI y calendario de comités",
    ],
    indicador: "Asistencia al comité ≥ 90 %",
  },
  {
    id: 3, bloque: "Crear el clima para el cambio",
    titulo: "Crear la visión y la estrategia", periodo: "Semanas 3–5",
    objetivo: "Contar con una visión breve y medible y una estrategia por oleadas.",
    actividades: [
      "Redactar y aprobar la visión del proyecto",
      "Definir el alcance por oleadas de módulos",
      "Acordar la política de mínima personalización",
      "Fijar KRA, KPA, objetivos y KPI del proyecto",
    ],
    indicador: "Visión explicable en menos de 1 minuto por el comité",
  },
  {
    id: 4, bloque: "Involucrar y habilitar a la organización",
    titulo: "Comunicar la visión", periodo: "Continuo desde semana 5",
    objetivo: "Que todo el personal sepa qué cambia, por qué y qué se espera de él.",
    actividades: [
      "Lanzamiento oficial liderado por la gerencia general",
      "Publicar boletín quincenal y sección de preguntas frecuentes",
      "Realizar demos abiertas al final de cada sprint",
      "Adaptar mensajes por perfil (operativo, jefaturas, dirección)",
      "Los líderes usan el sistema primero",
    ],
    indicador: "% del personal que conoce la visión ≥ 85 %",
  },
  {
    id: 5, bloque: "Involucrar y habilitar a la organización",
    titulo: "Eliminar obstáculos", periodo: "Semanas 6–30",
    objetivo: "Remover barreras técnicas, organizacionales y personales.",
    actividades: [
      "Liberar carga operativa de los usuarios clave",
      "Ejecutar el plan de capacitación desde el inicio",
      "Depurar y migrar datos maestros",
      "Gestionar resistencias y escalar bloqueos al comité",
      "Revisar procedimientos e incentivos que premian trabajar fuera del sistema",
    ],
    indicador: "Impedimentos cerrados / abiertos",
  },
  {
    id: 6, bloque: "Involucrar y habilitar a la organización",
    titulo: "Generar victorias a corto plazo", periodo: "Meses 3–5",
    objetivo: "Demostrar resultados visibles antes de pedir más esfuerzo.",
    actividades: [
      "Piloto de Inventario en la sede principal",
      "Emitir comprobantes electrónicos desde el ERP",
      "Publicar el primer reporte gerencial automático",
      "Reconocer públicamente a los equipos del piloto",
    ],
    indicador: "Reducción de diferencias de inventario",
  },
  {
    id: 7, bloque: "Implementar y sostener el cambio",
    titulo: "Consolidar y producir más cambio", periodo: "Meses 5–12",
    objetivo: "No declarar victoria prematura y extender el cambio.",
    actividades: [
      "Desplegar las oleadas 2 y 3 en todas las sedes",
      "Retirar sistemas y hojas de cálculo paralelas",
      "Revisión post-implantación por módulo",
      "Formar usuarios clave como multiplicadores internos",
    ],
    indicador: "% de procesos operando 100 % en el ERP",
  },
  {
    id: 8, bloque: "Implementar y sostener el cambio",
    titulo: "Anclar el cambio en la cultura", periodo: "Mes 12 en adelante",
    objetivo: "Que trabajar con el ERP sea la forma normal de hacer las cosas.",
    actividades: [
      "Aprobar la política «si no está en el ERP, no existe»",
      "Incluir el ERP en la inducción de nuevos colaboradores",
      "Incorporar indicadores de uso en la evaluación de desempeño",
      "Instalar el comité trimestral de mejora continua",
    ],
    indicador: "Índice de adopción sostenido ≥ 95 %",
  },
];

const KPI_CATEGORIES = [
  { id: "prod", nombre: "Productividad del equipo" },
  { id: "cal", nombre: "Calidad del software" },
  { id: "usr", nombre: "Centrados en el usuario" },
  { id: "val", nombre: "Valor del producto" },
  { id: "segu", nombre: "Seguridad en el uso" },
  { id: "segbd", nombre: "Seguridad de la base de datos" },
];

// k(id, categoría, nombre, fórmula, op, meta, unidad, frecuencia)
function k(id, cat, nombre, formula, op, meta, unidad, frecuencia) {
  return { id, cat, nombre, formula, op, meta, unidad, frecuencia };
}

const KPIS = [
  // Productividad del equipo
  k("PROD-01", "prod", "Cumplimiento del compromiso", "SP terminados / SP comprometidos × 100", ">=", 85, "%", "Sprint"),
  k("PROD-02", "prod", "Variación de la velocidad", "|velocidad actual − promedio| / promedio × 100", "<=", 10, "%", "Sprint"),
  k("PROD-03", "prod", "Lead time", "Días desde la creación de la historia hasta producción", "<=", 15, "días", "Mensual"),
  k("PROD-04", "prod", "Cycle time", "Días desde «en progreso» hasta «terminado»", "<=", 5, "días", "Semanal"),
  k("PROD-05", "prod", "Throughput", "Ítems completados por semana", ">=", 8, "ítems", "Semanal"),
  k("PROD-06", "prod", "Frecuencia de despliegue", "Despliegues a producción por semana", ">=", 1, "/sem", "Mensual"),
  k("PROD-07", "prod", "Lead time de cambios (DORA)", "Horas desde commit hasta producción", "<=", 24, "h", "Mensual"),
  k("PROD-08", "prod", "Trabajo no planificado", "Horas no planificadas / horas totales × 100", "<=", 15, "%", "Sprint"),
  k("PROD-09", "prod", "Tiempo de revisión de PR", "Horas desde apertura hasta aprobación", "<=", 24, "h", "Semanal"),
  k("PROD-10", "prod", "Precisión de estimación", "Horas estimadas / horas reales", "rango", [0.9, 1.1], "ratio", "Sprint"),
  k("PROD-11", "prod", "Tasa de bloqueos", "Días-tarea bloqueados / días-tarea totales × 100", "<=", 5, "%", "Sprint"),
  k("PROD-12", "prod", "Satisfacción del equipo", "Encuesta de pulso (1–5)", ">=", 4, "/5", "Mensual"),

  // Calidad del software
  k("CAL-01", "cal", "Densidad de defectos", "Defectos / KLOC", "<=", 1, "/KLOC", "Release"),
  k("CAL-02", "cal", "Defect escape rate", "Defectos en producción / defectos totales × 100", "<=", 10, "%", "Release"),
  k("CAL-03", "cal", "Cobertura de pruebas", "Líneas cubiertas / totales × 100", ">=", 80, "%", "Por build"),
  k("CAL-04", "cal", "Tasa de éxito de pruebas", "Pruebas aprobadas / ejecutadas × 100", ">=", 98, "%", "Por build"),
  k("CAL-05", "cal", "Change failure rate (DORA)", "Despliegues con fallo / despliegues × 100", "<=", 15, "%", "Mensual"),
  k("CAL-06", "cal", "MTTR", "Horas para restaurar el servicio tras un fallo", "<=", 1, "h", "Mensual"),
  k("CAL-07", "cal", "Deuda técnica", "Technical Debt Ratio (SonarQube)", "<=", 5, "%", "Sprint"),
  k("CAL-08", "cal", "Complejidad ciclomática", "Complejidad promedio por método", "<=", 10, "", "Sprint"),
  k("CAL-09", "cal", "Código duplicado", "Líneas duplicadas / totales × 100", "<=", 3, "%", "Sprint"),
  k("CAL-10", "cal", "Reapertura de defectos", "Defectos reabiertos / cerrados × 100", "<=", 5, "%", "Mensual"),
  k("CAL-11", "cal", "Corrección de defectos críticos", "Horas para cerrar un defecto crítico", "<=", 24, "h", "Mensual"),
  k("CAL-12", "cal", "Aprobación UAT", "Casos aprobados al 1.er ciclo / totales × 100", ">=", 90, "%", "Por módulo"),

  // Usuario
  k("USR-01", "usr", "Satisfacción (CSAT)", "% de respuestas 4–5", ">=", 80, "%", "Trimestral"),
  k("USR-02", "usr", "Net Promoter Score", "% promotores − % detractores", ">=", 30, "pts", "Semestral"),
  k("USR-03", "usr", "Usabilidad (SUS)", "System Usability Scale", ">=", 75, "pts", "Por módulo"),
  k("USR-04", "usr", "Tasa de adopción", "Usuarios activos / habilitados × 100", ">=", 90, "%", "Mensual"),
  k("USR-05", "usr", "Usuarios activos diarios", "DAU / usuarios habilitados × 100", ">=", 80, "%", "Diario"),
  k("USR-06", "usr", "Finalización de tareas", "Tareas completadas sin ayuda / intentos × 100", ">=", 95, "%", "Prueba de usabilidad"),
  k("USR-07", "usr", "Reducción del tiempo por transacción", "% de reducción vs. sistema anterior", ">=", 30, "%", "Trimestral"),
  k("USR-08", "usr", "Errores de usuario", "Errores de validación por cada 100 transacciones", "<=", 3, "", "Mensual"),
  k("USR-09", "usr", "Tickets por usuario", "Tickets / usuarios activos (mes)", "<=", 0.5, "", "Mensual"),
  k("USR-10", "usr", "Tiempo de primera respuesta", "Horas hasta la primera respuesta de soporte", "<=", 1, "h", "Semanal"),
  k("USR-11", "usr", "Curva de aprendizaje", "Días hasta operar sin ayuda", "<=", 5, "días", "Por cohorte"),
  k("USR-12", "usr", "Uso de funcionalidades", "Funciones usadas / disponibles × 100", ">=", 70, "%", "Trimestral"),

  // Valor del producto
  k("VAL-01", "val", "Retorno de la inversión (ROI)", "(Beneficio − inversión) / inversión × 100", ">=", 0, "%", "Anual"),
  k("VAL-02", "val", "Periodo de recuperación", "Meses hasta recuperar la inversión", "<=", 24, "meses", "Anual"),
  k("VAL-03", "val", "Desviación del TCO", "(TCO real − presupuestado) / presupuestado × 100", "<=", 0, "%", "Anual"),
  k("VAL-04", "val", "Reducción de costos operativos", "Ahorro anual / costo base × 100", ">=", 10, "%", "Anual"),
  k("VAL-05", "val", "Días de cierre contable", "Días hábiles del cierre mensual", "<=", 4, "días", "Mensual"),
  k("VAL-06", "val", "Exactitud de inventario", "Ítems coincidentes / total × 100", ">=", 98, "%", "Mensual"),
  k("VAL-07", "val", "Mejora de rotación de inventario", "% de mejora vs. línea base", ">=", 15, "%", "Trimestral"),
  k("VAL-08", "val", "Reducción del ciclo pedido-cobro", "% de reducción vs. línea base", ">=", 20, "%", "Mensual"),
  k("VAL-09", "val", "Entregas a tiempo (OTIF)", "Pedidos completos y a tiempo / totales × 100", ">=", 95, "%", "Mensual"),
  k("VAL-10", "val", "Valor entregado por sprint", "Puntos de valor de negocio", ">=", 20, "pts", "Sprint"),
  k("VAL-11", "val", "Tiempo para reportes gerenciales", "Minutos para obtener el reporte", "<=", 5, "min", "Trimestral"),
  k("VAL-12", "val", "Procesos digitalizados", "Procesos en el ERP / del alcance × 100", ">=", 100, "%", "Trimestral"),

  // Seguridad en el uso
  k("SEGU-01", "segu", "Vulnerabilidades críticas abiertas", "Nº de vulnerabilidades críticas/altas", "<=", 0, "", "Release"),
  k("SEGU-02", "segu", "Remediación de vulnerabilidades críticas", "Días promedio para corregir", "<=", 7, "días", "Mensual"),
  k("SEGU-03", "segu", "Cobertura SAST/DAST", "Releases analizados / totales × 100", ">=", 100, "%", "Release"),
  k("SEGU-04", "segu", "Adopción de MFA", "Usuarios críticos con doble factor × 100", ">=", 100, "%", "Mensual"),
  k("SEGU-05", "segu", "Accesos fallidos", "Logins fallidos por día", "<=", 20, "", "Diario"),
  k("SEGU-06", "segu", "Revisión de accesos", "Usuarios con permisos revisados × 100", ">=", 100, "%", "Trimestral"),
  k("SEGU-07", "segu", "Conflictos de segregación", "Usuarios con roles incompatibles", "<=", 0, "", "Trimestral"),
  k("SEGU-08", "segu", "Cuentas huérfanas", "Cuentas activas de personal cesado", "<=", 0, "", "Mensual"),
  k("SEGU-09", "segu", "Incidentes graves", "Incidentes graves confirmados", "<=", 0, "", "Mensual"),
  k("SEGU-10", "segu", "Tiempo de detección (MTTD)", "Horas hasta detectar un incidente", "<=", 1, "h", "Por incidente"),
  k("SEGU-11", "segu", "Capacitación en seguridad", "Usuarios capacitados / total × 100", ">=", 100, "%", "Anual"),
  k("SEGU-12", "segu", "Dependencias vulnerables", "Librerías con CVE crítico", "<=", 0, "", "Por build"),

  // Seguridad de la base de datos
  k("SEGBD-01", "segbd", "Éxito de respaldos", "Respaldos exitosos / programados × 100", ">=", 100, "%", "Diario"),
  k("SEGBD-02", "segbd", "Pruebas de restauración", "Restauraciones exitosas / planificadas × 100", ">=", 100, "%", "Trimestral"),
  k("SEGBD-03", "segbd", "RPO", "Horas máximas de pérdida de datos", "<=", 1, "h", "Trimestral"),
  k("SEGBD-04", "segbd", "RTO", "Horas máximas para restaurar la BD", "<=", 4, "h", "Trimestral"),
  k("SEGBD-05", "segbd", "Datos sensibles cifrados", "Columnas cifradas / identificadas × 100", ">=", 100, "%", "Trimestral"),
  k("SEGBD-06", "segbd", "Cuentas privilegiadas", "Cuentas con privilegios de DBA", "<=", 2, "", "Mensual"),
  k("SEGBD-07", "segbd", "Cobertura de auditoría", "Tablas críticas auditadas × 100", ">=", 100, "%", "Mensual"),
  k("SEGBD-08", "segbd", "Consultas sin parametrizar", "Consultas dinámicas detectadas", "<=", 0, "", "Release"),
  k("SEGBD-09", "segbd", "Parches de BD aplicados", "Parches aplicados en 30 días × 100", ">=", 100, "%", "Mensual"),
  k("SEGBD-10", "segbd", "Accesos no autorizados", "Intentos fuera de la aplicación", "<=", 0, "", "Diario"),
  k("SEGBD-11", "segbd", "Integridad referencial", "Registros huérfanos detectados", "<=", 0, "", "Semanal"),
  k("SEGBD-12", "segbd", "Enmascaramiento en no-producción", "Entornos con datos enmascarados × 100", ">=", 100, "%", "Release"),
];

/** Datos de ejemplo para demostrar el tablero (mes 4 del proyecto). */
const DEMO_STATE = {
  pasos: {
    1: { done: [true, true, true, true], notas: "Acta firmada por 9 de 10 jefes de área." },
    2: { done: [true, true, true, true], notas: "Comité ERP sesiona los lunes." },
    3: { done: [true, true, true, false], notas: "Falta aprobar formalmente los KPI." },
    4: { done: [true, true, true, false, false], notas: "" },
    5: { done: [true, true, false, false, false], notas: "Migración de maestros en curso." },
    6: { done: [true, false, false, false], notas: "Piloto de inventario en sede principal." },
    7: { done: [false, false, false, false], notas: "" },
    8: { done: [false, false, false, false], notas: "" },
  },
  kpis: {
    "PROD-01": 88, "PROD-02": 12, "PROD-03": 13, "PROD-04": 6, "PROD-05": 9, "PROD-06": 1,
    "PROD-07": 30, "PROD-08": 14, "PROD-09": 20, "PROD-10": 0.85, "PROD-11": 4, "PROD-12": 4.2,
    "CAL-01": 0.8, "CAL-02": 14, "CAL-03": 76, "CAL-04": 99, "CAL-05": 10, "CAL-06": 0.7,
    "CAL-07": 4.1, "CAL-08": 8, "CAL-09": 2.5, "CAL-10": 6, "CAL-11": 18, "CAL-12": 92,
    "USR-01": 74, "USR-02": 22, "USR-03": 71, "USR-04": 83, "USR-05": 78, "USR-06": 96,
    "USR-07": 25, "USR-08": 2.6, "USR-09": 0.6, "USR-10": 0.8, "USR-11": 6,
    "VAL-05": 6, "VAL-06": 97, "VAL-09": 93, "VAL-10": 22, "VAL-11": 3, "VAL-12": 40,
    "SEGU-01": 0, "SEGU-02": 5, "SEGU-03": 100, "SEGU-04": 85, "SEGU-05": 12, "SEGU-06": 100,
    "SEGU-07": 1, "SEGU-08": 0, "SEGU-09": 0, "SEGU-10": 2, "SEGU-11": 60, "SEGU-12": 0,
    "SEGBD-01": 100, "SEGBD-02": 100, "SEGBD-03": 1, "SEGBD-04": 3, "SEGBD-05": 90, "SEGBD-06": 2,
    "SEGBD-07": 100, "SEGBD-08": 0, "SEGBD-09": 95, "SEGBD-10": 0, "SEGBD-11": 3, "SEGBD-12": 100,
  },
};
