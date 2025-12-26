const CLAVE_STORAGE = "reservas";

/*Obtener reservas guardadas*/
function obtenerReservas() {
    const data = localStorage.getItem(CLAVE_STORAGE);
    return data ? JSON.parse(data) : [];
}

/*Guardar reservas*/
function guardarReservas(reservas) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(reservas));
}

/*Eliminar todas las reservas*/
function borrarReservas() {
    localStorage.removeItem(CLAVE_STORAGE);
}
