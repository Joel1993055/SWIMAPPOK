'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Activity,
    ArrowRight,
    BarChart3,
    Brain,
    CheckCircle,
    Clock,
    Play,
    Shield,
    Smartphone,
    Sparkles,
    Target,
    TrendingUp,
    Trophy,
    Users,
    Waves,
    Zap
} from 'lucide-react';
import { useState } from 'react';

export default function MarketingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }
      `}</style>
      <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                SwimAI
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Características</a>
              <a href="#pricing" className="text-gray-300 hover:text-cyan-400 transition-colors">Precios</a>
              <a href="#about" className="text-gray-300 hover:text-cyan-400 transition-colors">Acerca de</a>
              <a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contacto</a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Iniciar Sesión
              </Button>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                Empezar Gratis
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Revoluciona tu entrenamiento
                </Badge>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                    IA para Nadadores
                  </span>
                  <br />
                  <span className="text-white">Inteligentes</span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed">
                  Detecta automáticamente las zonas de entrenamiento de tus sesiones de natación. 
                  Analiza tu progreso y optimiza tu rendimiento con inteligencia artificial.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3">
                  <Play className="w-4 h-4 mr-2" />
                  Ver Demo
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3">
                  <Users className="w-4 h-4 mr-2" />
                  Unirse a la Beta
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Gratis para empezar
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Sin tarjeta de crédito
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Configuración en 2 minutos
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative animate-float">
              <div className="relative z-10">
                <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover-lift">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Entrenamiento de Hoy</h3>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                          Completado
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-sm text-gray-400">
                          "12x25 FINS + SNKL on 1' 0.9 12x50 IM on 1' PULL 1.2 16x75 Pull + Pds 0.2 8x20 Fast on 45" UW Kick FINS 1 5x (1x175 + 1x25 Fast) 0.5 20x25 Fly on 35" 0.1 50 Easy 0.1 1x100 Fly FINS FAST"
                        </div>
                        
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { zone: 'Z1', meters: 200, color: 'bg-green-500/20 border-green-500/30' },
                            { zone: 'Z2', meters: 400, color: 'bg-blue-500/20 border-blue-500/30' },
                            { zone: 'Z3', meters: 600, color: 'bg-yellow-500/20 border-yellow-500/30' },
                            { zone: 'Z4', meters: 200, color: 'bg-orange-500/20 border-orange-500/30' },
                            { zone: 'Z5', meters: 100, color: 'bg-red-500/20 border-red-500/30' },
                          ].map(({ zone, meters, color }) => (
                            <div key={zone} className={`p-3 rounded-lg border ${color} text-center`}>
                              <div className="text-xs text-gray-400">{zone}</div>
                              <div className="text-sm font-semibold text-white">{meters}m</div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total: 1,500m</span>
                          <span className="text-cyan-400">Detectado por IA</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-pink-600/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Características que te harán nadar mejor
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Tecnología de vanguardia diseñada específicamente para nadadores que buscan optimizar su rendimiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Detección Automática de Zonas",
                description: "Nuestra IA analiza tu entrenamiento y detecta automáticamente los metros en cada zona de intensidad (Z1-Z5).",
                features: ["Análisis en tiempo real", "Precisión del 95%", "Sin configuración manual"]
              },
              {
                icon: BarChart3,
                title: "Análisis de Progreso",
                description: "Visualiza tu evolución con gráficos detallados y métricas que importan para tu rendimiento.",
                features: ["Gráficos interactivos", "Tendencias semanales", "Comparativas históricas"]
              },
              {
                icon: Target,
                title: "Objetivos Inteligentes",
                description: "Establece metas personalizadas y recibe recomendaciones basadas en tu historial de entrenamientos.",
                features: ["Metas adaptativas", "Recomendaciones IA", "Seguimiento automático"]
              },
              {
                icon: Zap,
                title: "Tiempo Real",
                description: "Análisis instantáneo de tus entrenamientos sin esperas. Resultados en segundos.",
                features: ["Procesamiento instantáneo", "API de alta velocidad", "Sincronización automática"]
              },
              {
                icon: Shield,
                title: "Datos Seguros",
                description: "Tus entrenamientos están protegidos con encriptación de grado militar y privacidad garantizada.",
                features: ["Encriptación AES-256", "Cumplimiento GDPR", "Backup automático"]
              },
              {
                icon: Smartphone,
                title: "Multiplataforma",
                description: "Accede desde cualquier dispositivo. Web, móvil, tablet. Siempre sincronizado.",
                features: ["App nativa iOS/Android", "Sincronización en la nube", "Offline disponible"]
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover-lift group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                      <feature.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">{feature.description}</p>
                      <ul className="space-y-1">
                        {feature.features.map((item, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-xs text-gray-500">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { number: "10K+", label: "Nadadores Activos", icon: Users, description: "Usuarios registrados" },
              { number: "500K+", label: "Entrenamientos Analizados", icon: Activity, description: "Sesiones procesadas" },
              { number: "95%", label: "Precisión de Detección", icon: Target, description: "Tasa de acierto" },
              { number: "24/7", label: "Disponibilidad", icon: Clock, description: "Servicio continuo" }
            ].map((stat, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm font-medium text-gray-300 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Planes para cada nadador
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Elige el plan que mejor se adapte a tus necesidades de entrenamiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Básico",
                price: "Gratis",
                period: "para siempre",
                description: "Perfecto para empezar",
                features: [
                  "10 detecciones automáticas/mes",
                  "Análisis básico de progreso",
                  "Soporte por email",
                  "Acceso web y móvil"
                ],
                cta: "Empezar Gratis",
                popular: false,
                color: "border-gray-600"
              },
              {
                name: "Premium",
                price: "$4.99",
                period: "por mes",
                description: "Para nadadores serios",
                features: [
                  "50 detecciones automáticas/mes",
                  "Análisis avanzado de progreso",
                  "Exportación de datos",
                  "Soporte prioritario",
                  "Objetivos personalizados"
                ],
                cta: "Comenzar Prueba",
                popular: true,
                color: "border-cyan-500"
              },
              {
                name: "Pro",
                price: "$9.99",
                period: "por mes",
                description: "Para atletas profesionales",
                features: [
                  "Detecciones ilimitadas",
                  "Análisis personalizado con IA",
                  "Coaching automático",
                  "Integración con dispositivos",
                  "Soporte 24/7",
                  "API personalizada"
                ],
                cta: "Comenzar Prueba",
                popular: false,
                color: "border-purple-500"
              }
            ].map((plan, index) => (
              <Card key={index} className={`bg-gray-900/50 ${plan.color} ${plan.popular ? 'ring-2 ring-cyan-500/30' : ''} relative hover-lift`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-3 py-1 text-xs">
                      Más Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-white mb-1">{plan.price}</div>
                    <div className="text-sm text-gray-400">{plan.period}</div>
                    <p className="text-gray-400 text-sm mt-2">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-2.5 text-sm ${
                      plan.popular 
                        ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para revolucionar tu natación?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Únete a miles de nadadores que ya están optimizando su entrenamiento con IA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3">
              <ArrowRight className="w-4 h-4 mr-2" />
              Empezar Ahora
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3">
              <Play className="w-4 h-4 mr-2" />
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Waves className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  SwimAI
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                La plataforma de natación más inteligente. Detecta zonas de entrenamiento automáticamente 
                y optimiza tu rendimiento con inteligencia artificial.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Trophy className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <TrendingUp className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Activity className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Características</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Precios</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Integraciones</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Documentación</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Contacto</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Estado del Sistema</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SwimAI. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Términos</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}