/**
 * app.js — Interfaz del tablero: renderiza los pasos de Kotter y los KPI,
 * guarda el estado en localStorage y permite exportar/importar en JSON.
 */

const STORAGE_KEY = "tablero-kotter-erp-v1";

// ---------- Estado ----------
function estadoVacio() {
  const pasos = {};
  KOTTER_STEPS.forEach((p) => {
    pasos[p.id] = { done: p.actividades.map(() => false), notas: "" };
  });
  return { pasos, kpis: {} };
}

function cargarEstado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return estadoVacio();
    return normalizar(JSON.parse(raw));
  } catch {
    return estadoVacio();
  }
}

/** Asegura que el estado tenga la forma esperada (por si viene de un JSON importado). */
function normalizar(data) {
  const base = estadoVacio();
  if (data && typeof data === "object") {
    KOTTER_STEPS.forEach((p) => {
      const d = data.pasos && data.pasos[p.id];
      if (d) {
        base.pasos[p.id].done = p.actividades.map((_, i) => Boolean(d.done && d.done[i]));
        base.pasos[p.id].notas = typeof d.notas === "string" ? d.notas : "";
      }
    });
    if (data.kpis && typeof data.kpis === "object") {
      KPIS.forEach((kpi) => {
        const v = data.kpis[kpi.id];
        if (v !== undefined && v !== null && v !== "" && !Number.isNaN(Number(v))) {
          base.kpis[kpi.id] = Number(v);
        }
      });
    }
  }
  return base;
}

function guardar() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* el navegador puede bloquear el almacenamiento; el tablero sigue funcionando */
  }
}

let state = cargarEstado();
let filtroCategoria = "todas";
let filtroEstado = "todos";

const $ = (sel) => document.querySelector(sel);
const ESTADO_TXT = { verde: "En meta", ambar: "Cerca", rojo: "Fuera", "sin-dato": "Sin dato" };

// ---------- Kotter ----------
function renderKotter() {
  const cont = $("#kotter-list");
  cont.innerHTML = "";
  let bloqueActual = "";

  KOTTER_STEPS.forEach((paso) => {
    if (paso.bloque !== bloqueActual) {
      bloqueActual = paso.bloque;
      const h = document.createElement("h2");
      h.className = "block-title";
      h.textContent = bloqueActual;
      cont.appendChild(h);
    }

    const st = state.pasos[paso.id];
    const avance = avancePaso(st.done);
    const estado = estadoPaso(avance);

    const card = document.createElement("article");
    card.className = "card step";
    card.innerHTML = `
      <header class="step__head">
        <span class="step__num">${paso.id}</span>
        <div class="step__info">
          <h3>${paso.titulo}</h3>
          <p class="muted">${paso.periodo} · Indicador: ${paso.indicador}</p>
        </div>
        <span class="badge badge--${estado.replace(" ", "-").toLowerCase()}">${estado}</span>
      </header>
      <p class="step__obj">${paso.objetivo}</p>
      <div class="bar"><div class="bar__fill" style="width:${avance}%"></div></div>
      <p class="muted small">${avance} % completado</p>
      <ul class="checklist"></ul>
      <label class="notes">
        <span class="small muted">Notas / evidencias</span>
        <textarea rows="2" placeholder="Ej.: acta firmada, fecha de reunión, enlace a evidencia…"></textarea>
      </label>
    `;

    const ul = card.querySelector(".checklist");
    paso.actividades.forEach((act, i) => {
      const li = document.createElement("li");
      const id = `p${paso.id}-a${i}`;
      li.innerHTML = `<input type="checkbox" id="${id}" ${st.done[i] ? "checked" : ""}/><label for="${id}"></label>`;
      li.querySelector("label").textContent = act;
      li.querySelector("input").addEventListener("change", (e) => {
        state.pasos[paso.id].done[i] = e.target.checked;
        guardar();
        renderKotter();
        renderResumen();
      });
      ul.appendChild(li);
    });

    const ta = card.querySelector("textarea");
    ta.value = st.notas;
    ta.addEventListener("input", (e) => {
      state.pasos[paso.id].notas = e.target.value;
      guardar();
    });

    cont.appendChild(card);
  });
}

// ---------- KPI ----------
function renderCategorias() {
  const grid = $("#cat-grid");
  grid.innerHTML = "";
  KPI_CATEGORIES.forEach((cat) => {
    const lista = KPIS.filter((x) => x.cat === cat.id);
    const r = resumenKPI(lista, state.kpis);
    const medidos = lista.length - r["sin-dato"];
    const pct = medidos ? Math.round((r.verde / medidos) * 100) : 0;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card cat" + (filtroCategoria === cat.id ? " is-active" : "");
    card.innerHTML = `
      <span class="cat__name">${cat.nombre}</span>
      <span class="cat__pct">${medidos ? pct + " %" : "—"}</span>
      <span class="muted small">${r.verde} de ${medidos} medidos en meta</span>
      <div class="stack">
        <span class="stack__seg stack__seg--verde" style="flex:${r.verde}"></span>
        <span class="stack__seg stack__seg--ambar" style="flex:${r.ambar}"></span>
        <span class="stack__seg stack__seg--rojo" style="flex:${r.rojo}"></span>
        <span class="stack__seg stack__seg--sin-dato" style="flex:${r["sin-dato"]}"></span>
      </div>`;
    card.addEventListener("click", () => {
      filtroCategoria = filtroCategoria === cat.id ? "todas" : cat.id;
      renderKPI();
    });
    grid.appendChild(card);
  });
}

