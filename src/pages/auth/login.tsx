// src/pages/auth/login.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from '../../components/auth/AuthForm';

const LoginPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Redirect se já estiver logado
  useEffect(() => {
    if (user) {
      router.replace('/analysis'); // ✅ CORRIGIDO: /analysis em vez de /onboarding
    }
  }, [user, router]);

  const handleLoginSuccess = () => {
    setLoading(true);
    // Redirect será tratado pelo useEffect acima
    router.replace('/analysis'); // ✅ CORRIGIDO: /analysis em vez de /onboarding
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo de volta! 🚀
          </h1>
          <p className="text-slate-300">
            Continue sua jornada de autoconhecimento
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <AuthForm 
            mode="login" 
            onSuccess={handleLoginSuccess}
          />
          
          <div className="mt-6 text-center">
            <p className="text-slate-300">
              Não tem conta?{' '}
              <Link 
                href="/auth/signup" 
                className="text-purple-300 hover:text-purple-200 transition-colors font-semibold"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            ← Voltar à página inicial
          </Link>
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-800">Redirecionando...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
