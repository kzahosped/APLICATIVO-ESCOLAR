import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header/Navbar */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl">school</span>
                        <h1 className="font-bold text-xl text-gray-900">SDC Sul</h1>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Área do Aluno
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Seminário Teológico SDC Sul
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Formando servos para o Reino através do ensino teológico de excelência
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="https://www.seminariosdcsul.com.br/matricula"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
                    >
                        Faça sua Matrícula
                    </a>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors text-lg font-medium"
                    >
                        Acesse sua Conta
                    </button>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-primary text-3xl">book</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Curso Completo</h3>
                        <p className="text-gray-600">
                            3 anos de formação teológica com grade curricular completa
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-purple-600 text-3xl">groups</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Professores Qualificados</h3>
                        <p className="text-gray-600">
                            Equipe de mestres dedicados ao ensino da Palavra
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-green-600 text-3xl">verified</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Certificado</h3>
                        <p className="text-gray-600">
                            Certificação reconhecida ao concluir o curso
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="bg-gray-50 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Links Rápidos</h2>
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
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex items-center gap-3"
                            >
                                <span className="material-symbols-outlined text-primary">{link.icon}</span>
                                <span className="font-medium text-gray-800">{link.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Matrículas Abertas!</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Não perca a oportunidade de fazer parte da nossa comunidade
                    </p>
                    <a
                        href="https://www.seminariosdcsul.com.br/whatsapp_link.php"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium"
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
