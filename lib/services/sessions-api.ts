import { createClient } from '@/utils/supabase/client'
import { Session } from '@/lib/types/entities'
import { useErrorHandler } from '@/lib/hooks/use-error-handler'

// =====================================================
// TIPOS PARA API RESPONSES
// =====================================================
interface ApiResponse<T> {
  data: T | null
  error: Error | null
  success: boolean
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// =====================================================
// SERVICIO DE SESIONES
// =====================================================
class SessionsApiService {
  private supabase = createClient()
  private { captureError } = useErrorHandler()

  // =====================================================
  // OPERACIONES CRUD
  // =====================================================
  async createSession(sessionData: Omit<Session, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<ApiResponse<Session>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await this.supabase
        .from('sessions')
        .insert({
          ...sessionData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw new Error(error.message)

      return { data, error: null, success: true }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to create session')
      this.captureError(err, {
        component: 'SessionsApiService',
        action: 'createSession',
        metadata: { sessionData }
      })
      return { data: null, error: err, success: false }
    }
  }

  async getSession(id: string): Promise<ApiResponse<Session>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await this.supabase
        .from('sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) throw new Error(error.message)

      return { data, error: null, success: true }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get session')
      this.captureError(err, {
        component: 'SessionsApiService',
        action: 'getSession',
        metadata: { id }
      })
      return { data: null, error: err, success: false }
    }
  }

  async getSessions(filters?: {
    date?: string
    startDate?: string
    endDate?: string
    training_phase_id?: string
    competition_id?: string
    stroke_type?: string
    session_type?: string
  }): Promise<ApiResponse<Session[]>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      let query = this.supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      // Aplicar filtros
      if (filters?.date) {
        query = query.eq('date', filters.date)
      }
      if (filters?.startDate) {
        query = query.gte('date', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate)
      }
      if (filters?.training_phase_id) {
        query = query.eq('training_phase_id', filters.training_phase_id)
      }
      if (filters?.competition_id) {
        query = query.eq('competition_id', filters.competition_id)
      }
      if (filters?.stroke_type) {
        query = query.eq('stroke_type', filters.stroke_type)
      }
      if (filters?.session_type) {
        query = query.eq('session_type', filters.session_type)
      }

      const { data, error } = await query

      if (error) throw new Error(error.message)

