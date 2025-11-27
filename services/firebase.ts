import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
// INSTRUÇÕES: Substitua os valores abaixo pelas suas credenciais do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAsyS-7xMJjvykJqo1tzye4VPE-JGVH2cI",
    authDomain: "sistema-escolar-sdc.firebaseapp.com",
    projectId: "sistema-escolar-sdc",
    storageBucket: "sistema-escolar-sdc.firebasestorage.app",
    messagingSenderId: "40055006162",
    appId: "1:40055006162:web:6bb2c82c350e893c435e0b"
};

console.log('🔥 Firebase Config Check:', {
    apiKeyPresent: !!firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket
});

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);

// Habilitar persistência offline (os dados ficam salvos localmente também)
if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Persistência desabilitada: múltiplas abas abertas');
        } else if (err.code === 'unimplemented') {
            console.warn('Persistência não suportada neste navegador');
        }
    });
}

export default app;
