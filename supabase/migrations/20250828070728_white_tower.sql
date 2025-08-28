/*
  # Initial Schema for Aviator Casino

  1. New Tables
    - `users` - User accounts with authentication and game stats
    - `transactions` - All financial transactions (deposits, withdrawals, bets, wins, losses)
    - `referrals` - Referral system tracking
    - `payment_settings` - Admin payment configuration

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Admin-only access for sensitive operations
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  balance decimal(10,2) DEFAULT 100.00,
  total_won decimal(10,2) DEFAULT 0.00,
  total_lost decimal(10,2) DEFAULT 0.00,
  games_played integer DEFAULT 0,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  referral_code text UNIQUE NOT NULL,
  referred_by uuid REFERENCES users(id),
  total_turnover decimal(10,2) DEFAULT 0.00,
  referral_bonus_earned decimal(10,2) DEFAULT 0.00
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'bet', 'win', 'loss')),
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  description text NOT NULL,
  admin_approved boolean DEFAULT null,
  payment_details jsonb DEFAULT null,
  referral_bonus boolean DEFAULT false,
  referral_user_id uuid REFERENCES users(id)
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  referred_user_email text NOT NULL,
  first_deposit_amount decimal(10,2) NOT NULL,
  required_turnover decimal(10,2) NOT NULL,
  current_turnover decimal(10,2) DEFAULT 0.00,
  bonus_amount decimal(10,2) NOT NULL,
  bonus_paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz DEFAULT null
);

-- Create payment_settings table
CREATE TABLE IF NOT EXISTS payment_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nagad_number text NOT NULL DEFAULT '01712345678',
  bkash_number text NOT NULL DEFAULT '01812345678',
  binance_id text NOT NULL DEFAULT 'aviator_casino_2024',
  nagad_account_name text NOT NULL DEFAULT 'AviatorCasino',
  bkash_account_name text NOT NULL DEFAULT 'AviatorCasino',
  binance_account_name text NOT NULL DEFAULT 'AviatorCasino',
  deposit_instructions jsonb NOT NULL DEFAULT '{"nagad": "Send money to this Nagad number:", "bkash": "Send money to this bKash number:", "binance": "Send payment to this Binance Pay ID:"}',
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can create user account" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Transactions policies
CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions" ON transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all transactions" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all transactions" ON transactions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Referrals policies
CREATE POLICY "Users can read own referrals" ON referrals
  FOR SELECT USING (referrer_id = auth.uid() OR referred_user_id = auth.uid());

CREATE POLICY "Users can create referrals" ON referrals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read all referrals" ON referrals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "System can update referrals" ON referrals
  FOR UPDATE USING (true);

-- Payment settings policies
CREATE POLICY "Anyone can read payment settings" ON payment_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update payment settings" ON payment_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Insert default admin user
INSERT INTO users (
  id,
  username,
  email,
  balance,
  is_admin,
  referral_code
) VALUES (
  gen_random_uuid(),
  'admin',
  'bdtraderadmin@aviator.com',
  10000.00,
  true,
  'ADMIN001'
) ON CONFLICT (email) DO NOTHING;

-- Insert default player
INSERT INTO users (
  id,
  username,
  email,
  balance,
  referral_code
) VALUES (
  gen_random_uuid(),
  'player1',
  'player1@example.com',
  500.00,
  'PLAYER001'
) ON CONFLICT (email) DO NOTHING;

-- Insert default payment settings
INSERT INTO payment_settings (
  nagad_number,
  bkash_number,
  binance_id,
  nagad_account_name,
  bkash_account_name,
  binance_account_name,
  deposit_instructions
) VALUES (
  '01712345678',
  '01812345678',
  'aviator_casino_2024',
  'AviatorCasino',
  'AviatorCasino',
  'AviatorCasino',
  '{"nagad": "Send money to this Nagad number:", "bkash": "Send money to this bKash number:", "binance": "Send payment to this Binance Pay ID:"}'
) ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);