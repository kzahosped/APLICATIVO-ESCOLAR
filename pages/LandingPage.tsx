import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
            {/* Background subtle elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>

                {/* Logo Container */}
                <div className="mb-10 animate-fade-in">
                    <div className="w-28 h-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 rounded-3xl p-4 shadow-2xl shadow-purple-500/30 mx-auto">
                        <img
                            src="/logo-white.png"
                            alt="SDC Sul"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* App Title */}
                <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">SDC Gestão</h1>
                    <p className="text-gray-500 text-sm">Seminário Teológico SDC Sul</p>
                </div>

                {/* Action Buttons */}
                <div className="w-full max-w-sm space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {/* Login Button - Primary with gradient */}
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-purple-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined">login</span>
                        Entrar
                    </button>

                    {/* Secondary Actions */}
                    <div className="flex gap-3">
                        <a
                            href="https://www.seminariosdcsul.com.br/matricula"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3.5 px-4 bg-white text-gray-700 font-medium text-sm rounded-xl border border-gray-200 shadow-sm active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg text-purple-600">school</span>
                            Matricule-se
                        </a>
                        <a
                            href="https://www.seminariosdcsul.com.br/whatsapp_link.php"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3.5 px-4 bg-emerald-500 text-white font-medium text-sm rounded-xl shadow-md shadow-emerald-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">chat</span>
                            WhatsApp
                        </a>
                    </div>
                </div>

                {/* Quick Access Links */}
                <div className="mt-12 w-full max-w-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <p className="text-gray-400 text-xs text-center mb-4 uppercase tracking-wider font-medium">Acesso rápido</p>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { icon: 'info', label: 'Sobre', url: 'https://www.seminariosdcsul.com.br/quem-somos' },
                            { icon: 'calendar_month', label: 'Grade', url: 'https://www.seminariosdcsul.com.br/grade-curricular' },
                            { icon: 'schedule', label: 'Horários', url: 'https://www.seminariosdcsul.com.br/horarios' },
                            { icon: 'location_on', label: 'Local', url: 'https://www.seminariosdcsul.com.br/localizacao' },
                        ].map((item, idx) => (
                            <a
                                key={idx}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 shadow-sm active:scale-[0.95] transition-all"
                            >
                                <span className="material-symbols-outlined text-purple-600 text-xl">{item.icon}</span>
                                <span className="text-gray-600 text-[10px] font-medium">{item.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="py-6 px-6 text-center relative z-10">
                <a
                    href="https://www.seminariosdcsul.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 text-xs hover:text-purple-600 transition-colors"
                >
                    www.seminariosdcsul.com.br
                </a>
            </div>
        </div>
    );
};

export default LandingPage;
