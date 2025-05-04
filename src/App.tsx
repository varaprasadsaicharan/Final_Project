import React from 'react';
import { Brain, Heart, Activity, UserCircle2, Sparkles, Shield, Clock, BarChart as ChartBar } from 'lucide-react';
import DiagnosisPage from './DiagnosisPage';

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-white p-8 rounded-lg transform transition duration-500 hover:scale-105">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

interface DiagnosticCardProps {
  title: string;
  imageUrl: string;
  description: string;
  accuracy: string;
}

function DiagnosticCard({ title, imageUrl, description, accuracy }: DiagnosticCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 z-10"></div>
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-[400px] object-cover transform transition duration-700 group-hover:scale-110"
      />
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform translate-y-6 transition duration-500 group-hover:translate-y-0">
        <div className="flex items-center gap-2 mb-3">
          <ChartBar className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-medium">{accuracy} Accuracy</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300 leading-relaxed opacity-0 transform translate-y-10 transition duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          {description}
        </p>
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = React.useState('home');

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning models trained on extensive medical datasets for accurate disease prediction and risk assessment."
    },
    {
      icon: Shield,
      title: "Clinically Validated",
      description: "Our diagnostic algorithms are validated against established medical guidelines and clinical studies."
    },
    {
      icon: Clock,
      title: "Real-time Results",
      description: "Get instant analysis and comprehensive health risk assessments within seconds."
    }
  ];

  const diagnostics = [
    {
      title: "Cardiovascular Health Analysis",
      description: "Advanced AI-driven heart disease risk assessment using multiple biomarkers and clinical parameters.",
      imageUrl: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=1000",
      accuracy: "97%"
    },
    {
      title: "Diabetes Risk Prediction",
      description: "Comprehensive diabetes screening using machine learning analysis of blood glucose patterns and risk factors.",
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000",
      accuracy: "95%"
    },
    {
      title: "Liver Health Assessment",
      description: "State-of-the-art liver disease detection using multiple hepatic markers and patient history analysis.",
      imageUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=1000",
      accuracy: "94%"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white py-4 px-6 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI-Driven Diagnostic System
          </span>
        </div>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`text-gray-600 hover:text-blue-600 transition-colors ${currentPage === 'home' ? 'text-blue-600 font-medium' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentPage('services')}
            className={`text-gray-600 hover:text-blue-600 transition-colors ${currentPage === 'services' ? 'text-blue-600 font-medium' : ''}`}
          >
            Services
          </button>
          <button 
            onClick={() => setCurrentPage('diagnosis')}
            className={`text-gray-600 hover:text-blue-600 transition-colors ${currentPage === 'diagnosis' ? 'text-blue-600 font-medium' : ''}`}
          >
            Diagnosis
          </button>
          <button 
            onClick={() => setCurrentPage('faq')}
            className={`text-gray-600 hover:text-blue-600 transition-colors ${currentPage === 'faq' ? 'text-blue-600 font-medium' : ''}`}
          >
            FAQ
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity">
            <UserCircle2 className="w-5 h-5" />
            Login
          </button>
        </div>
      </nav>
      
      {currentPage === 'diagnosis' ? (
        <DiagnosisPage />
      ) : (
        <>
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-32 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000')] opacity-10 bg-cover bg-center"></div>
            <div className="container mx-auto max-w-4xl text-center relative z-10">
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Next-Generation AI Diagnostics
              </h1>
              <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Harness the power of advanced machine learning for early disease detection 
                and precise health risk assessment. Supporting healthcare professionals 
                with data-driven insights.
              </p>
              
              <button 
                onClick={() => setCurrentPage('diagnosis')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors transform hover:scale-105 duration-300"
              >
                Start Diagnosis
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-24 px-6 bg-gray-50">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Powered by Advanced AI Technology
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our system combines cutting-edge machine learning with established medical 
                  protocols to deliver accurate and reliable diagnostic assessments.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature) => (
                  <Feature
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Diagnostic Capabilities Section */}
          <div className="py-24 px-6 bg-white">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Comprehensive Diagnostic Suite
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our AI models are trained on extensive medical datasets and validated 
                  against established clinical guidelines for maximum accuracy.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {diagnostics.map((diagnostic) => (
                  <DiagnosticCard
                    key={diagnostic.title}
                    title={diagnostic.title}
                    imageUrl={diagnostic.imageUrl}
                    description={diagnostic.description}
                    accuracy={diagnostic.accuracy}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-24 px-6 bg-gradient-to-br from-gray-900 to-blue-900">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Experience the Future of Diagnostics?
              </h2>
              <p className="text-gray-300 mb-12 text-lg">
                Join healthcare professionals worldwide who trust our AI-powered 
                diagnostic system for accurate health assessments.
              </p>
              <button 
                onClick={() => setCurrentPage('diagnosis')}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors transform hover:scale-105 duration-300"
              >
                Start Your First Analysis
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;