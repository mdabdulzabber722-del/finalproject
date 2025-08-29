# 🗄️ phpMyAdmin Database Setup Guide - Aviator Casino

## 📋 **Step-by-Step Setup Instructions**

### **Step 1: Access phpMyAdmin**
1. **Login to your cPanel** or hosting control panel
2. **Find "phpMyAdmin"** (usually in Database section)
3. **Click phpMyAdmin** to open the interface

### **Step 2: Create Database**
1. **Click "Databases" tab** in phpMyAdmin
2. **Enter database name**: `aviator_casino`
3. **Select collation**: `utf8mb4_general_ci`
4. **Click "Create"**

### **Step 3: Import Database Schema**
1. **Select your new database** (`aviator_casino`) from left sidebar
2. **Click "Import" tab**
3. **Click "Choose File"**
4. **Select the file**: `database/aviator_casino.sql`
5. **Click "Go"** to import

### **Step 4: Verify Tables Created**
After import, you should see these tables:
- ✅ `users` (4 columns)
- ✅ `transactions` (12 columns)  
- ✅ `referrals` (10 columns)
- ✅ `payment_settings` (8 columns)

### **Step 5: Configure Database Connection**
1. **Edit `api/config.php`** file
2. **Update database credentials**:
   ```php
   define('DB_HOST', 'localhost');           // Your database host
   define('DB_NAME', 'aviator_casino');      // Database name you created
   define('DB_USER', 'your_db_username');    // Your database username
   define('DB_PASS', 'your_db_password');    // Your database password
   ```

### **Step 6: Upload API Files**
Upload these files to your web server:
```
public_html/
├── api/
│   ├── config.php
│   ├── auth.php
│   ├── users.php
│   ├── transactions.php
│   └── payment-settings.php
└── [your other website files]
```

### **Step 7: Test Database Connection**
1. **Visit**: `https://yourdomain.com/api/auth.php?action=test`
2. **Should show**: Database connection successful
3. **If error**: Check database credentials in `config.php`

## ✅ **Default Data Included**

The database comes with:

### **Admin Account:**
- **Email**: `bdtraderadmin@aviator.com`
- **Password**: `bdtraderpassword125`
- **Balance**: ৳10,000
- **Access**: Full admin panel

### **Demo Player:**
- **Email**: `player1@example.com`
- **Password**: `password123`
- **Balance**: ৳500

### **Payment Settings:**
- **Nagad**: 01712345678
- **bKash**: 01812345678
- **Binance**: aviator_casino_2024

## 🔧 **Database Features**

### **Users Table:**
- User registration and authentication
- Balance management
- Game statistics tracking
- Referral system support
- Admin/player role management

### **Transactions Table:**
- All financial transactions
- Deposit/withdrawal tracking
- Game bet/win/loss records
- Admin approval system
- Payment method details

### **Referrals Table:**
- Referral tracking system
- Turnover requirements
- Bonus calculations
- Completion tracking

### **Payment Settings:**
- Admin-configurable payment accounts
- Multiple payment methods
- Custom instructions

## 🚨 **Important Security Notes**

### **Database Security:**
- ✅ All passwords are hashed with PHP `password_hash()`
- ✅ SQL injection protection with prepared statements
- ✅ Input validation on all API endpoints
- ✅ CORS headers configured for frontend access

### **API Security:**
- ✅ Input sanitization
- ✅ Error handling
- ✅ Transaction safety with rollbacks
- ✅ Admin permission checks

## 🔧 **Customization**

### **Change Admin Credentials:**
```sql
UPDATE users 
SET email = 'your-admin@email.com', 
    password = '$2y$10$your_hashed_password'
WHERE email = 'bdtraderadmin@aviator.com';
```

### **Update Payment Settings:**
```sql
UPDATE payment_settings 
SET nagad_number = '01XXXXXXXXX',
    bkash_number = '01XXXXXXXXX',
    binance_id = 'your_binance_id'
WHERE id = 1;
```

## 📊 **Database Management**

### **View All Users:**
```sql
SELECT username, email, balance, games_played, is_active 
FROM users 
ORDER BY created_at DESC;
```

### **Check Pending Transactions:**
```sql
SELECT t.*, u.username 
FROM transactions t 
JOIN users u ON t.user_id = u.id 
WHERE t.status = 'pending';
```

### **Referral Statistics:**
```sql
SELECT u.username, COUNT(r.id) as total_referrals, SUM(r.bonus_amount) as total_bonus
FROM users u
LEFT JOIN referrals r ON u.id = r.referrer_id
GROUP BY u.id, u.username;
```

## 🚀 **API Endpoints**

Your casino will use these API endpoints:

### **Authentication:**
- `POST /api/auth.php?action=login` - User login
- `POST /api/auth.php?action=register` - User registration

### **User Management:**
- `GET /api/users.php` - Get all users (admin only)
- `PUT /api/users.php?id={userId}` - Update user

### **Transactions:**
- `GET /api/transactions.php` - Get all transactions
- `GET /api/transactions.php?user_id={userId}` - Get user transactions
- `POST /api/transactions.php` - Create transaction
- `PUT /api/transactions.php?id={transactionId}&action=approve` - Approve transaction
- `PUT /api/transactions.php?id={transactionId}&action=reject` - Reject transaction

### **Referrals:**
- `GET /api/referrals.php` - Get all referrals
- `GET /api/referrals.php?user_id={userId}` - Get user referrals
- `PUT /api/referrals.php?user_id={userId}&turnover={amount}` - Update turnover

### **Payment Settings:**
- `GET /api/payment-settings.php` - Get payment settings
- `PUT /api/payment-settings.php` - Update payment settings

## 📞 **Troubleshooting**

### **Common Issues:**

**Database Connection Failed:**
- Check database credentials in `config.php`
- Verify database exists in phpMyAdmin
- Ensure database user has proper permissions

**API Not Working:**
- Check if PHP is enabled on your hosting
- Verify file permissions (644 for PHP files)
- Check server error logs

**Import Failed:**
- Ensure database is selected before importing
- Check file upload limits in hosting
- Try importing tables one by one if needed

## 🎉 **Success Indicators**

Your setup is complete when:
- ✅ Database tables visible in phpMyAdmin
- ✅ Default admin and player accounts exist
- ✅ API endpoints respond correctly
- ✅ Frontend can login with demo accounts
- ✅ Admin panel shows real database data

---

**🎮 Your Aviator Casino now uses phpMyAdmin database with full PHP backend support!**

**Next Steps:**
1. Import the SQL file in phpMyAdmin
2. Update database credentials in `config.php`
3. Upload API files to your server
4. Test with demo accounts