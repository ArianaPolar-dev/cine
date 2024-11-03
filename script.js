// Importar las funciones necesarias del SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, doc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Configuración de tu aplicación web de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5nPyvaMXhl2K02FDE1JDbm8ceJ_tRgSU",
  authDomain: "asientospolar.firebaseapp.com",
  projectId: "asientospolar",
  storageBucket: "asientospolar.firebasestorage.app",
  messagingSenderId: "477885194157",
  appId: "1:477885194157:web:8d0e7324be551002024b24"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



// Elementos HTML
const sectionA = document.getElementById('sectionA');
const sectionB = document.getElementById('sectionB');
const sectionC = document.getElementById('sectionC');
const confirmButton = document.getElementById('confirmButton');
const selectedSeatsDisplay = document.getElementById('selectedSeats');
const vipButton = document.getElementById('vipButton');
const vipModal = document.getElementById('vipModal');
const adminLogin = document.getElementById('adminLogin');
const adminPasswordInput = document.getElementById('adminPassword');
const closeModal = document.querySelector(".close");

let selectedSeats = [];
let isAdmin = false;
let draggedSeat = null;

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

    seatsSnapshot.forEach(doc => {
        const seatData = doc.data();
        const seatDiv = document.createElement('div');
        seatDiv.classList.add('seat');

        if (seatData.occupied) {
            seatDiv.classList.add('taken');
        }

        seatDiv.textContent = doc.id;

        // Agregar el asiento a la sección correspondiente
        if (doc.id.startsWith('A')) {
            sectionA.appendChild(seatDiv);
        } else if (doc.id.startsWith('B')) {
            sectionB.appendChild(seatDiv);
        } else if (doc.id.startsWith('C')) {
            sectionC.appendChild(seatDiv);
        }

        // Función para seleccionar y desmarcar asientos
        seatDiv.addEventListener('click', () => {
            if (isAdmin) {
                toggleAdminSeat(seatDiv, doc.id);
            } else {
                toggleUserSeat(seatDiv, doc.id);
            }
        });
    });
}

// Resto del código...

// Cargar asientos al cargar la página
loadSeats();
