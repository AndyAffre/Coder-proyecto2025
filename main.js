// Simulador de reservas de canchas y/o eventos depostivos  //

// ------------------ VARIABLES Y ARRAYS ----------------- //
const canchas = ["Cancha 1", "Cancha 2", "Cancha 3"];
let reservas = []; // Array donde guardaremos las reservas
let seguir = true;

// ------------------ FUNCIONES ----------------- //

// Función para mostrar los horarios disponibles //
function mostrarHorarios() {
  console.log("=== HORARIOS DISPONIBLES ===");
  for (let i = 10; i <= 22; i += 2) {
    console.log(`${i}:00 hs`);
  }
}

// Función para hacer una reserva //
function hacerReserva() {
  const nombre = prompt("Ingrese su nombre:");
  const cancha = prompt("Seleccione una cancha (1, 2 o 3):");
  const horario = prompt("Ingrese el horario que desea (10, 12, 14, ..., 22):");

  // Validaciones básicas
  if (!nombre || isNaN(cancha) || isNaN(horario)) {
    alert("Datos inválidos. Intente nuevamente.");
    return;
  }

  const canchaSeleccionada = canchas[cancha - 1];

  // Verificar si el horario ya está reservado //
  const existe = reservas.some(
    (r) => r.cancha === canchaSeleccionada && r.horario == horario
  );

  if (existe) {
    alert("Ese horario ya está reservado. Intente otro.");
  } else {
    reservas.push({ nombre, cancha: canchaSeleccionada, horario });
    alert(`Reserva confirmada: ${nombre} - ${canchaSeleccionada} - ${horario}:00 hs`);
  }
}

// Función para mostrar todas las reservas //
function verReservas() {
  console.log("=== RESERVAS CONFIRMADAS ===");
  if (reservas.length === 0) {
    console.log("No hay reservas registradas.");
  } else {
    reservas.forEach((r, i) => {
      console.log(`${i + 1}. ${r.nombre} - ${r.cancha} - ${r.horario}:00 hs`);
    });
  }
}

// Función para cancelar una reserva //
function cancelarReserva() {
  const nombre = prompt("Ingrese su nombre para cancelar su reserva:");
  const indice = reservas.findIndex((r) => r.nombre.toLowerCase() === nombre.toLowerCase());

  if (indice !== -1) {
    const confirmar = confirm(`¿Desea cancelar la reserva de ${reservas[indice].cancha} a las ${reservas[indice].horario}:00 hs?`);
    if (confirmar) {
      reservas.splice(indice, 1);
      alert("Reserva cancelada correctamente.");
    }
  } else {
    alert("No se encontró ninguna reserva con ese nombre.");
  }
}

// ------------------ SIMULADOR PRINCIPAL ----------------- //
alert("Bienvenido al simulador de reservas de canchas.");

while (seguir) {
  const opcion = prompt(
    "Seleccione una opción:\n1. Ver horarios\n2. Hacer una reserva\n3. Ver reservas\n4. Cancelar reserva\n5. Salir"
  );

  switch (opcion) {
    case "1":
      mostrarHorarios();
      break;
    case "2":
      hacerReserva();
      break;
    case "3":
      verReservas();
      break;
    case "4":
      cancelarReserva();
      break;
    case "5":
      alert("Gracias por usar el simulador. ¡Hasta luego!");
      seguir = false;
      break;
    default:
      alert("Opción inválida. Intente nuevamente.");
  }
}