function renderChips() {
  const chips = $("#cat-chips");
  chips.innerHTML = "";
  [{ id: "todas", nombre: "Todas" }, ...KPI_CATEGORIES].forEach((cat) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (filtroCategoria === cat.id ? " is-active" : "");
    b.textContent = cat.nombre;
    b.addEventListener("click", () => {
      filtroCategoria = cat.id;
      renderKPI();
    });
    chips.appendChild(b);
  });
}

function renderTabla() {
  const body = $("#kpi-body");
  body.innerHTML = "";
  const lista = KPIS.filter((x) => filtroCategoria === "todas" || x.cat === filtroCategoria)
    .filter((x) => filtroEstado === "todos" || evaluarKPI(x, state.kpis[x.id]) === filtroEstado);

  if (lista.length === 0) {
    body.innerHTML = `<tr><td colspan="7" class="empty">No hay KPI con este filtro.</td></tr>`;
    return;
  }

  lista.forEach((kpi) => {
    const tr = document.createElement("tr");
    const est = evaluarKPI(kpi, state.kpis[kpi.id]);
    tr.innerHTML = `
      <td class="code">${kpi.id}</td>
      <td class="name"></td>
      <td class="hide-sm muted"></td>
      <td class="nowrap">${textoMeta(kpi)}</td>
      <td class="hide-sm muted">${kpi.frecuencia}</td>
      <td><input type="number" step="any" inputmode="decimal" aria-label="Valor de ${kpi.id}" /></td>
      <td><span class="pill pill--${est}">${ESTADO_TXT[est]}</span></td>`;
    tr.querySelector(".name").textContent = kpi.nombre;
    tr.children[2].textContent = kpi.formula;

    const input = tr.querySelector("input");
    input.value = state.kpis[kpi.id] ?? "";
    input.addEventListener("change", (e) => {
      const v = e.target.value.trim();
      if (v === "") delete state.kpis[kpi.id];
      else state.kpis[kpi.id] = Number(v);
      guardar();
      // actualizar solo la fila y los resúmenes para no perder el foco
      const nuevo = evaluarKPI(kpi, state.kpis[kpi.id]);
      const pill = tr.querySelector(".pill");
      pill.className = `pill pill--${nuevo}`;
      pill.textContent = ESTADO_TXT[nuevo];
      renderCategorias();
      renderResumen();
    });
    body.appendChild(tr);
  });
}

function renderKPI() {
  renderCategorias();
  renderChips();
  renderTabla();
}

// ---------- Resumen ----------
function renderResumen() {
  const totalAct = KOTTER_STEPS.reduce((s, p) => s + p.actividades.length, 0);
  const hechas = KOTTER_STEPS.reduce((s, p) => s + state.pasos[p.id].done.filter(Boolean).length, 0);
  const pct = Math.round((hechas / totalAct) * 100);
  $("#sum-kotter").textContent = `${pct} %`;
  $("#sum-kotter-bar").style.width = `${pct}%`;
  $("#sum-kotter-hint").textContent = `${hechas} de ${totalAct} actividades`;

  const actual = KOTTER_STEPS.find((p) => avancePaso(state.pasos[p.id].done) < 100);
  if (actual) {
    $("#sum-paso").textContent = `${actual.id}. ${actual.titulo}`;
    $("#sum-paso-hint").textContent = `${avancePaso(state.pasos[actual.id].done)} % · ${actual.periodo}`;
  } else {
    $("#sum-paso").textContent = "Plan completado";
    $("#sum-paso-hint").textContent = "Los 8 pasos están cerrados";
  }

  const r = resumenKPI(KPIS, state.kpis);
  const medidos = KPIS.length - r["sin-dato"];
  $("#sum-kpi").textContent = `${r.verde} / ${medidos}`;
  $("#sum-lights").innerHTML = `
    <span class="pill pill--verde">${r.verde} en meta</span>
    <span class="pill pill--ambar">${r.ambar} cerca</span>
    <span class="pill pill--rojo">${r.rojo} fuera</span>
    <span class="pill pill--sin-dato">${r["sin-dato"]} sin dato</span>`;
}

function renderTodo() {
  renderKotter();
  renderKPI();
  renderResumen();
}

// ---------- Acciones ----------
function initAcciones() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      $("#panel-kotter").hidden = tab.dataset.tab !== "kotter";
      $("#panel-kpi").hidden = tab.dataset.tab !== "kpi";
    });
  });

  $("#state-filter").addEventListener("change", (e) => {
    filtroEstado = e.target.value;
    renderTabla();
  });

  $("#btn-demo").addEventListener("click", () => {
    if (!confirm("Se reemplazarán los datos actuales por datos de ejemplo. ¿Continuar?")) return;
    state = normalizar(JSON.parse(JSON.stringify(DEMO_STATE)));
    guardar();
    renderTodo();
  });

  $("#btn-reset").addEventListener("click", () => {
    if (!confirm("Se borrarán todos los avances y valores registrados. ¿Continuar?")) return;
    state = estadoVacio();
    guardar();
    renderTodo();
  });

  $("#btn-export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `tablero-kotter-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $("#input-import").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      state = normalizar(JSON.parse(await file.text()));
      guardar();
      renderTodo();
    } catch {
      alert("El archivo no es un JSON válido del tablero.");
    }
    e.target.value = "";
  });
}

initAcciones();
renderTodo();
