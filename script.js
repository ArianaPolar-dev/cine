const seatMap = document.getElementById('seatMap');
const selectedSeatsDisplay = document.getElementById('selectedSeats');
const confirmButton = document.getElementById('confirmButton');
let selectedSeats = [];

// Filas y columnas de asientos
const rows = ["A", "B", "C"];
const seatsPerRow = [7, 7, 6];
const totalSeats = seatsPerRow.reduce((a, b) => a + b, 0);

// Crear asientos con fila y número (ej. A1, B5)
rows.forEach((row, rowIndex) => {
    for (let seatNum = 1; seatNum <= seatsPerRow[rowIndex]; seatNum++) {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        seat.textContent = `${row}${seatNum}`;

        // Asignar algunos asientos como ocupados aleatoriamente
        if (Math.random() < 0.3) {
            seat.classList.add('taken');
            seat.title = "Asiento Ocupado";
        } else {
            seat.addEventListener('click', () => toggleSeat(seat, `${row}${seatNum}`));
        }

        seatMap.appendChild(seat);
    }
});

// Función para seleccionar/deseleccionar asientos
function toggleSeat(seat, seatId) {
    if (seat.classList.contains('taken')) return;

    seat.classList.toggle('selected');

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
        
        // Marcar asientos seleccionados como ocupados
        selectedSeats.forEach(seatId => {
            const seat = Array.from(seatMap.children).find(s => s.textContent === seatId);
            seat.classList.remove('selected');
            seat.classList.add('taken');
        });

        selectedSeats = [];
        updateSelectedSeatsDisplay();
    } else {
        alert("No has seleccionado ningún asiento.");
    }
});
