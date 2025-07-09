// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database, Game, GameWithClues, Player, PlayerGuess, Parent } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Game API functions
export class GameAPI {
  // Create a new game
  static async createGame(gameData: {
    parent_id: string
    title: string
    description?: string
    baby_first_name: string
    baby_middle_name?: string
    baby_last_name?: string
    start_date: string
    end_date: string
    clues: string[]
    max_clues_per_player?: number
    allow_multiple_guesses?: boolean
    show_other_players_guesses?: boolean
  }): Promise<Game> {
    // Insert game
    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({
        parent_id: gameData.parent_id,
        title: gameData.title,
        description: gameData.description || null,
        baby_first_name: gameData.baby_first_name,
        baby_middle_name: gameData.baby_middle_name || null,
        baby_last_name: gameData.baby_last_name || null,
        start_date: gameData.start_date,
        end_date: gameData.end_date,
        status: 'draft',
        max_clues_per_player: gameData.max_clues_per_player || 5,
        allow_multiple_guesses: gameData.allow_multiple_guesses ?? true,
        show_other_players_guesses: gameData.show_other_players_guesses ?? false
      })
      .select()
      .single()

    if (gameError) throw gameError

    // Insert clues
    const clueInserts = gameData.clues
      .filter(clue => clue.trim().length > 0)
      .map((clue, index) => ({
        game_id: game.id,
        clue_text: clue.trim(),
        clue_order: index + 1
      }))

    if (clueInserts.length > 0) {
      const { error: cluesError } = await supabase
        .from('game_clues')
        .insert(clueInserts)

      if (cluesError) throw cluesError
    }

    return game
  }

  // Get game by code with clues
  static async getGameByCode(gameCode: string): Promise<GameWithClues> {
    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        game_clues (
          id,
          clue_text,
          clue_order,
          created_at
        )
      `)
      .eq('game_code', gameCode.toUpperCase())
      .single()

    if (error) throw error

    // Sort clues by order
    const sortedData = {
      ...data,
      game_clues: (data.game_clues || []).sort(
        (a: { clue_order: number }, b: { clue_order: number }) => a.clue_order - b.clue_order
      )
    }

    return sortedData as GameWithClues
  }

  // Get game by ID with clues
  static async getGameById(gameId: string): Promise<GameWithClues> {
    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        game_clues (
          id,
          clue_text,
          clue_order,
          created_at
        )
      `)
      .eq('id', gameId)
      .single()

    if (error) throw error

    // Sort clues by order
    const sortedData = {
      ...data,
      game_clues: (data.game_clues || []).sort(
        (a: { clue_order: number }, b: { clue_order: number }) => a.clue_order - b.clue_order
      )
    }

    return sortedData as GameWithClues
  }

  // Join game as player
  static async joinGame(gameId: string, playerName: string, playerEmail?: string): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .insert({
        game_id: gameId,
        name: playerName.trim(),
        email: playerEmail?.trim() || null,
        user_agent: navigator.userAgent,
        last_active: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get player by game and name
  static async getPlayer(gameId: string, playerName: string): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .select()
      .eq('game_id', gameId)
      .eq('name', playerName.trim())
      .single()

    if (error) throw error
    return data
  }

  // Update player's last active time
  static async updatePlayerActivity(playerId: string): Promise<void> {
    const { error } = await supabase
      .from('players')
      .update({ last_active: new Date().toISOString() })
      .eq('id', playerId)

    if (error) throw error
  }

  // Reveal clue for player
  static async revealClue(playerId: string): Promise<Player> {
    // 1. Get current value
    const { data: player } = await supabase
      .from('players')
      .select('clues_revealed')
      .eq('id', playerId)
      .single();

    const newCluesRevealed = (player?.clues_revealed ?? 0) + 1;

    // 2. Update with incremented value
    const { data, error } = await supabase
      .from('players')
      .update({
        clues_revealed: newCluesRevealed,
        last_active: new Date().toISOString()
      })
      .eq('id', playerId)
      .select()
      .single();

    if (error) throw error
    return data
  }

  // Submit guess
  static async submitGuess(
    playerId: string,
    gameId: string,
    guessText: string,
    isCorrect: boolean,
    timeElapsedSeconds: number,
    cluesUsed: number
  ): Promise<PlayerGuess> {
    // Insert guess
    const { data: guess, error: guessError } = await supabase
      .from('player_guesses')
      .insert({
        player_id: playerId,
        game_id: gameId,
        guess_text: guessText.trim(),
        status: isCorrect ? 'correct' : 'incorrect',
        time_elapsed_seconds: timeElapsedSeconds,
        clues_used_when_guessed: cluesUsed
      })
      .select()
      .single()

    if (guessError) throw guessError

    // If correct, update player
    if (isCorrect) {
      const { error: playerError } = await supabase
        .from('players')
        .update({
          has_won: true,
          won_at: new Date().toISOString(),
          final_time_seconds: timeElapsedSeconds,
          last_active: new Date().toISOString()
        })
        .eq('id', playerId)

      if (playerError) throw playerError
    } else {
      // Update last active even for incorrect guesses
      await this.updatePlayerActivity(playerId)
    }

    return guess
  }

  // Get player's previous guesses
  static async getPlayerGuesses(playerId: string): Promise<PlayerGuess[]> {
    const { data, error } = await supabase
      .from('player_guesses')
      .select()
      .eq('player_id', playerId)
      .order('guessed_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get game leaderboard
  static async getGameLeaderboard(gameId: string) {
    const { data, error } = await supabase
      .from('game_leaderboard')
      .select()
      .eq('game_id', gameId)
      .order('rank', { ascending: true })

    if (error) throw error
    return data || []
  }

  // Get parent's games
  static async getParentGames(parentId: string) {
    const { data, error } = await supabase
      .from('parent_games_summary')
      .select()
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Update game status (e.g., from draft to active)
  static async updateGameStatus(gameId: string, status: Game['status']): Promise<Game> {
    const { data, error } = await supabase
      .from('games')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', gameId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Check if a game is currently active
  static isGameActive(game: Game): boolean {
    const now = new Date()
    const startDate = new Date(game.start_date)
    const endDate = new Date(game.end_date)
    
    return game.status === 'active' && now >= startDate && now <= endDate
  }

  // Real-time subscriptions
  static subscribeToGame(gameId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`game_${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'player_guesses',
          filter: `game_id=eq.${gameId}`
        },
        callback
      )
      .subscribe()
  }

  // Subscribe to player updates
  static subscribeToPlayer(playerId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`player_${playerId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'players',
          filter: `id=eq.${playerId}`
        },
        callback
      )
      .subscribe()
  }
}

// Authentication API
export class AuthAPI {
  // Sign up with email and password, create parent profile
  static async signUp(
    email: string, 
    password: string, 
    username: string, 
    firstName?: string, 
    lastName?: string
  ) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          first_name: firstName,
          last_name: lastName
        }
      }
    })
    if (error) throw error;
    return data;
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  // Sign in with Google
  static async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Get current authenticated user
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  // Get current parent profile
  static async getCurrentParent(): Promise<Parent | null> {
    const user = await this.getCurrentUser()
    if (!user) return null

    // Try to fetch parent profile
    const { data, error } = await supabase
      .from('parents')
      .select()
      .eq('id', user.id)
      .single()

    if (data) return data;
    
    // If not found, create it now
    const username = user.user_metadata?.full_name || 
                    user.user_metadata?.username || 
                    user.email?.split('@')[0] || 
                    'User'
    
    const { error: profileError, data: newProfile } = await supabase
      .from('parents')
      .insert({
        id: user.id,
        username: username,
        first_name: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || null,
        last_name: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null
      })
      .select()
      .single();
      
    if (profileError) {
      console.error('Failed to create parent profile:', profileError)
      return null;
    }
    return newProfile;
  }

  // Update parent profile
  static async updateParent(updates: Partial<Omit<Parent, 'id' | 'created_at' | 'updated_at'>>) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('parents')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Listen for auth state changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Utility functions
export const formatTimeDisplay = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const formatTimeElapsed = (startTime: number): string => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000)
  return formatTimeDisplay(elapsed)
}

export const isValidGameCode = (code: string): boolean => {
  return /^[A-Z0-9]{4,10}$/.test(code.toUpperCase())
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Error handling helper
export const getErrorMessage = (error: any): string => {
  if (error?.message) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}