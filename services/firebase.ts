import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
// INSTRUÇÕES: Substitua os valores abaixo pelas suas credenciais do Firebase
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "SUA_API_KEY_AQUI",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "seu-projeto.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "seu-projeto",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "seu-projeto.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
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
