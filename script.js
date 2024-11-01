import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, doc, getDocs, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "tu-apiKey",
  authDomain: "tu-authDomain",
  projectId: "tu-projectId",
  storageBucket: "tu-storageBucket",
  messagingSenderId: "tu-messagingSenderId",
  appId: "tu-appId"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seatMap = document.getElementById('seatMap');
const confirmButton = document.getElementById('confirmButton');
const selectedSeatsDisplay = document.getElementById('selectedSeats');
const vipButton = document.getElementById('vipButton');
const vipModal = document.getElementById('vipModal');
const adminLogin = document.getElementById('adminLogin');
const adminPasswordInput = document.getElementById('adminPassword');
const closeModal = document.querySelector(".close");

let selectedSeats = [];
let isAdmin = false;

// Mostrar modal de autenticación
vipButton.addEventListener('click', () => {
    vipModal.style.display = 'block';
});

// Cerrar modal
closeModal.addEventListener('click', () => {
    vipModal.style.display = 'none';
});

// Validar clave de administrador
adminLogin.addEventListener('click', () => {
    const password = adminPasswordInput.value;
    if (password === "piroxeno") {
        isAdmin = true;
        vipModal.style.display = 'none';
        alert("Acceso de administrador concedido.");
    } else {
        alert("Clave incorrecta.");
    }
});

// Función para cargar los asientos
async function loadSeats() {
    const seatsSnapshot = await getDocs(collection(db, "seats"));
    seatMap.innerHTML = ''; // Limpiar el mapa de asientos antes de recargar

    seatsSnapshot.forEach(doc => {
        const seatData = doc.data();
        const seatDiv = document.createElement('div');
        seatDiv.classList.add('seat');

        if (seatData.occupied) {
            seatDiv.classList.add('taken');
        }

        seatDiv.textContent = doc.id;

        // Permitir seleccionar/desmarcar si es usuario o cambiar estado si es administrador
        seatDiv.addEventListener('click', () => {
            if (isAdmin) {
                toggleAdminSeat(seatDiv, doc.id);
            } else {
                toggleUserSeat(seatDiv, doc.id);
            }
        });

        seatMap.appendChild(seatDiv);
    });
}

// Función para alternar el estado del asiento (usuario)
function toggleUserSeat(seatDiv, seatId) {
    if (seatDiv.classList.contains('taken')) return;

    seatDiv.classList.toggle('selected');
    if (selectedSeats.includes(seatId)) {
        selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
        selectedSeats.push(seatId);
    }

    selectedSeatsDisplay.textContent = selectedSeats.join(', ');
}

// Función para alternar el estado del asiento (admin)
async function toggleAdminSeat(seatDiv, seatId) {
    const seatRef = doc(db, "seats", seatId);
    const newStatus = !seatDiv.classList.contains('taken');

    await updateDoc(seatRef, { occupied: newStatus });
    seatDiv.classList.toggle('taken');
    alert(`Asiento ${seatId} ahora está ${newStatus ? "ocupado" : "libre"}.`);
}

// Confirmar selección de asientos (usuario)
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
    loadSeats();
});

// Cargar asientos al cargar la página
loadSeats();
