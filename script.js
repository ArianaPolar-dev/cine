// Importar las funciones necesarias del SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, doc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Configuración de Firebase
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
const seatMapA = document.getElementById('seatMapA');
const seatMapB = document.getElementById('seatMapB');
const seatMapC = document.getElementById('seatMapC');

// Variables auxiliares
let isAdmin = false;
let draggedSeat = null;

// Función para cargar y mostrar los asientos
async function loadSeats() {
    try {
        const seatsSnapshot = await getDocs(collection(db, "seats"));
        seatMapA.innerHTML = '';
        seatMapB.innerHTML = '';
        seatMapC.innerHTML = '';

        seatsSnapshot.forEach(doc => {
            const seatData = doc.data();
            const seatDiv = document.createElement('div');
            seatDiv.classList.add('seat');
            seatDiv.textContent = doc.id;

            // Aplicar estilo según el estado del asiento
            if (seatData.occupied) {
                seatDiv.classList.add('taken');
            }
            
            // Colocar los asientos en su sección respectiva
            if (doc.id.startsWith('A')) {
                seatMapA.appendChild(seatDiv);
            } else if (doc.id.startsWith('B')) {
                seatMapB.appendChild(seatDiv);
            } else if (doc.id.startsWith('C')) {
                seatMapC.appendChild(seatDiv);
            }

            // Funcionalidad de selección y arrastre para el administrador
            seatDiv.addEventListener('click', () => {
                if (isAdmin) {
                    toggleAdminSeat(seatDiv, doc.id);
                }
            });

            if (isAdmin) {
                seatDiv.draggable = true;
                seatDiv.addEventListener('dragstart', (e) => {
                    draggedSeat = seatDiv;
                });
                seatDiv.addEventListener('dragover', (e) => e.preventDefault());
                seatDiv.addEventListener('drop', () => {
                    if (draggedSeat && draggedSeat !== seatDiv) {
                        const draggedText = draggedSeat.textContent;
                        draggedSeat.textContent = seatDiv.textContent;
                        seatDiv.textContent = draggedText;
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error al cargar los asientos: ", error);
    }
}

// Cambiar estado del asiento (Admin)
async function toggleAdminSeat(seatDiv, seatId) {
    const seatRef = doc(db, "seats", seatId);
    const newStatus = !seatDiv.classList.contains('taken');
    await updateDoc(seatRef, { occupied: newStatus });
    seatDiv.classList.toggle('taken');
    alert(`El asiento ${seatId} ahora está ${newStatus ? "ocupado" : "libre"}.`);
}

// Llamar a loadSeats para cargar y mostrar los asientos al cargar la página
loadSeats();
