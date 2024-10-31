import { loadSeats, occupySeat, freeSeat } from "./firebase.js";

const seatMap = document.getElementById("seatMap");
const selectedSeatsDisplay = document.getElementById("selectedSeats");
const confirmButton = document.getElementById("confirmButton");
let selectedSeats = [];

// Inicializa la visualización de los asientos
async function initializeSeats() {
  const seats = await loadSeats();

  // Crear la disposición de los asientos en el DOM
  for (let column of ["A", "B", "C"]) {
    for (let i = 1; i <= (column === "C" ? 47 : 51); i++) {
      const seatId = `${column}${i}`;
      const seat = document.createElement("div");
      seat.classList.add("seat");
      
      // Si el asiento está ocupado en Firestore, aplícale la clase correspondiente
      if (seats[seatId] && seats[seatId].occupied) {
        seat.classList.add("taken");
      }

      seat.textContent = seatId;
      seatMap.appendChild(seat);

      // Añadir el evento de clic para ocupar o liberar el asiento
      seat.addEventListener("click", () => toggleSeat(seat, seatId));
    }
  }
}

// Maneja la selección o deselección de un asiento
function toggleSeat(seat, seatId) {
  if (seat.classList.contains("taken")) return;

  seat.classList.toggle("selected");

  // Actualiza la lista de asientos seleccionados
  if (selectedSeats.includes(seatId)) {
    selectedSeats = selectedSeats.filter(id => id !== seatId);
  } else {
    selectedSeats.push(seatId);
  }

  updateSelectedSeatsDisplay();
}

// Actualiza la visualización de asientos seleccionados
function updateSelectedSeatsDisplay() {
  selectedSeatsDisplay.textContent = selectedSeats.join(", ");
}

// Confirmar selección y actualizar Firestore
confirmButton.addEventListener("click", async () => {
  if (selectedSeats.length > 0) {
    for (let seatId of selectedSeats) {
      const seatElement = document.querySelector(`div:contains(${seatId})`);
      seatElement.classList.remove("selected");
      seatElement.classList.add("taken");
      await occupySeat(seatId);
    }

    selectedSeats = [];
    updateSelectedSeatsDisplay();
  } else {
    alert("No has seleccionado ningún asiento.");
  }
});

// Cargar el estado inicial de los asientos
initializeSeats();
