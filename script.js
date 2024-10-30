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

    // Crear las filas dentro de la columna
    let row;
    for (let seatNum = 1; seatNum <= seatCount; seatNum++) {
        // Crear una nueva fila si es el inicio de la columna o se alcanzó el límite de asientos por fila
        if (seatNum % 6 === 1 || seatNum % 7 === 1) {
            row = document.createElement('div');
            row.classList.add('row');
            if (seatNum % 13 === 1) row.classList.add('alternate');  // Alterna entre 6 y 7 asientos por fila
            columnDiv.appendChild(row);
        }

        // Crear el asiento
        const seat = document.createElement('div');
        seat.classList.add('seat');
        seat.textContent = `${column}${seatNum}`;

        // Agregar evento para seleccionar o cambiar el estado de ocupado
        seat.addEventListener('click', () => toggleSeat(seat, `${column}${seatNum}`));

        // Agregar el asiento a la fila
        row.appendChild(seat);
    }

    // Agregar la columna al mapa de asientos
    seatMap.appendChild(columnDiv);
});

// Función para seleccionar/deseleccionar asientos
function toggleSeat(seat, seatId) {
    if (seat.classList.contains('taken')) {
        // Si el asiento está ocupado, no permite seleccionarlo
        return;
    } else if (seat.classList.contains('selected')) {
        // Si el asiento está seleccionado, lo deselecciona
        seat.classList.remove('selected');
        selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
        // Si el asiento está libre, lo selecciona
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
