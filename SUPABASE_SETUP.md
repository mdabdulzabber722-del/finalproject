# 🗄️ Supabase Database Setup Guide

## 🎯 **Why Supabase?**

Your Aviator Casino now uses **Supabase** for real database persistence, which means:
- ✅ **All user registrations** are saved permanently
- ✅ **Admin panel** shows all real users and transactions
- ✅ **Data persists** across browser sessions and devices
- ✅ **Real-time updates** across all users
- ✅ **Production-ready** scalable database

## 🚀 **Step-by-Step Setup**

### **Step 1: Create Supabase Account**
1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up** with GitHub or email
4. **Verify your email** if required

### **Step 2: Create New Project**
1. **Click "New Project"**
2. **Choose your organization** (or create one)
3. **Fill in project details**:
   - Name: `aviator-casino`
   - Database Password: `Create a strong password`
   - Region: `Choose closest to your users`
4. **Click "Create new project"**
5. **Wait 2-3 minutes** for setup to complete

### **Step 3: Set Up Database Schema**
1. **Go to SQL Editor** (left sidebar)
2. **Click "New query"**
3. **Copy the entire content** from `supabase/migrations/001_initial_schema.sql`
4. **Paste it** in the SQL editor
5. **Click "Run"** to execute
6. **Verify success** - you should see "Success. No rows returned"

### **Step 4: Get Your Credentials**
1. **Go to Settings** → **API** (left sidebar)
2. **Copy these values**:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon public key**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`

### **Step 5: Configure Environment Variables**
1. **Create `.env` file** in your project root
2. **Add your credentials**:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   ```
3. **Replace** with your actual values from Step 4

### **Step 6: Test the Connection**
1. **Run your project**: `npm run dev`
2. **Try registering** a new user
3. **Check Supabase dashboard** → **Table Editor** → **users**
4. **You should see** the new user in the database!

## ✅ **Verification Checklist**

After setup, verify these work:
- [ ] ✅ New user registration saves to database
- [ ] ✅ Admin panel shows all registered users
- [ ] ✅ Transactions appear in admin panel
- [ ] ✅ Login works with registered users
- [ ] ✅ Data persists after browser refresh

## 🔧 **Default Admin Account**

The migration creates a default admin account:
- **Email**: `bdtraderadmin@aviator.com`
- **Password**: `bdtraderpassword125`
- **Access**: Full admin panel with all permissions

## 🚨 **Important Notes**

### **Security:**
- ✅ **Row Level Security (RLS)** is enabled on all tables
- ✅ **Users can only see their own data**
- ✅ **Admins can see all data**
- ✅ **Proper authentication** required for all operations

### **Data Structure:**
- **Users**: Account info, balances, game stats
- **Transactions**: All deposits, withdrawals, bets, wins, losses
- **Referrals**: Referral system tracking
- **Payment Settings**: Admin payment configuration

## 🎯 **What Changes After Setup**

### **Before (Local Storage):**
- ❌ Data lost on browser clear
- ❌ Each user sees different data
- ❌ No real persistence

### **After (Supabase):**
- ✅ **Permanent data storage**
- ✅ **All users share same database**
- ✅ **Admin sees all real users**
- ✅ **Production-ready architecture**

## 🚀 **Deploy with Database**

After Supabase setup:
1. **Commit your changes**: `git add . && git commit -m "Add Supabase integration"`
2. **Push to GitHub**: `git push`
3. **Deploy to Vercel/Railway** with environment variables
4. **Add environment variables** in your hosting platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 📞 **Need Help?**

If you encounter issues:
1. **Check Supabase logs** in the dashboard
2. **Verify environment variables** are set correctly
3. **Ensure migration ran successfully**
4. **Check browser console** for error messages

---

**🎮 Your Aviator Casino now has a real database! All user registrations and transactions will be properly stored and visible in the admin panel.**