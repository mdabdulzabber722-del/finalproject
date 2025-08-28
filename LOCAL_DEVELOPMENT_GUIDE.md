# 🖥️ Running Aviator Casino Locally - Complete Guide

## 📋 **Prerequisites**

Before starting, make sure you have these installed:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **Git** (optional but recommended) - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

## 🚀 **Step 1: Get Your Project Files**

### **Option A: Download from Current Project**
If you're working in this environment:
1. **Download all project files** to a folder on your computer
2. **Create a new folder** like `C:\aviator-casino` or `~/aviator-casino`
3. **Copy all files** into this folder

### **Option B: Clone from GitHub (if uploaded)**
```bash
git clone https://github.com/yourusername/aviator-casino.git
cd aviator-casino
```

## 🔧 **Step 2: Open Terminal/Command Prompt**

### **Windows:**
- Press `Win + R`, type `cmd`, press Enter
- Or search for "Command Prompt" in Start menu
- Or use PowerShell

### **Mac:**
- Press `Cmd + Space`, type "terminal", press Enter

### **Linux:**
- Press `Ctrl + Alt + T`

## 📁 **Step 3: Navigate to Your Project**

```bash
# Replace with your actual path
cd C:\Users\YourName\Desktop\aviator-casino

# Or on Mac/Linux:
cd /Users/YourName/Desktop/aviator-casino
```

## 📦 **Step 4: Install Dependencies**

```bash
npm install
```

**What this does:**
- Downloads all required packages (React, Firebase, etc.)
- Sets up the project dependencies
- Takes 2-3 minutes to complete
- Creates `node_modules` folder

## 🔥 **Step 5: Set Up Environment Variables**

Create a `.env` file in your project root with your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSyDtFxpHffnWdWVVXPVPVucn-7umkXz82rQ
VITE_FIREBASE_AUTH_DOMAIN=aviatorcasino-29156.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=aviatorcasino-29156
VITE_FIREBASE_STORAGE_BUCKET=aviatorcasino-29156.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=129836915204
VITE_FIREBASE_APP_ID=1:129836915204:web:4fa06fe5bd89f19864b351
```

## 🎮 **Step 6: Start Development Server**

```bash
npm run dev
```

**You should see output like:**
```
  VITE v5.4.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## 🌐 **Step 7: Open in Browser**

1. **Open your web browser**
2. **Go to**: `http://localhost:3000`
3. **Your Aviator Casino should load!**

## ✅ **Step 8: Test Everything**

### **Test Login System:**
- **Admin Account**: 
  - Email: `bdtraderadmin@aviator.com`
  - Password: `bdtraderpassword125`
- **Player Account**: 
  - Email: `player1@example.com`
  - Password: `password123`

### **Test Game Features:**
- ✅ Place bets
- ✅ Watch multiplier rise
- ✅ Cash out before crash
- ✅ Check game history
- ✅ View live bets

### **Test Admin Panel (with admin account):**
- ✅ User management
- ✅ Transaction approval
- ✅ Payment settings
- ✅ Statistics dashboard

## 🔧 **Step 9: Test Production Build (Optional)**

```bash
# Build for production
npm run build

# Test the production build
npm run preview
```

**This will:**
- Create a `dist` folder with production files
- Start preview server at `http://localhost:4173`
- Show exactly how it will work when deployed

## 📱 **Step 10: Test on Mobile (Optional)**

### **Find Your Computer's IP Address:**

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address

### **Start Server with Network Access:**
```bash
npm run dev -- --host
```

### **Access from Mobile:**
- Connect phone to same WiFi
- Open browser on phone
- Go to: `http://YOUR_IP_ADDRESS:3000`
- Example: `http://192.168.1.100:3000`

## 🚨 **Common Issues & Solutions**

### **Issue: "npm not found"**
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### **Issue: "Port 3000 already in use"**
**Solution:**
```bash
npm run dev -- --port 3001
```

### **Issue: Dependencies fail to install**
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Issue: Firebase connection errors**
**Solution:**
- Check `.env` file exists with correct Firebase config
- Ensure Firebase project is set up correctly
- Check browser console (F12) for specific errors

### **Issue: Blank page**
**Solution:** 
- Check browser console (F12) for errors
- Make sure all files are in the correct location
- Verify `.env` file is in project root

## 🎯 **Success Indicators**

Your local setup is working when:
- ✅ `npm install` completes without errors
- ✅ `npm run dev` starts successfully
- ✅ Browser loads casino at localhost:3000
- ✅ Login works with demo accounts
- ✅ Game interface is fully functional
- ✅ Admin panel accessible
- ✅ All features respond correctly

## 🔄 **Making Changes**

1. **Edit files** in your code editor (VS Code recommended)
2. **Save changes** - Vite automatically reloads
3. **See changes instantly** in browser
4. **Test thoroughly** before deploying

## 📞 **Need Help?**

If you encounter issues:
1. **Check the terminal** for error messages
2. **Check browser console** (F12) for JavaScript errors
3. **Ensure Node.js version** is 16+ (`node --version`)
4. **Clear browser cache** and refresh
5. **Restart development server**: Stop (Ctrl+C) and run `npm run dev` again

## 🎉 **You're Ready!**

Once everything works locally:
- ✅ You can develop new features
- ✅ Test changes safely
- ✅ Debug issues easily
- ✅ Deploy with confidence

---

**🎮 Your Aviator Casino is now running locally! Enjoy developing and testing! 🔥**