let reservas = [];

const form = document.getElementById("formReserva");
const inputNombre = document.getElementById("nombre");
const selectCancha = document.getElementById("cancha");
const inputFecha = document.getElementById("fecha");
const selectHorario = document.getElementById("horario");
const listaReservas = document.getElementById("listaReservas");
const mensaje = document.getElementById("mensaje");
const btnBorrarTodo = document.getElementById("btnBorrarTodo");

document.addEventListener("DOMContentLoaded", () => {
    cargarCanchas();
    cargarHorarios();
    cargarReservas();
    renderReservas();
});

//Placeholder dinámico//

inputNombre.addEventListener("focus", () => {
    if(inputNombre.placeholder === "Ingrese su nombre") {
        inputNombre.placeholder = "";
    }
});

inputNombre.addEventListener("blur", () => {
    if(inputNombre.value.trim() === "") {
        inputNombre.placeholder = "Ingrese su nombre";
    }
});

//FETCH JSON//

async function cargarCanchas() {
    const resp = await fetch("data/canchas.json");
    const canchas = await resp.json();

    canchas.forEach(cancha => {
        const option = document.createElement("option");
        option.value = cancha.nombre;
        option.textContent = `${cancha.nombre} (${cancha.tipo})`;
        selectCancha.appendChild(option);
    });
}

async function cargarHorarios() {
    const resp = await fetch("data/horarios.json");
    const horarios = await resp.json();

    horarios.forEach(hora => {
        const option = document.createElement("option");
        option.value = hora;
        option.textContent = hora;
        selectHorario.appendChild(option);
    });
}

//EVENTO FORM//

form.addEventListener("submit", e => {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const cancha = selectCancha.value;
    const fecha = inputFecha.value;
    const horario = selectHorario.value;

    if (!nombre || !cancha || !fecha || !horario) {
        mostrarMensaje("Todos los campos son obligatorios", "error");
        return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
        mostrarMensaje("El nombre no puede contener números", "error");
        return;
    }

    const hoy = new Date();
    const fechaReserva = new Date(fecha);
    hoy.setHours(0,0,0,0);

    if (fechaReserva < hoy) {
        mostrarMensaje("No se permiten fechas pasadas", "error");
        return;
    }

    const existe = reservas.some(r =>
        r.cancha === cancha &&
        r.fecha === fecha &&
        r.horario === horario
    );

    if (existe) {
        mostrarMensaje("Esa cancha ya está reservada en ese horario", "error");
        return;
    }

    const reserva = {
        id: Date.now(),
        nombre,
        cancha,
        fecha,
        horario
    };

    reservas.push(reserva);
    guardarReservas();
    renderReservas();
    form.reset();
    mostrarMensaje("Reserva creada correctamente", "ok");

    
    inputNombre.placeholder = "Ingrese su nombre";
});

//RENDER//

function renderReservas() {
    listaReservas.innerHTML = "";

    reservas.forEach(reserva => {
        const li = document.createElement("li");
        li.className = "reserva-item";

        li.innerHTML = `
            <span class="reserva-info">
                ${reserva.nombre} - ${reserva.cancha} - ${reserva.fecha} - ${reserva.horario}
            </span>
            <button class="btn eliminar" data-id="${reserva.id}">Eliminar</button>
        `;

        li.querySelector("button").addEventListener("click", () => {
            eliminarReserva(reserva.id);
        });

        listaReservas.appendChild(li);
    });
}

//STORAGE//

function guardarReservas() {
    localStorage.setItem("reservas", JSON.stringify(reservas));
}

function cargarReservas() {
    const data = localStorage.getItem("reservas");
    reservas = data ? JSON.parse(data) : [];
}

function eliminarReserva(id) {
    reservas = reservas.filter(r => r.id !== id);
    guardarReservas();
    renderReservas();
}

btnBorrarTodo.addEventListener("click", () => {
    reservas = [];
    guardarReservas();
    renderReservas();
});

//MENSAJES//

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;

    setTimeout(() => {
        mensaje.textContent = "";
        mensaje.className = "mensaje";
    }, 3000);
}
