const seatMap = document.getElementById('seatMap');
const selectedSeatsDisplay = document.getElementById('selectedSeats');
const confirmButton = document.getElementById('confirmButton');
let selectedSeats = [];

// Filas y cantidad de asientos por cada columna
const seatConfig = {
    A: 51,
    B: 51,
    C: 47
};

// Crear los asientos con disposición de 6 o 7 por fila
Object.entries(seatConfig).forEach(([row, seatCount]) => {
    for (let seatNum = 1; seatNum <= seatCount; seatNum++) {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        seat.textContent = `${row}${seatNum}`;

        // Asignar algunos asientos como ocupados aleatoriamente
        if (Math.random() < 0.3) {
            seat.classList.add('taken');
            seat.title = "Asiento Ocupado";
        }

        // Agregar evento para seleccionar o cambiar el estado de ocupado
        seat.addEventListener('click', () => toggleSeat(seat, `${row}${seatNum}`));

        seatMap.appendChild(seat);
    }

    // Crear una nueva fila después de cada 6 o 7 asientos
    const rowBreak = document.createElement('div');
    rowBreak.style.width = '100%';
    rowBreak.style.height = '0';
    seatMap.appendChild(rowBreak);
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
