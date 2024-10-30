const seatMap = document.getElementById('seatMap');
const selectedSeatsDisplay = document.getElementById('selectedSeats');
const confirmButton = document.getElementById('confirmButton');
let selectedSeats = [];

// Configuración de columnas y cantidad de asientos
const seatConfig = {
    A: 51,
    B: 51,
    C: 47
};

// Crear columnas
Object.entries(seatConfig).forEach(([column, seatCount]) => {
    // Crear un contenedor para la columna
    const columnDiv = document.createElement('div');
    columnDiv.classList.add('column');

    // Crear los asientos en la columna
    for (let seatNum = 1; seatNum <= seatCount; seatNum++) {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        seat.textContent = `${column}${seatNum}`;

        // Asignar algunos asientos como ocupados aleatoriamente
        if (Math.random() < 0.3) {
            seat.classList.add('taken');
            seat.title = "Asiento Ocupado";
        }

        // Agregar evento para seleccionar o cambiar el estado de ocupado
        seat.addEventListener('click', () => toggleSeat(seat, `${column}${seatNum}`));

        columnDiv.appendChild(seat);
    }

    // Agregar la columna al mapa de asientos
    seatMap.appendChild(columnDiv);
});

// Función para seleccionar/deseleccionar o cambiar el estado de asientos ocupados
function toggleSeat(seat, seatId) {
    if (seat.classList.contains('taken')) {
        // Si está ocupado, se puede liberar
        seat.classList.remove('taken');
        seat.classList.add('selected');
        selectedSeats.push(seatId);
    } else if (seat.classList.contains('selected')) {
        // Si está seleccionado, se deselecciona
        seat.classList.remove('selected');
        selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
        // Si está libre, se selecciona
        seat.classList.add('selected');
        selectedSeats.push(seatId);
    }

    updateSelectedSeatsDisplay();
}

// Actualizar la visualización de asientos seleccionados
function updateSelectedSeatsDisplay() {
    selectedSeatsDisplay.textContent = selectedSeats.join(', ');
}

// Confirmar selección
confirmButton.addEventListener('click', () => {
    if (selectedSeats.length > 0) {
        alert(`Has confirmado los asientos: ${selectedSeats.join(', ')}`);
        
        // Marcar asientos seleccionados como ocupados
        selectedSeats.forEach(seatId => {
            const seat = Array.from(seatMap.querySelectorAll('.seat')).find(s => s.textContent === seatId);
            if (seat) {
                seat.classList.remove('selected');
                seat.classList.add('taken');
            }
        });

        selectedSeats = [];
        updateSelectedSeatsDisplay();
    } else {
        alert("No has seleccionado ningún asiento.");
    }
});
