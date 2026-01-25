import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAsyS-7xMJjvykJqo1tzye4VPE-JGVH2cI",
    authDomain: "sistema-escolar-sdc.firebaseapp.com",
    projectId: "sistema-escolar-sdc",
    storageBucket: "sistema-escolar-sdc.firebasestorage.app",
    messagingSenderId: "40055006162",
    appId: "1:40055006162:web:6bb2c82c350e893c435e0b"
};

// Inicializar Firebase (app principal)
const app = initializeApp(firebaseConfig);

// Inicializar app secundário para criar usuários sem afetar a sessão atual
const secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');
export const secondaryAuth = getAuth(secondaryApp);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
