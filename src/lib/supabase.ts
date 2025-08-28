import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          balance: number
          total_won: number
          total_lost: number
          games_played: number
          is_admin: boolean
          created_at: string
          last_login: string
          is_active: boolean
          referral_code: string
          referred_by: string | null
          total_turnover: number
          referral_bonus_earned: number
        }
        Insert: {
          id?: string
          username: string
          email: string
          balance?: number
          total_won?: number
          total_lost?: number
          games_played?: number
          is_admin?: boolean
          created_at?: string
          last_login?: string
          is_active?: boolean
          referral_code: string
          referred_by?: string | null
          total_turnover?: number
          referral_bonus_earned?: number
        }
        Update: {
          id?: string
          username?: string
          email?: string
          balance?: number
          total_won?: number
          total_lost?: number
          games_played?: number
          is_admin?: boolean
          created_at?: string
          last_login?: string
          is_active?: boolean
          referral_code?: string
          referred_by?: string | null
          total_turnover?: number
          referral_bonus_earned?: number
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'loss'
          amount: number
          status: 'pending' | 'completed' | 'failed'
          created_at: string
          description: string
          admin_approved: boolean | null
          payment_details: any | null
          referral_bonus: boolean | null
          referral_user_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'loss'
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          description: string
          admin_approved?: boolean | null
          payment_details?: any | null
          referral_bonus?: boolean | null
          referral_user_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'loss'
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          description?: string
          admin_approved?: boolean | null
          payment_details?: any | null
          referral_bonus?: boolean | null
          referral_user_id?: string | null
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_user_id: string
          referred_user_email: string
          first_deposit_amount: number
          required_turnover: number
          current_turnover: number
          bonus_amount: number
          bonus_paid: boolean
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_user_id: string
          referred_user_email: string
          first_deposit_amount: number
          required_turnover: number
          current_turnover?: number
          bonus_amount: number
          bonus_paid?: boolean
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_user_id?: string
          referred_user_email?: string
          first_deposit_amount?: number
          required_turnover?: number
          current_turnover?: number
          bonus_amount?: number
          bonus_paid?: boolean
          created_at?: string
          completed_at?: string | null
        }
      }
      payment_settings: {
        Row: {
          id: string
          nagad_number: string
          bkash_number: string
          binance_id: string
          nagad_account_name: string
          bkash_account_name: string
          binance_account_name: string
          deposit_instructions: any
          updated_at: string
        }
        Insert: {
          id?: string
          nagad_number: string
          bkash_number: string
          binance_id: string
          nagad_account_name: string
          bkash_account_name: string
          binance_account_name: string
          deposit_instructions: any
          updated_at?: string
        }
        Update: {
          id?: string
          nagad_number?: string
          bkash_number?: string
          binance_id?: string
          nagad_account_name?: string
          bkash_account_name?: string
          binance_account_name?: string
          deposit_instructions?: any
          updated_at?: string
        }
      }
    }
  }
}