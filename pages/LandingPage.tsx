import React from 'react';
// Last updated: {new Date().toISOString()}
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="floating-shape absolute top-20 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="floating-shape-delay absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="floating-shape absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Header/Navbar */}
            <header className="relative z-10 backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                            <img src="/logo-white.png" alt="SDC Sul" className="h-10 w-auto object-contain" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-white">SDC Sul</h1>
                            <p className="text-xs text-blue-200">Seminário Teológico</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 font-medium flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">login</span>
                        Área do Aluno
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32">
                <div className="text-center">
                    {/* Logo with Glow Effect */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl">
                                <img src="/logo-white.png" alt="SDC Sul Logo" className="h-28 w-auto object-contain" />
                            </div>
                        </div>
                    </div>

                    {/* Title with Gradient Text */}
                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 mb-6 leading-tight">
                        Seminário Teológico
                        <br />
                        <span className="text-white">SDC Sul</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                        Formando <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">servos para o Reino</span> através do ensino teológico de excelência
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://www.seminariosdcsul.com.br/matricula"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative px-8 py-4 rounded-full text-lg font-bold overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 transition-transform group-hover:scale-110"></div>
                            <div className="relative flex items-center justify-center gap-2 text-white">
                                <span className="material-symbols-outlined">school</span>
                                Faça sua Matrícula
                            </div>
                        </a>

                        <button
                            onClick={() => navigate('/login')}
                            className="group relative px-8 py-4 rounded-full text-lg font-bold overflow-hidden backdrop-blur-lg bg-white/10 border-2 border-white/30 hover:bg-white/20 transition-all"
                        >
                            <div className="flex items-center justify-center gap-2 text-white">
                                <span className="material-symbols-outlined">account_circle</span>
                                Acesse sua Conta
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="relative z-10 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Explore Mais</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Quem Somos', url: 'https://www.seminariosdcsul.com.br/quem-somos', icon: 'info' },
                            { label: 'Grade Curricular', url: 'https://www.seminariosdcsul.com.br/grade-curricular', icon: 'calendar_month' },
                            { label: 'Professores', url: 'https://www.seminariosdcsul.com.br/professores', icon: 'person' },
                            { label: 'Horários', url: 'https://www.seminariosdcsul.com.br/horarios', icon: 'schedule' },
                            { label: 'Fotos', url: 'https://www.seminariosdcsul.com.br/fotos', icon: 'photo_library' },
                            { label: 'Vídeos', url: 'https://www.seminariosdcsul.com.br/videos', icon: 'play_circle' },
                            { label: 'Localização', url: 'https://www.seminariosdcsul.com.br/localizacao', icon: 'location_on' },
                            { label: 'Fale Conosco', url: 'https://www.seminariosdcsul.com.br/fale-conosco', icon: 'mail' },
                            { label: 'Provas e simulados', url: 'https://www.seminariosdcsul.com.br/provas', icon: 'quiz' },
                            { label: 'Material Teológico', url: 'https://www.seminariosdcsul.com.br/material-teologico', icon: 'menu_book' },
                        ].map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group backdrop-blur-lg bg-white/10 border border-white/20 p-4 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all flex flex-col items-center gap-3 text-center transform hover:scale-105"
                            >
                                <div className="bg-gradient-to-br from-blue-400 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                                    <span className="material-symbols-outlined text-white text-2xl">{link.icon}</span>
                                </div>
                                <span className="font-medium text-white text-sm">{link.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Por que escolher a SDC Sul?</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: 'menu_book', title: 'Curso Completo', desc: '3 anos de formação teológica com grade curricular completa e atualizada', gradient: 'from-blue-500 to-cyan-500' },
                        { icon: 'groups', title: 'Professores Qualificados', desc: 'Equipe de mestres dedicados ao ensino profundo da Palavra de Deus', gradient: 'from-purple-500 to-pink-500' },
                        { icon: 'workspace_premium', title: 'Certificação', desc: 'Certificação reconhecida e valorizada ao concluir o curso', gradient: 'from-orange-500 to-red-500' }
                    ].map((feature, index) => (
                        <div key={index} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl ${feature.gradient}"></div>
                            <div className="relative backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl hover:border-white/40 transition-all transform hover:scale-105">
                                <div className={`bg-gradient-to-r ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                    <span className="material-symbols-outlined text-white text-3xl">{feature.icon}</span>
                                </div>
                                <h3 className="font-bold text-2xl mb-3 text-white">{feature.title}</h3>
                                <p className="text-blue-100 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="relative backdrop-blur-xl bg-gradient-to-r from-orange-500/20 to-pink-600/20 border border-white/30 rounded-3xl p-12 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 opacity-10"></div>
                        <div className="relative z-10">
                            <div className="bg-gradient-to-r from-orange-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <span className="material-symbols-outlined text-white text-4xl">celebration</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Matrículas Abertas!</h2>
                            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
                                Não perca a oportunidade de fazer parte da nossa comunidade de aprendizado e crescimento espiritual
                            </p>
                            <a
                                href="https://www.seminariosdcsul.com.br/whatsapp_link.php"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full hover:shadow-2xl hover:shadow-green-500/50 transition-all transform hover:scale-105 text-lg font-bold"
                            >
                                <span className="material-symbols-outlined text-2xl">chat</span>
                                Fale Conosco no WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 backdrop-blur-lg bg-black/30 border-t border-white/10 py-8 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-blue-100 mb-2">© 2024 Seminário Teológico SDC Sul - Todos os direitos reservados</p>
                    <p className="text-sm">
                        <a
                            href="https://www.seminariosdcsul.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition-all font-medium"
                        >
                            www.seminariosdcsul.com.br
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
