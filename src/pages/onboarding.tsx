// src/pages/onboarding.tsx
// ============================================================================
// REDIRECT PERMANENTE → ANALYSIS HUB
// ============================================================================
// O fluxo linear de onboarding foi descontinuado.
// Todo o sistema agora funciona via /analysis (hub modular).
// Este arquivo existe apenas para redirecionar links antigos.
// ============================================================================

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const OnboardingRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/analysis');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecionando para Central de Análises...</p>
        <p className="text-slate-400 text-sm mt-2">Aguarde um momento</p>
      </div>
    </div>
  );
};

export default OnboardingRedirect;
