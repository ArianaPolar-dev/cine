// Importa las funciones necesarias del SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, doc, getDocs, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuración de Firebase para tu proyecto
const firebaseConfig = {
  apiKey: "API_KEY_AQUÍ",
  authDomain: "asientospolar.firebaseapp.com",
  projectId: "asientospolar",
  storageBucket: "asientospolar.firebaseapp.com",
  messagingSenderId: "477885194157",
  appId: "1:477885194157:web:8d0e7324be551002024b24"
};

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para cargar el estado de los asientos desde Firestore
export async function loadSeats() {
  const seatsCollection = collection(db, "seats");
  const seatSnapshot = await getDocs(seatsCollection);
  const seats = {};
  seatSnapshot.forEach((doc) => {
    seats[doc.id] = doc.data();
  });
  return seats; // Devuelve el estado de los asientos
}

// Función para ocupar un asiento en Firestore
export async function occupySeat(seatId) {
  const seatRef = doc(db, "seats", seatId);
  await setDoc(seatRef, { occupied: true }, { merge: true });
}

// Función para desocupar un asiento en Firestore
export async function freeSeat(seatId) {
  const seatRef = doc(db, "seats", seatId);
  await setDoc(seatRef, { occupied: false }, { merge: true });
}
