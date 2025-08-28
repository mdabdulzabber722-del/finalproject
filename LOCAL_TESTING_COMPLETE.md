# 🖥️ Complete Local Testing Guide - Aviator Casino

## 📋 **What You Need**

Before starting, make sure you have:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)
- **Web Browser** (Chrome, Firefox, Safari, or Edge)

## 🚀 **Step 1: Get Your Project Files**

### **Option A: Download from GitHub**
1. **Go to your repository**: `https://github.com/mdabdulzabber722-del/fast`
2. **Click the green "Code" button**
3. **Click "Download ZIP"**
4. **Extract the ZIP file** to a folder (e.g., `Desktop/aviator-casino`)

### **Option B: Clone with Git (if you have Git installed)**
```bash
git clone https://github.com/mdabdulzabber722-del/fast.git
cd fast
```

## 🔧 **Step 2: Open Terminal/Command Prompt**

### **Windows:**
- Press `Win + R`, type `cmd`, press Enter
- Or search for "Command Prompt" in Start menu

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
- Downloads all required packages
- Sets up the project dependencies
- Takes 2-3 minutes to complete

## 🎮 **Step 5: Start Development Server**

```bash
npm run dev
```

**You should see output like:**
```
  VITE v5.4.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## 🌐 **Step 6: Open in Browser**

1. **Open your web browser**
2. **Go to**: `http://localhost:3000`
3. **Your Aviator Casino should load!**

## ✅ **Step 7: Test Everything**

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

### **Test Payment System:**
- ✅ Deposit modal
- ✅ Withdrawal modal
- ✅ Payment method selection

## 🔧 **Step 8: Test Production Build**

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

## 📱 **Step 9: Test on Mobile (Optional)**

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

### **Issue: Build fails**
**Solution:** Check the console for specific errors and fix them

### **Issue: Blank page**
**Solution:** 
- Check browser console (F12) for errors
- Make sure all files are in the correct location

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

1. **Edit files** in your code editor
2. **Save changes** - Vite automatically reloads
3. **See changes instantly** in browser
4. **Test thoroughly** before deploying

## 📞 **Need Help?**

If you encounter issues:
1. **Check the terminal** for error messages
2. **Check browser console** (F12) for JavaScript errors
3. **Ensure Node.js version** is 16+ (`node --version`)
4. **Clear browser cache** and refresh

## 🎉 **You're Ready!**

Once everything works locally:
- ✅ You can develop new features
- ✅ Test changes safely
- ✅ Debug issues easily
- ✅ Deploy with confidence

---

**🎮 Your Aviator Casino is now running locally! Enjoy testing and developing!**