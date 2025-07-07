import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDatabaseCleanup } from '../scripts/cleanupDuplicates';

const TestCleanup: React.FC = () => {
  const { user } = useAuth();
  const { runCleanup, analyzeOnly } = useDatabaseCleanup();
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      const result = await analyzeOnly(user?.id);
      setResults({ type: 'analysis', ...result });
    } catch (error) {
      setResults({ type: 'error', error });
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      const result = await runCleanup(user?.id);
      setResults({ type: 'cleanup', ...result });
    } catch (error) {
      setResults({ type: 'error', error });
    } finally {
      setLoading(false);
    }
  };

  const handleCleanupAll = async () => {
    if (!confirm('🚨 ATENÇÃO! Isso vai limpar TODOS os usuários. Confirma?')) return;
    
    setLoading(true);
    setResults(null);
    
    try {
      const result = await runCleanup(); // Sem userId = todos os usuários
      setResults({ type: 'cleanup_all', ...result });
    } catch (error) {
      setResults({ type: 'error', error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧹 OPERAÇÃO LIMPEZA DOS 1000 REGISTROS
          </h1>
          <p className="text-orange-200 text-lg">
            Ferramenta para eliminar registros duplicados no Supabase
          </p>
        </div>

        {/* Status do Usuário */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8">
          <h3 className="text-white font-semibold mb-2">👤 Status do Usuário</h3>
          {user ? (
            <div>
              <p className="text-green-300">✅ Logado: {user.email}</p>
              <p className="text-sm text-orange-200">ID: {user.id}</p>
            </div>
          ) : (
            <p className="text-red-300">❌ Não logado</p>
          )}
        </div>

        {/* Controles */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8">
          <h3 className="text-white font-semibold mb-4">🎮 Controles de Limpeza</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleAnalyze}
              disabled={loading || !user}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '🔄 Analisando...' : '🔍 Analisar Apenas'}
            </button>
            
            <button
              onClick={handleCleanup}
              disabled={loading || !user}
              className="bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '🔄 Limpando...' : '🧹 Limpar Meu Usuário'}
            </button>
            
            <button
              onClick={handleCleanupAll}
              disabled={loading}
              className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '🔄 Limpando...' : '💥 Limpar TODOS'}
            </button>
          </div>

          <div className="mt-4 text-sm text-orange-200">
            <p><strong>🔍 Analisar:</strong> Só mostra quantos registros duplicados existem</p>
            <p><strong>🧹 Limpar Meu Usuário:</strong> Remove duplicatas apenas do seu usuário</p>
            <p><strong>💥 Limpar TODOS:</strong> Remove duplicatas de todos os usuários (cuidado!)</p>
          </div>
        </div>

        {/* Resultados */}
        {results && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">📊 Resultados</h3>
            
            {results.type === 'error' ? (
              <div className="bg-red-900/30 border border-red-400 rounded-lg p-4">
                <h4 className="text-red-300 font-semibold">❌ Erro</h4>
                <p className="text-red-200">{results.error?.message || 'Erro desconhecido'}</p>
              </div>
            ) : (
              <div className="bg-green-900/30 border border-green-400 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-3">
                  {results.type === 'analysis' ? '🔍 Análise Concluída' : 
                   results.type === 'cleanup' ? '🧹 Limpeza do Usuário Concluída' :
                   '💥 Limpeza Geral Concluída'}
                </h4>
                
                {results.stats && (
                  <div className="space-y-2 text-green-200">
                    <p><strong>📊 Total de registros:</strong> {results.stats.totalRecords}</p>
                    <p><strong>🔄 Registros duplicados:</strong> {results.stats.duplicateRecords}</p>
                    <p><strong>🗑️ Registros deletados:</strong> {results.stats.recordsDeleted}</p>
                    <p><strong>👥 Usuários afetados:</strong> {results.stats.usersAffected.length}</p>
                    
                    {results.stats.usersAffected.length > 0 && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-green-300">Ver usuários afetados</summary>
                        <div className="mt-2 max-h-32 overflow-y-auto">
                          {results.stats.usersAffected.map((userId: string, index: number) => (
                            <p key={index} className="text-sm text-green-100">• {userId}</p>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Aviso */}
        <div className="text-center mt-8">
          <p className="text-orange-300 text-sm">
            ⚠️ Use com cuidado! Sempre faça backup antes de operações de limpeza
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestCleanup;