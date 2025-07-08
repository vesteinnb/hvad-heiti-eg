// types/database.ts
export interface Database {
    public: {
      Tables: {
        parents: {
          Row: {
            id: string
            username: string
            first_name: string | null
            last_name: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id: string // Must match auth.users.id
            username: string
            first_name?: string | null
            last_name?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            username?: string
            first_name?: string | null
            last_name?: string | null
            created_at?: string
            updated_at?: string
          }
        }
        games: {
          Row: {
            id: string
            parent_id: string
            game_code: string
            title: string
            description: string | null
            baby_first_name: string
            baby_middle_name: string | null
            baby_last_name: string | null
            start_date: string
            end_date: string
            created_at: string
            updated_at: string
            status: 'draft' | 'active' | 'completed' | 'expired'
            max_clues_per_player: number
            allow_multiple_guesses: boolean
            show_other_players_guesses: boolean
          }
          Insert: {
            id?: string
            parent_id: string
            game_code?: string
            title: string
            description?: string | null
            baby_first_name: string
            baby_middle_name?: string | null
            baby_last_name?: string | null
            start_date: string
            end_date: string
            created_at?: string
            updated_at?: string
            status?: 'draft' | 'active' | 'completed' | 'expired'
            max_clues_per_player?: number
            allow_multiple_guesses?: boolean
            show_other_players_guesses?: boolean
          }
          Update: {
            id?: string
            parent_id?: string
            game_code?: string
            title?: string
            description?: string | null
            baby_first_name?: string
            baby_middle_name?: string | null
            baby_last_name?: string | null
            start_date?: string
            end_date?: string
            created_at?: string
            updated_at?: string
            status?: 'draft' | 'active' | 'completed' | 'expired'
            max_clues_per_player?: number
            allow_multiple_guesses?: boolean
            show_other_players_guesses?: boolean
          }
        }
        game_clues: {
          Row: {
            id: string
            game_id: string
            clue_text: string
            clue_order: number
            created_at: string
          }
          Insert: {
            id?: string
            game_id: string
            clue_text: string
            clue_order: number
            created_at?: string
          }
          Update: {
            id?: string
            game_id?: string
            clue_text?: string
            clue_order?: number
            created_at?: string
          }
        }
        players: {
          Row: {
            id: string
            game_id: string
            name: string
            email: string | null
            ip_address: string | null
            user_agent: string | null
            joined_at: string
            last_active: string
            clues_revealed: number
            has_won: boolean
            won_at: string | null
            final_time_seconds: number | null
          }
          Insert: {
            id?: string
            game_id: string
            name: string
            email?: string | null
            ip_address?: string | null
            user_agent?: string | null
            joined_at?: string
            last_active?: string
            clues_revealed?: number
            has_won?: boolean
            won_at?: string | null
            final_time_seconds?: number | null
          }
          Update: {
            id?: string
            game_id?: string
            name?: string
            email?: string | null
            ip_address?: string | null
            user_agent?: string | null
            joined_at?: string
            last_active?: string
            clues_revealed?: number
            has_won?: boolean
            won_at?: string | null
            final_time_seconds?: number | null
          }
        }
        player_guesses: {
          Row: {
            id: string
            player_id: string
            game_id: string
            guess_text: string
            status: 'correct' | 'incorrect'
            guessed_at: string
            time_elapsed_seconds: number
            clues_used_when_guessed: number
          }
          Insert: {
            id?: string
            player_id: string
            game_id: string
            guess_text: string
            status: 'correct' | 'incorrect'
            guessed_at?: string
            time_elapsed_seconds: number
            clues_used_when_guessed?: number
          }
          Update: {
            id?: string
            player_id?: string
            game_id?: string
            guess_text?: string
            status?: 'correct' | 'incorrect'
            guessed_at?: string
            time_elapsed_seconds?: number
            clues_used_when_guessed?: number
          }
        }
      }
      Views: {
        game_leaderboard: {
          Row: {
            game_id: string
            game_title: string
            game_code: string
            player_id: string | null
            player_name: string | null
            has_won: boolean | null
            won_at: string | null
            final_time_seconds: number | null
            clues_revealed: number | null
            total_guesses: number | null
            incorrect_guesses: number | null
            rank: number | null
          }
        }
        parent_games_summary: {
          Row: {
            id: string
            title: string
            game_code: string
            status: 'draft' | 'active' | 'completed' | 'expired'
            start_date: string
            end_date: string
            baby_first_name: string
            baby_middle_name: string | null
            baby_last_name: string | null
            total_players: number | null
            winners_count: number | null
            total_guesses: number | null
            created_at: string
          }
        }
      }
      Functions: {
        generate_game_code: {
          Args: Record<PropertyKey, never>
          Returns: string
        }
        is_game_active: {
          Args: { game_uuid: string }
          Returns: boolean
        }
        update_game_statuses: {
          Args: Record<PropertyKey, never>
          Returns: void
        }
      }
    }
  }
  
  // Helper types for easier use in components
  export type Game = Database['public']['Tables']['games']['Row']
  export type GameWithClues = Game & {
    game_clues: Database['public']['Tables']['game_clues']['Row'][]
  }
  export type Player = Database['public']['Tables']['players']['Row']
  export type PlayerGuess = Database['public']['Tables']['player_guesses']['Row']
  export type Parent = Database['public']['Tables']['parents']['Row']
  export type GameClue = Database['public']['Tables']['game_clues']['Row']
  export type LeaderboardEntry = Database['public']['Views']['game_leaderboard']['Row']
  export type GameSummary = Database['public']['Views']['parent_games_summary']['Row']