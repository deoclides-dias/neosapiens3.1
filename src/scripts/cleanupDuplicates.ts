// src/scripts/cleanupDuplicates.ts - OPERAÇÃO LIMPEZA DOS 1000 REGISTROS
import { supabase } from '../lib/supabase';

interface CleanupStats {
  totalRecords: number;
  duplicateRecords: number;
  recordsDeleted: number;
  usersAffected: string[];
}

export class DatabaseCleanup {
  
  /**
   * 🧹 LIMPEZA GERAL - Remove registros duplicados
   */
  async cleanupDuplicateRecords(userId?: string): Promise<CleanupStats> {
    console.log('🧹 INICIANDO OPERAÇÃO LIMPEZA...');
    
    const stats: CleanupStats = {
      totalRecords: 0,
      duplicateRecords: 0,
      recordsDeleted: 0,
      usersAffected: []
    };

    try {
      // 1. CONTAR TOTAL DE REGISTROS
      const { count: totalCount } = await supabase
        .from('onboarding_progress')
        .select('*', { count: 'exact', head: true });

      stats.totalRecords = totalCount || 0;
      console.log(`📊 Total de registros encontrados: ${stats.totalRecords}`);

      // 2. BUSCAR TODOS OS REGISTROS (se for um usuário específico ou todos)
      let query = supabase
        .from('onboarding_progress')
        .select('id, user_id, created_at, updated_at')
        .order('user_id')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
        console.log(`🎯 Focando no usuário: ${userId}`);
      }

      const { data: allRecords, error } = await query;

      if (error) {
        console.error('❌ Erro ao buscar registros:', error);
        throw error;
      }

      console.log(`📋 Registros carregados: ${allRecords?.length || 0}`);

      // 3. AGRUPAR POR USUÁRIO E IDENTIFICAR DUPLICATAS
      const userGroups = new Map<string, any[]>();
      
      allRecords?.forEach(record => {
        const userId = record.user_id;
        if (!userGroups.has(userId)) {
          userGroups.set(userId, []);
        }
        userGroups.get(userId)!.push(record);
      });

      console.log(`👥 Usuários encontrados: ${userGroups.size}`);

      // 4. PROCESSAR CADA USUÁRIO
      for (const [currentUserId, userRecords] of userGroups) {
        if (userRecords.length > 1) {
          console.log(`🔍 Usuário ${currentUserId}: ${userRecords.length} registros`);
          
          // Ordenar por data (mais recente primeiro)
          userRecords.sort((a, b) => 
            new Date(b.updated_at || b.created_at).getTime() - 
            new Date(a.updated_at || a.created_at).getTime()
          );

          // Manter apenas o primeiro (mais recente), deletar o resto
          const toKeep = userRecords[0];
          const toDelete = userRecords.slice(1);

          console.log(`✅ Mantendo registro: ${toKeep.id} (${toKeep.updated_at})`);
          console.log(`🗑️ Deletando ${toDelete.length} registros antigos...`);

          // Deletar registros antigos
          for (const record of toDelete) {
            const { error: deleteError } = await supabase
              .from('onboarding_progress')
              .delete()
              .eq('id', record.id);

            if (deleteError) {
              console.error(`❌ Erro ao deletar registro ${record.id}:`, deleteError);
            } else {
              console.log(`🗑️ Deletado: ${record.id}`);
              stats.recordsDeleted++;
            }
          }

          stats.duplicateRecords += toDelete.length;
          stats.usersAffected.push(currentUserId);
        }
      }

      console.log('🎉 OPERAÇÃO LIMPEZA CONCLUÍDA!');
      console.log(`📊 Estatísticas:`, stats);

      return stats;

    } catch (err) {
      console.error('💥 Erro na operação limpeza:', err);
      throw err;
    }
  }

  /**
   * 🔍 APENAS ANÁLISE - Não deleta nada, só mostra o que seria feito
   */
  async analyzeOnly(userId?: string): Promise<CleanupStats> {
    console.log('🔍 ANÁLISE APENAS - Nenhum registro será deletado');
    
    const stats: CleanupStats = {
      totalRecords: 0,
      duplicateRecords: 0,
      recordsDeleted: 0,
      usersAffected: []
    };

    try {
      // Contar total
      const { count: totalCount } = await supabase
        .from('onboarding_progress')
        .select('*', { count: 'exact', head: true });

      stats.totalRecords = totalCount || 0;

      // Buscar registros
      let query = supabase
        .from('onboarding_progress')
        .select('id, user_id, created_at, updated_at')
        .order('user_id');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: allRecords } = await query;

      // Agrupar por usuário
      const userGroups = new Map<string, any[]>();
      
      allRecords?.forEach(record => {
        const userId = record.user_id;
        if (!userGroups.has(userId)) {
          userGroups.set(userId, []);
        }
        userGroups.get(userId)!.push(record);
      });

      // Contar duplicatas
      for (const [currentUserId, userRecords] of userGroups) {
        if (userRecords.length > 1) {
          console.log(`📊 Usuário ${currentUserId}: ${userRecords.length} registros (${userRecords.length - 1} duplicatas)`);
          stats.duplicateRecords += (userRecords.length - 1);
          stats.usersAffected.push(currentUserId);
        }
      }

      console.log('🔍 ANÁLISE CONCLUÍDA:');
      console.log(`📊 Total de registros: ${stats.totalRecords}`);
      console.log(`🔄 Registros duplicados: ${stats.duplicateRecords}`);
      console.log(`👥 Usuários afetados: ${stats.usersAffected.length}`);

      return stats;

    } catch (err) {
      console.error('💥 Erro na análise:', err);
      throw err;
    }
  }
}

// Hook para usar no React
export function useDatabaseCleanup() {
  const cleanup = new DatabaseCleanup();

  const runCleanup = async (userId?: string) => {
    try {
      const stats = await cleanup.cleanupDuplicateRecords(userId);
      return { success: true, stats };
    } catch (error) {
      return { success: false, error };
    }
  };

  const analyzeOnly = async (userId?: string) => {
    try {
      const stats = await cleanup.analyzeOnly(userId);
      return { success: true, stats };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    runCleanup,
    analyzeOnly
  };
}

export default DatabaseCleanup;