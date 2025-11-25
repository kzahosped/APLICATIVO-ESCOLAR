import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const Debug: React.FC = () => {
    const [status, setStatus] = useState<any>({ loading: true });
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        const envCheck = {
            VITE_FIREBASE_API_KEY: !!import.meta.env.VITE_FIREBASE_API_KEY,
            VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        };

        try {
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);
            const usersList = snapshot.docs.map(doc => doc.data());

            setStatus({
                loading: false,
                success: true,
                env: envCheck,
                userCount: snapshot.size,
                message: 'Conexão com Firestore bem-sucedida!'
            });
            setUsers(usersList);
        } catch (error: any) {
            setStatus({
                loading: false,
                success: false,
                env: envCheck,
                error: error.message,
                code: error.code,
                message: 'Falha ao conectar com Firestore'
            });
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Diagnóstico de Conexão</h1>

            <div className={`p-4 rounded-lg mb-6 ${status.success ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} border`}>
                <h2 className="font-bold text-lg">{status.message}</h2>
                {status.error && <p className="text-red-700 mt-2">Erro: {status.error}</p>}
                {status.code && <p className="text-red-700 text-sm">Código: {status.code}</p>}
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-2">Variáveis de Ambiente</h3>
                <pre className="text-sm overflow-auto">
                    {JSON.stringify(status.env, null, 2)}
                </pre>
            </div>

            <div className="bg-white border p-4 rounded-lg">
                <h3 className="font-bold mb-2">Usuários Encontrados ({users.length})</h3>
                <ul className="list-disc pl-5">
                    {users.map((u, i) => (
                        <li key={i}>
                            {u.name} ({u.email}) - Role: {u.role}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Debug;
