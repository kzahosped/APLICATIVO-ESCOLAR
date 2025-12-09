import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 flex flex-col relative overflow-hidden">
            {/* Background subtle elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.15),transparent_50%)]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.15),transparent_50%)]"></div>
            </div>

            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>

                {/* Logo Container */}
                <div className="mb-10 animate-fade-in">
                    <div className="w-28 h-28 bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-2xl mx-auto">
                        <img
                            src="/logo-white.png"
                            alt="SDC Sul"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* App Title */}
                <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-3xl font-bold text-white mb-2">SDC Gestão</h1>
                    <p className="text-white/60 text-sm">Seminário Teológico SDC Sul</p>
                </div>

                {/* Action Buttons */}
                <div className="w-full max-w-sm space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {/* Login Button - Primary */}
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-4 px-6 bg-white text-indigo-900 font-bold text-lg rounded-2xl shadow-xl shadow-white/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
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
                            className="flex-1 py-3.5 px-4 bg-white/10 backdrop-blur-sm text-white font-medium text-sm rounded-xl border border-white/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">school</span>
                            Matricule-se
                        </a>
                        <a
                            href="https://www.seminariosdcsul.com.br/whatsapp_link.php"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3.5 px-4 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 font-medium text-sm rounded-xl border border-emerald-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">chat</span>
                            WhatsApp
                        </a>
                    </div>
                </div>

                {/* Quick Access Links */}
                <div className="mt-12 w-full max-w-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <p className="text-white/40 text-xs text-center mb-4 uppercase tracking-wider">Acesso rápido</p>
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
                                className="flex flex-col items-center gap-2 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 active:scale-[0.95] transition-all"
                            >
                                <span className="material-symbols-outlined text-white/70 text-xl">{item.icon}</span>
                                <span className="text-white/60 text-[10px] font-medium">{item.label}</span>
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
                    className="text-white/40 text-xs hover:text-white/60 transition-colors"
                >
                    www.seminariosdcsul.com.br
                </a>
            </div>
        </div>
    );
};

export default LandingPage;
