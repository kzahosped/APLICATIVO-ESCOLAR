import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header/Navbar */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="/256x256.png" alt="SDC Sul" className="h-12 w-12 object-contain" />
                        <h1 className="font-bold text-xl text-gray-900">SDC Sul</h1>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        Área do Aluno
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-4 py-20 text-center">
                <div className="mb-8 flex justify-center">
                    <img src="/256x256.png" alt="SDC Sul Logo" className="h-24 w-24 object-contain" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Seminário Teológico SDC Sul
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Formando servos para o Reino através do ensino teológico de excelência
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
                    <a
                        href="https://www.seminariosdcsul.com.br/matricula"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 text-lg font-medium shadow-md"
                    >
                        Faça sua Matrícula
                    </a>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-all transform hover:scale-105 text-lg font-medium shadow-md"
                    >
                        Acesse sua Conta
                    </button>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Por que escolher a SDC Sul?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center hover:shadow-lg transition-shadow">
                        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-primary text-4xl">book</span>
                        </div>
                        <h3 className="font-bold text-xl mb-3">Curso Completo</h3>
                        <p className="text-gray-600 leading-relaxed">
                            3 anos de formação teológica com grade curricular completa e atualizada
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center hover:shadow-lg transition-shadow">
                        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-primary text-4xl">groups</span>
                        </div>
                        <h3 className="font-bold text-xl mb-3">Professores Qualificados</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Equipe de mestres dedicados ao ensino profundo da Palavra de Deus
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center hover:shadow-lg transition-shadow">
                        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-primary text-4xl">verified</span>
                        </div>
                        <h3 className="font-bold text-xl mb-3">Certificação</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Certificação reconhecida e valorizada ao concluir o curso
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Links Rápidos</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Quem Somos', url: 'https://www.seminariosdcsul.com.br/quem-somos', icon: 'info' },
                            { label: 'Grade Curricular', url: 'https://www.seminariosdcsul.com.br/grade-curricular', icon: 'calendar_month' },
                            { label: 'Professores', url: 'https://www.seminariosdcsul.com.br/professores', icon: 'person' },
                            { label: 'Horários', url: 'https://www.seminariosdcsul.com.br/horarios', icon: 'schedule' },
                            { label: 'Fotos', url: 'https://www.seminariosdcsul.com.br/fotos', icon: 'photo_library' },
                            { label: 'Vídeos', url: 'https://www.seminariosdcsul.com.br/videos', icon: 'play_circle' },
                            { label: 'Localização', url: 'https://www.seminariosdcsul.com.br/localizacao', icon: 'location_on' },
                            { label: 'Fale Conosco', url: 'https://www.seminariosdcsul.com.br/fale-conosco', icon: 'mail' },
                        ].map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary transition-all flex items-center gap-3 group"
                            >
                                <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
                                <span className="font-medium text-gray-800 group-hover:text-primary transition-colors">{link.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-white py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Matrículas Abertas!</h2>
                    <p className="text-xl mb-10 opacity-95 leading-relaxed">
                        Não perca a oportunidade de fazer parte da nossa comunidade de aprendizado e crescimento espiritual
                    </p>
                    <a
                        href="https://www.seminariosdcsul.com.br/whatsapp_link.php"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 text-lg font-medium shadow-lg"
                    >
                        <span className="material-symbols-outlined">chat</span>
                        Fale Conosco no WhatsApp
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-8">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="mb-2">© 2024 Seminário Teológico SDC Sul - Todos os direitos reservados</p>
                    <p className="text-sm">
                        <a
                            href="https://www.seminariosdcsul.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
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