      return { data: data || [], error: null, success: true }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get sessions')
      this.captureError(err, {
        component: 'SessionsApiService',
        action: 'getSessions',
        metadata: { filters }
      })
      return { data: null, error: err, success: false }
    }
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<ApiResponse<Session>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await this.supabase
        .from('sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw new Error(error.message)

      return { data, error: null, success: true }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to update session')
      this.captureError(err, {
        component: 'SessionsApiService',
        action: 'updateSession',
        metadata: { id, updates }
      })
      return { data: null, error: err, success: false }
    }
  }

  async deleteSession(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await this.supabase
        .from('sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw new Error(error.message)

      return { data: true, error: null, success: true }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to delete session')
      this.captureError(err, {
        component: 'SessionsApiService',
        action: 'deleteSession',
        metadata: { id }
      })
      return { data: null, error: err, success: false }
    }
  }

  // =====================================================
  // OPERACIONES DE PAGINACIÓN
  // =====================================================
  async getSessionsPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: {
      startDate?: string
      endDate?: string
      training_phase_id?: string
      competition_id?: string
    }
  ): Promise<ApiResponse<PaginatedResponse<Session>>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const offset = (page - 1) * limit

      let query = this.supabase
        .from('sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .range(offset, offset + limit - 1)

      // Aplicar filtros
      if (filters?.startDate) {
        query = query.gte('date', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate)
      }
      if (filters?.training_phase_id) {
        query = query.eq('training_phase_id', filters.training_phase_id)
      }
      if (filters?.competition_id) {
        query = query.eq('competition_id', filters.competition_id)
      }

      const { data, error, count } = await query

      if (error) throw new Error(error.message)

      const total = count || 0
      const hasMore = offset + limit < total

      return {
        data: {
          data: data || [],
          total,
          page,
          limit,
          hasMore
        },
        error: null,
        success: true
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get paginated sessions')
      this.captureError(err, {
        component: 'SessionsApiService',
        action: 'getSessionsPaginated',
        metadata: { page, limit, filters }
      })
      return { data: null, error: err, success: false }
    }
  }

  // =====================================================
  // OPERACIONES DE BÚSQUEDA
  // =====================================================
  async searchSessions(query: string): Promise<ApiResponse<Session[]>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await this.supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .or(`name.ilike.%${query}%,main_set.ilike.%${query}%,notes.ilike.%${query}%`)
        .order('date', { ascending: false })

      if (error) throw new Error(error.message)

      return { data: data || [], error: null, success: true }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to search sessions')
      this.captureError(err, {
        component: 'SessionsApiService',
        action: 'searchSessions',
        metadata: { query }
      })
      return { data: null, error: err, success: false }
    }
  }

  // =====================================================
  // OPERACIONES DE ESTADÍSTICAS
  // =====================================================
  async getSessionsStats(filters?: {
    startDate?: string
    endDate?: string
    training_phase_id?: string
  }): Promise<ApiResponse<{
    totalSessions: number
    totalDistance: number
    totalDuration: number
    averageRPE: number
    averageDistance: number
    averageDuration: number
    strokeDistribution: Record<string, number>
    sessionTypeDistribution: Record<string, number>
  }>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      let query = this.supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)

      // Aplicar filtros
      if (filters?.startDate) {
        query = query.gte('date', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate)
      }
      if (filters?.training_phase_id) {
        query = query.eq('training_phase_id', filters.training_phase_id)
      }

      const { data, error } = await query

      if (error) throw new Error(error.message)

      const sessions = data || []
      const totalSessions = sessions.length

      if (totalSessions === 0) {
        return {
          data: {
            totalSessions: 0,
            totalDistance: 0,
            totalDuration: 0,
            averageRPE: 0,
            averageDistance: 0,
            averageDuration: 0,
            strokeDistribution: {},
            sessionTypeDistribution: {}
          },
          error: null,
          success: true
        }
      }

      const totalDistance = sessions.reduce((sum, s) => sum + s.distance_meters, 0)
      const totalDuration = sessions.reduce((sum, s) => sum + s.duration_minutes, 0)
      const averageRPE = sessions.reduce((sum, s) => sum + s.rpe, 0) / totalSessions

      const strokeDistribution = sessions.reduce((acc, s) => {
        acc[s.stroke_type] = (acc[s.stroke_type] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const sessionTypeDistribution = sessions.reduce((acc, s) => {
        acc[s.session_type] = (acc[s.session_type] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        data: {
          totalSessions,
          totalDistance,
          totalDuration,
          averageRPE,
          averageDistance: totalDistance / totalSessions,
          averageDuration: totalDuration / totalSessions,
          strokeDistribution,
          sessionTypeDistribution
        },
        error: null,
        success: true
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get sessions stats')
      this.captureError(err, {
        component: 'SessionsApiService',
        action: 'getSessionsStats',
        metadata: { filters }
      })
      return { data: null, error: err, success: false }
    }
  }
}

// =====================================================
// INSTANCIA SINGLETON
// =====================================================
export const sessionsApiService = new SessionsApiService()

// =====================================================
// HOOKS PARA USAR EN COMPONENTES
// =====================================================
export function useSessionsApi() {
  return {
    createSession: sessionsApiService.createSession.bind(sessionsApiService),
    getSession: sessionsApiService.getSession.bind(sessionsApiService),
    getSessions: sessionsApiService.getSessions.bind(sessionsApiService),
    updateSession: sessionsApiService.updateSession.bind(sessionsApiService),
    deleteSession: sessionsApiService.deleteSession.bind(sessionsApiService),
    getSessionsPaginated: sessionsApiService.getSessionsPaginated.bind(sessionsApiService),
    searchSessions: sessionsApiService.searchSessions.bind(sessionsApiService),
    getSessionsStats: sessionsApiService.getSessionsStats.bind(sessionsApiService)
  }
}
