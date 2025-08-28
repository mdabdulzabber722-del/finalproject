# 🖥️ Local Testing Guide - Aviator Casino

## 📋 **Prerequisites**

Make sure you have these installed on your computer:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **Git** (optional but recommended) - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

## 🚀 **Step 1: Download Your Project**

### **Option A: Download ZIP from GitHub**
1. Go to your GitHub repository: `https://github.com/mdabdulzabber722-del/fast`
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP file to a folder (e.g., `Desktop/aviator-casino`)

### **Option B: Clone with Git**
```bash
git clone https://github.com/mdabdulzabber722-del/fast.git
cd fast
```

## 🔧 **Step 2: Install Dependencies**

Open **Command Prompt** (Windows) or **Terminal** (Mac/Linux):

```bash
# Navigate to your project folder
cd path/to/your/aviator-casino

# Install all dependencies
npm install
```

Wait for installation to complete (this may take 2-3 minutes).

## 🎮 **Step 3: Start Development Server**

```bash
# Start the development server
npm run dev
```

You should see output like:
```
  VITE v5.4.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## 🌐 **Step 4: Open in Browser**

1. **Open your web browser**
2. **Go to**: `http://localhost:3000`
3. **Your Aviator Casino should load!**

## ✅ **Step 5: Test Everything**

### **Test Login:**
- **Admin**: `bdtraderadmin@aviator.com` / `bdtraderpassword125`
- **Player**: `player1@example.com` / `password123`

### **Test Features:**
- ✅ Login/Register system
- ✅ Game interface and betting
- ✅ Admin panel (with admin account)
- ✅ Deposit/Withdraw modals
- ✅ Payment settings
- ✅ User management

## 🔧 **Step 6: Test Production Build**

```bash
# Build for production
npm run build

# Test the production build
npm run preview
```

This will:
1. Create a `dist` folder with production files
2. Start a preview server at `http://localhost:4173`

## 🚨 **Common Issues & Solutions**

### **Issue: "npm not found"**
- **Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### **Issue: "Port 3000 already in use"**
- **Solution**: 
  ```bash
  npm run dev -- --port 3001
  ```

### **Issue: Dependencies fail to install**
- **Solution**:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### **Issue: Build fails**
- **Solution**: Check the console for specific errors and fix them

## 📱 **Step 7: Test on Mobile**

1. **Find your computer's IP address**:
   - Windows: `ipconfig` in Command Prompt
   - Mac/Linux: `ifconfig` in Terminal

2. **Start dev server with host flag**:
   ```bash
   npm run dev -- --host
   ```

3. **Access from mobile**: `http://YOUR_IP_ADDRESS:3000`

## 🎯 **Success Indicators**

Your local setup is working when:
- ✅ `npm install` completes without errors
- ✅ `npm run dev` starts successfully
- ✅ Browser loads the casino at localhost:3000
- ✅ Login works with demo accounts
- ✅ Game interface is fully functional
- ✅ `npm run build` creates dist folder successfully
- ✅ `npm run preview` serves the built app

## 🔄 **Making Changes**

1. **Edit files** in your code editor
2. **Save changes** - Vite will automatically reload
3. **See changes instantly** in your browser
4. **Test thoroughly** before deploying

## 📞 **Need Help?**

If you encounter issues:
1. **Check the terminal** for error messages
2. **Check browser console** (F12) for JavaScript errors
3. **Ensure Node.js version** is 16+ (`node --version`)
4. **Clear browser cache** and refresh

---

**🎮 Once everything works locally, you can confidently deploy to Vercel!**