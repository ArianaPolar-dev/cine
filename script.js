const seatMap = document.getElementById('seatMap');
const selectedSeatsDisplay = document.getElementById('selectedSeats');
const confirmButton = document.getElementById('confirmButton');
let selectedSeats = [];

// Función para cargar asientos desde Firestore
async function loadSeats() {
    const seatsSnapshot = await db.collection('seats').get();
    seatMap.innerHTML = ''; // Limpiar el mapa de asientos
    
    seatsSnapshot.forEach(doc => {
        const seatData = doc.data();
        const seatId = doc.id;
        
        const seat = document.createElement('div');
        seat.classList.add('seat');
        seat.textContent = seatId;

        if (seatData.occupied) {
            seat.classList.add('taken');
        } else {
            seat.addEventListener('click', () => toggleSeat(seat, seatId));
        }
        
        seatMap.appendChild(seat);
    });
}

// Función para seleccionar/deseleccionar asientos
function toggleSeat(seat, seatId) {
    if (seat.classList.contains('taken')) return;

    if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
        seat.classList.add('selected');
        selectedSeats.push(seatId);
    }

    updateSelectedSeatsDisplay();
}

// Actualizar la visualización de asientos seleccionados
function updateSelectedSeatsDisplay() {
    selectedSeatsDisplay.textContent = selectedSeats.join(', ');
}

// Confirmar selección y actualizar en Firestore
confirmButton.addEventListener('click', async () => {
    if (selectedSeats.length > 0) {
        for (const seatId of selectedSeats) {
            await db.collection('seats').doc(seatId).update({ occupied: true });
        }
        
        selectedSeats = [];
        updateSelectedSeatsDisplay();
        loadSeats(); // Recargar el estado actualizado desde Firestore
    } else {
        alert("No has seleccionado ningún asiento.");
    }
});

// Cargar los asientos cuando se abra la página
loadSeats();
