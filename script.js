// Importar las funciones necesarias del SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, doc, getDocs, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Configuración de Firebase (usa tu configuración actual)
const firebaseConfig = {
  apiKey: "AIzaSyA5nPyvaMXhl2K02FDE1JDbm8ceJ_tRgSU",
  authDomain: "asientospolar.firebaseapp.com",
  projectId: "asientospolar",
  storageBucket: "asientospolar.firebaseapp.com",
  messagingSenderId: "477885194157",
  appId: "1:477885194157:web:8d0e7324be551002024b24"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Código para cargar y actualizar el estado de los asientos
const seatMap = document.getElementById('seatMap');
const confirmButton = document.getElementById('confirmButton');
const selectedSeatsDisplay = document.getElementById('selectedSeats');
let selectedSeats = [];

// Cargar los asientos desde Firestore y mostrarlos en el DOM
async function loadSeats() {
    const seatsSnapshot = await getDocs(collection(db, "seats"));
    seatsSnapshot.forEach(doc => {
        const seatData = doc.data();
        const seatDiv = document.createElement('div');
        seatDiv.classList.add('seat');
        
        // Si el asiento está ocupado, márcalo como "taken"
        if (seatData.occupied) {
            seatDiv.classList.add('taken');
        } else {
            // Permitir al usuario seleccionar el asiento si está libre
            seatDiv.addEventListener('click', () => toggleSeat(seatDiv, doc.id));
        }
        
        seatDiv.textContent = doc.id; // Esto muestra el ID del asiento
        seatMap.appendChild(seatDiv);
    });
}

// Función para alternar entre seleccionar y deseleccionar un asiento
function toggleSeat(seatDiv, seatId) {
    if (seatDiv.classList.contains('taken')) return;

    seatDiv.classList.toggle('selected');
    if (selectedSeats.includes(seatId)) {
        selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
        selectedSeats.push(seatId);
    }

    selectedSeatsDisplay.textContent = selectedSeats.join(', ');
}

// Confirmar selección y guardar en Firestore
confirmButton.addEventListener('click', async () => {
    if (selectedSeats.length === 0) {
        alert("No has seleccionado ningún asiento.");
        return;
    }

    for (const seatId of selectedSeats) {
        const seatRef = doc(db, "seats", seatId);
        await updateDoc(seatRef, { occupied: true });
    }

    alert(`Has confirmado los asientos: ${selectedSeats.join(', ')}`);
    selectedSeats = [];
    selectedSeatsDisplay.textContent = "";
    seatMap.innerHTML = ""; // Limpiar el mapa de asientos
    loadSeats(); // Recargar los asientos con el nuevo estado
});

// Llamar a loadSeats() al cargar la página
loadSeats();
