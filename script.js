const seatMap = document.getElementById('seatMap');
const selectedSeatsDisplay = document.getElementById('selectedSeats');
const confirmButton = document.getElementById('confirmButton');
let selectedSeats = [];

// Configuración de asientos en filas y columnas específicas
const seatConfig = {
    A: { rows: 9, seatsPerRow: [6, 7] },  // 51 asientos en total
    B: { rows: 9, seatsPerRow: [6, 7] },  // 51 asientos en total
    C: { rows: 8, seatsPerRow: [6, 7] }   // 47 asientos en total
};

// Crear asientos según configuración
Object.entries(seatConfig).forEach(([column, config]) => {
    let seatNumber = 1;
    for (let row = 0; row < config.rows; row++) {
        const seatsInThisRow = config.seatsPerRow[row % config.seatsPerRow.length];
        for (let i = 0; i < seatsInThisRow; i++) {
            const seat = document.createElement('div');
            seat.classList.add('seat', 'available');
            seat.textContent = seatNumber;
            seat.dataset.seatId = `${column}${seatNumber}`;
            seat.title = `${column}${seatNumber}`;
            
            // Simulación de algunos asientos ocupados
            if (Math.random() < 0.3) {
                seat.classList.remove('available');
                seat.classList.add('taken');
                seat.title = "Asiento Ocupado";
            } else {
                seat.addEventListener('click', () => toggleSeat(seat));
            }

            seatMap.appendChild(seat);
            seatNumber++;
        }

        // Insertar espacio de pasillo al final de cada fila
        const aisle = document.createElement('div');
        aisle.classList.add('aisle');
        seatMap.appendChild(aisle);
    }
});

// Función para seleccionar/deseleccionar asientos
function toggleSeat(seat) {
    if (seat.classList.contains('taken')) return;

    seat.classList.toggle('selected');

    const seatId = seat.dataset.seatId;

    if (selectedSeats.includes(seatId)) {
        selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
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
        // Actualizar los asientos seleccionados a ocupados
        selectedSeats.forEach(seatId => {
            const seatElement = document.querySelector(`[data-seat-id="${seatId}"]`);
            seatElement.classList.remove('selected');
            seatElement.classList.remove('available');
            seatElement.classList.add('taken');
            seatElement.removeEventListener('click', toggleSeat);
        });
        selectedSeats = [];
        updateSelectedSeatsDisplay();
    } else {
        alert("No has seleccionado ningún asiento.");
    }
});
