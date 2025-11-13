// ---------- VARIABLES Y ARRAYS ---------- //

const formReserva = document.getElementById("formReserva");
const reservasContainer = document.getElementById("reservasContainer");
const btnBorrarTodo = document.getElementById("btnBorrarTodo");

let reservas = JSON.parse(localStorage.getItem("reservas")) || []; 


// ---------- FUNCIONES ---------- //

// Función para renderizar todas las reservas en pantalla //
function mostrarReservas() {
  reservasContainer.innerHTML = ""; 

  reservas.forEach((reserva, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${reserva.nombre}</strong> - ${reserva.cancha} - ${reserva.fechaHora}</span>
      <button class="borrar" data-index="${index}">Eliminar</button>
    `;
    reservasContainer.appendChild(li);
  });

  
  const botonesBorrar = document.querySelectorAll(".borrar");
  botonesBorrar.forEach(btn => {
    btn.addEventListener("click", eliminarReserva);
  });
}

// Función para agregar una reserva nuevas //
function agregarReserva(event) {
  event.preventDefault(); 

  const nombre = document.getElementById("nombre").value.trim();
  const cancha = document.getElementById("cancha").value.trim();
  const fechaHora = document.getElementById("fechaHora").value;

  if (nombre === "" || cancha === "" || fechaHora === "") return;

  const nuevaReserva = { nombre, cancha, fechaHora };
  reservas.push(nuevaReserva);

  //  localStorage //
  localStorage.setItem("reservas", JSON.stringify(reservas));

  formReserva.reset(); 
  mostrarReservas(); 
}

// Función para eliminar una reserva específica //
function eliminarReserva(event) {
  const index = event.target.dataset.index;
  reservas.splice(index, 1);
  localStorage.setItem("reservas", JSON.stringify(reservas));
  mostrarReservas();
}

// Función para borrar todas las reservas //
function borrarTodas() {
  reservas = [];
  localStorage.removeItem("reservas");
  mostrarReservas();
}

// ---------- EVENTOS ---------- //
formReserva.addEventListener("submit", agregarReserva);
btnBorrarTodo.addEventListener("click", borrarTodas);


// ---------- INICIALIZACIÓN ---------- //
mostrarReservas(); 