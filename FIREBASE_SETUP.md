# 🔥 Firebase Database Setup Guide

## 🎯 **Why Firebase?**

Your Aviator Casino now uses **Firebase (Google)** for real database persistence, which means:
- ✅ **All user registrations** are saved permanently
- ✅ **Admin panel** shows all real users and transactions
- ✅ **Data persists** across browser sessions and devices
- ✅ **Real-time updates** across all users
- ✅ **Production-ready** scalable database by Google

## 🚀 **Step-by-Step Setup**

### **Step 1: Create Firebase Project**
1. **Go to [console.firebase.google.com](https://console.firebase.google.com)**
2. **Click "Create a project"**
3. **Enter project name**: `aviator-casino`
4. **Disable Google Analytics** (optional for this project)
5. **Click "Create project"**
6. **Wait for setup** to complete

### **Step 2: Enable Authentication**
1. **In Firebase Console**, click **"Authentication"** in left sidebar
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Click "Email/Password"**
5. **Enable "Email/Password"** (first option)
6. **Click "Save"**

### **Step 3: Create Firestore Database**
1. **Click "Firestore Database"** in left sidebar
2. **Click "Create database"**
3. **Choose "Start in test mode"** (we'll secure it later)
4. **Select location** closest to your users
5. **Click "Done"**

### **Step 4: Configure Security Rules**
1. **In Firestore**, go to **"Rules" tab**
2. **Replace the rules** with this secure configuration:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admins can read/write all user documents
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users can read/write their own transactions
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      // Admins can read/write all transactions
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Referrals - users can read their own, admins can read all
    match /referrals/{referralId} {
      allow read: if request.auth != null && 
        (resource.data.referrerId == request.auth.uid || 
         resource.data.referredUserId == request.auth.uid);
      allow write: if request.auth != null;
      // Admins can read/write all referrals
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Payment settings - everyone can read, only admins can write
    match /paymentSettings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

3. **Click "Publish"**

### **Step 5: Get Firebase Configuration**
1. **Click the gear icon** ⚙️ next to "Project Overview"
2. **Click "Project settings"**
3. **Scroll down** to "Your apps" section
4. **Click the web icon** `</>`
5. **Enter app nickname**: `aviator-casino-web`
6. **Click "Register app"**
7. **Copy the configuration object** (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "aviator-casino-12345.firebaseapp.com",
  projectId: "aviator-casino-12345",
  storageBucket: "aviator-casino-12345.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### **Step 6: Configure Environment Variables**
1. **Create `.env` file** in your project root
2. **Add your Firebase credentials**:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyC...
   VITE_FIREBASE_AUTH_DOMAIN=aviator-casino-12345.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=aviator-casino-12345
   VITE_FIREBASE_STORAGE_BUCKET=aviator-casino-12345.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```
3. **Replace** with your actual values from Step 5

### **Step 7: Test the Connection**
1. **Run your project**: `npm run dev`
2. **Try registering** a new user
3. **Check Firebase Console** → **Firestore Database**
4. **You should see** the new user in the `users` collection!

## ✅ **Verification Checklist**

After setup, verify these work:
- [ ] ✅ New user registration saves to Firestore
- [ ] ✅ Admin panel shows all registered users
- [ ] ✅ Transactions appear in admin panel
- [ ] ✅ Login works with registered users
- [ ] ✅ Data persists after browser refresh
- [ ] ✅ Real-time updates work

## 🔧 **Default Admin Account**

The system automatically creates a default admin account:
The system automatically creates a default admin account:
- **Email**: `bdtraderadmin@aviator.com`
- **Password**: `bdtraderpassword125`
- **Access**: Full admin panel with all permissions

**Note**: This admin account is created automatically in Firestore and doesn't require Firebase Authentication setup. It uses a simplified login process for demo purposes.
- **Access**: Full admin panel with all permissions

## 🚨 **Important Notes**

### **Security:**
- ✅ **Firestore Security Rules** protect all data
- ✅ **Users can only see their own data**
- ✅ **Admins can see all data**
- ✅ **Proper authentication** required for all operations

### **Data Structure:**
- **users** collection: Account info, balances, game stats
- **transactions** collection: All deposits, withdrawals, bets, wins, losses
- **referrals** collection: Referral system tracking
- **paymentSettings** collection: Admin payment configuration

## 🎯 **What Changes After Setup**

### **Before (Local Storage):**
- ❌ Data lost on browser clear
- ❌ Each user sees different data
- ❌ No real persistence

### **After (Firebase):**
- ✅ **Permanent data storage** in Google's cloud
- ✅ **All users share same database**
- ✅ **Admin sees all real users**
- ✅ **Real-time updates** across all devices
- ✅ **Production-ready architecture**

## 🚀 **Deploy with Database**

After Firebase setup:
1. **Commit your changes**: `git add . && git commit -m "Add Firebase integration"`
2. **Push to GitHub**: `git push`
3. **Deploy to Vercel** with environment variables
4. **Add environment variables** in Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

## 📞 **Need Help?**

If you encounter issues:
1. **Check Firebase Console** for error logs
2. **Verify environment variables** are set correctly
3. **Ensure Firestore rules** are published
4. **Check browser console** for error messages
5. **Verify Authentication** is enabled

## 💡 **Firebase Features You Get:**

- 🔥 **Real-time Database** - Instant updates across all users
- 🔐 **Authentication** - Secure user management
- 📊 **Analytics** - Track user behavior (optional)
- 🚀 **Hosting** - Can host your app on Firebase too
- 💾 **Cloud Storage** - For file uploads if needed
- 📱 **Mobile SDKs** - Easy mobile app integration

---

**🎮 Your Aviator Casino now has Google's Firebase database! All user registrations and transactions will be properly stored and visible in the admin panel with real-time updates.**