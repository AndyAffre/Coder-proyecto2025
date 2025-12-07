
  // Todos los selectores //

const canchaSelect = document.getElementById("canchaSelect");
const horaSelect = document.getElementById("horaSelect");
const reservaForm = document.getElementById("reservaForm");
const listaReservas = document.getElementById("listaReservas");
const mensajeEl = document.getElementById("mensaje");
const btnBorrarTodo = document.getElementById("btnBorrarTodo");
const inputNombre = document.getElementById("nombre");

let canchas = [];
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

(async function init() {
  await cargarCanchas();
  poblarHoras(9, 23); 
  renderReservas();
  configurarEventos();
})();

 // funcion de canchas y poblado de estas //

async function cargarCanchas() {
  canchaSelect.innerHTML = '<option value="">Cargando canchas...</option>';
  try {
    const res = await fetch("data/canchas.json");
    if (!res.ok) throw new Error("No se pudo cargar canchas");
    const data = await res.json();
    canchas = Array.isArray(data) ? data : (data.canchas || []);
    poblarSelectCanchas();
  } catch (err) {
    canchaSelect.innerHTML = '<option value="">Error cargando canchas</option>';
    canchas = [];
    mostrarMensaje("Error al cargar canchas", "error");
  }
}

function poblarSelectCanchas() {
  canchaSelect.innerHTML = '<option value="">Seleccioná una cancha</option>';
  canchas.forEach((c, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx); 
    const nombre = c.nombre || `Cancha ${idx + 1}`;
    const tipo = c.tipo ? ` (${c.tipo})` : "";
    const precioTxt = c.precio !== undefined ? ` — $${c.precio}` : "";
    opt.textContent = `${nombre}${tipo}${precioTxt}`;
    canchaSelect.appendChild(opt);
  });
}

// Horarios //
function poblarHoras(horaInicio = 9, horaFin = 23) {
  horaSelect.innerHTML = '<option value="">Seleccioná una hora</option>';
  for (let h = horaInicio; h <= horaFin; h++) {
    const hh = String(h).padStart(2, "0");
    const opt = document.createElement("option");
    opt.value = `${hh}:00`;
    opt.textContent = `${hh}:00`;
    horaSelect.appendChild(opt);
  }
}

   // Eventos y placeholder //

function configurarEventos() {
  reservaForm.addEventListener("submit", handleSubmit);
  btnBorrarTodo.addEventListener("click", handleBorrarTodo);

  
  const placeholderText = "Ingrese un nombre";
  inputNombre.placeholder = placeholderText;

  inputNombre.addEventListener("focus", () => {
    
    inputNombre.placeholder = "";
  });

  inputNombre.addEventListener("blur", () => {
  
    if (!inputNombre.value.trim()) {
      inputNombre.placeholder = placeholderText;
    }
  });

  inputNombre.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      inputNombre.value = "";
      inputNombre.blur();
      inputNombre.placeholder = placeholderText;
    }
  });
}

  // Submit nueva reseva //

function handleSubmit(e) {
  e.preventDefault();

  const nombre = inputNombre.value.trim();
  const canchaIdx = canchaSelect.value;
  const fecha = document.getElementById("fecha").value;
  const hora = horaSelect.value;

  // Validaciones //
  if (!nombre) {
    mostrarMensaje("Por favor ingresá tu nombre antes de reservar.", "error");
    inputNombre.focus();
    return;
  }

  if (canchaIdx === "" || !fecha || !hora) {
    mostrarMensaje("Completá todos los campos (cancha, fecha y hora).", "error");
    return;
  }

  const idx = Number(canchaIdx);
  if (!Number.isFinite(idx) || !canchas[idx]) {
    mostrarMensaje("Seleccioná una cancha válida.", "error");
    return;
  }

  // Prevención de duplicados //
  const existe = reservas.some(r =>
    String(r.canchaIdx) === String(idx) &&
    r.fecha === fecha &&
    r.hora === hora
  );

  if (existe) {
    mostrarMensaje("Esa cancha ya está reservada en ese día y horario.", "error");
    return;
  }

  const canchaObj = canchas[idx];

  const nuevaReserva = {
    id: Date.now(),
    nombre,
    canchaIdx: idx,
    canchaNombre: canchaObj.nombre || `Cancha ${idx + 1}`,
    tipo: canchaObj.tipo || "",
    precio: canchaObj.precio !== undefined ? canchaObj.precio : null,
    fecha,
    hora
  };

 // Crear nueva rerserva //
  reservas.push(nuevaReserva);
  guardarReservas();
  renderReservas();
  reservaForm.reset();
  inputNombre.placeholder = "Ingrese un nombre";
  inputNombre.value = "";
  mostrarMensaje("Reserva creada correctamente.", "ok");
}

  // Render de reservas //

function renderReservas() {
  listaReservas.innerHTML = "";

  if (!reservas.length) {
    listaReservas.innerHTML = "<li>No hay reservas registradas.</li>";
    btnBorrarTodo.style.display = "none";
    return;
  }

  reservas.forEach(r => {
    const li = document.createElement("li");
    li.className = "reserva-item";

    const info = document.createElement("div");
    info.className = "reserva-info";
    info.innerHTML = `
      <div><strong>${escapeHtml(r.nombre)}</strong></div>
      <div class="small">${escapeHtml(r.canchaNombre)} ${r.tipo ? `(${escapeHtml(r.tipo)})` : ""} — ${r.precio !== null ? `$${r.precio}` : ""}</div>
      <div class="small">${escapeHtml(r.fecha)} — ${escapeHtml(r.hora)}</div>
    `;

    const actions = document.createElement("div");
    actions.className = "reserva-actions";

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn eliminar";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => eliminarReservaPorId(r.id));

    actions.appendChild(btnEliminar);

    li.appendChild(info);
    li.appendChild(actions);
    listaReservas.appendChild(li);
  });

  btnBorrarTodo.style.display = "block";
}

// Funcion de eleminar y borrar reservas //
function eliminarReservaPorId(id) {
  reservas = reservas.filter(r => r.id !== id);
  guardarReservas();
  renderReservas();
  mostrarMensaje("Reserva eliminada.", "ok");
}

function handleBorrarTodo() {
  reservas = [];
  guardarReservas();
  renderReservas();
  mostrarMensaje("Todas las reservas fueron eliminadas.", "ok");
}

// Storage //
function guardarReservas() {
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

function mostrarMensaje(texto, tipo) {
  mensajeEl.textContent = texto;
  mensajeEl.style.color = tipo === "error" ? "#c0392b" : "#1a9a00";
  clearTimeout(mostrarMensaje._t);
  mostrarMensaje._t = setTimeout(() => { mensajeEl.textContent = ""; }, 3000);
}

function escapeHtml(unsafe) {
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
