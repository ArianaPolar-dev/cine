// Importar las funciones necesarias del SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, doc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuración de tu app de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5nPyvaMXhl2K02FDE1JDbm8ceJ_tRgSU",
  authDomain: "asientospolar.firebaseapp.com",
  projectId: "asientospolar",
  storageBucket: "asientospolar.firebasestorage.app",
  messagingSenderId: "477885194157",
  appId: "1:477885194157:web:8d0e7324be551002024b24"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Ejemplo de cómo leer y actualizar asientos en Firestore
export async function loadSeats() {
  const seatsCollection = collection(db, "seats");
  const seatSnapshot = await getDocs(seatsCollection);
  seatSnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    // Aquí puedes crear la lógica para representar los asientos en el DOM
  });
}

export async function occupySeat(seatId) {
  const seatRef = doc(db, "seats", seatId);
  await updateDoc(seatRef, { occupied: true });
  console.log(`Asiento ${seatId} ahora está ocupado`);
}
