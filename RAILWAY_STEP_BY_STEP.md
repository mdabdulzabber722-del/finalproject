# 🚂 Railway Deployment - Complete Step by Step Guide (2025)

## 📋 **Before You Start**

Make sure you have:
- [ ] GitHub account (free) - [Sign up here](https://github.com)
- [ ] Your Aviator Casino project files
- [ ] Internet connection

## 🚀 **Method 1: GitHub + Railway (Easiest)**

### **Step 1: Create GitHub Account**
1. Go to [github.com](https://github.com)
2. Click "Sign up" if you don't have an account
3. Verify your email address

### **Step 2: Create New Repository**
1. **Login to GitHub**
2. **Click the "+" icon** (top right) → "New repository"
3. **Fill in details**:
   - Repository name: `aviator-casino`
   - Description: `Aviator Casino Game Platform`
   - Set to **Public** (free option)
   - ✅ Check "Add a README file"
4. **Click "Create repository"**

### **Step 3: Upload Your Project Files**
1. **In your new repository**, you'll see a page with files
2. **Click "uploading an existing file"** link
3. **Select all your project files**:
   - Drag and drop ALL files from your aviator-casino folder
   - **Important**: Don't upload `node_modules` folder if it exists
   - **Important**: Don't upload `dist` folder (Railway will build this)
4. **Scroll down** to "Commit changes" section
5. **Write commit message**: "Initial upload - Aviator Casino"
6. **Click "Commit changes"**

### **Step 4: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. **Click "Login"**
3. **Choose "Continue with GitHub"**
4. **Authorize Railway** to access your GitHub

### **Step 5: Deploy on Railway**
1. **In Railway dashboard**, click "Start a New Project"
2. **Click "Deploy from GitHub repo"**
3. **Select your repository**: `aviator-casino`
4. **Railway automatically detects** it's a Node.js project
5. **Wait for deployment** (2-5 minutes)

### **Step 6: Get Your Live URL**
1. **Railway will show build progress**
2. **When complete**, you'll see a URL like:
   `https://aviator-casino-production.up.railway.app`
3. **Click the URL** to open your live Aviator Casino!

## 🛠️ **Method 2: Railway CLI (Advanced)**

### **Step 1: Install Railway CLI**
```bash
# Install globally
npm install -g @railway/cli

# Verify installation
railway --version
```

### **Step 2: Login to Railway**
```bash
railway login
```
- This opens your browser
- Login with GitHub
- Return to terminal

### **Step 3: Navigate to Project**
```bash
# Go to your project folder
cd path/to/your/aviator-casino

# Example:
# cd C:\Users\YourName\Desktop\aviator-casino
```

### **Step 4: Initialize Railway Project**
```bash
railway init
```
- Choose "Create new project"
- Enter project name: `aviator-casino`

### **Step 5: Deploy**
```bash
railway up
```
- Railway uploads all files
- Builds and deploys automatically
- Shows you the live URL

## 🛠️ **Method 3: Direct Upload (No GitHub)**

### **Step 1: Go to Railway**
1. Visit [railway.app](https://railway.app)
2. **Login** with GitHub or email

### **Step 2: Create New Project**
1. **Click "Start a New Project"**
2. **Click "Empty Project"**
3. **Click "Deploy from Local Directory"**

### **Step 3: Upload Your Files**
1. **Select your entire project folder**
2. **Upload all files** (Railway handles the rest)
3. **Wait for automatic deployment**

## ✅ **Verification Steps**

After deployment, check:

### **1. Test the URL**
- Click your Railway URL
- Should load the Aviator Casino homepage

### **2. Test Login**
- Click "Login" button
- Use demo account:
  - Email: `bdtraderadmin@aviator.com`
  - Password: `bdtraderpassword125`

### **3. Test Game Features**
- Place a bet
- Watch the multiplier
- Try cashing out

### **4. Check Browser Console**
- Press F12 in browser
- Look for any error messages
- Should be minimal or no errors

## 🔧 **If Something Goes Wrong**

### **Build Fails:**
1. Check Railway logs in dashboard
2. Look for error messages
3. Common fix: Ensure `package.json` has correct scripts

### **App Won't Load:**
1. Wait 5-10 minutes (sometimes takes time)
2. Check Railway deployment status
3. Try refreshing the page

### **Features Don't Work:**
1. Check browser console for errors
2. Verify all files uploaded correctly
3. Try the demo accounts

## 🎉 **Success!**

When everything works, you'll have:
- ✅ Live Aviator Casino at your Railway URL
- ✅ Automatic HTTPS security
- ✅ Global CDN for fast loading
- ✅ Automatic deployments on code changes (if using GitHub)

## 📱 **Share Your Casino**

Your Aviator Casino is now live! Share the Railway URL with anyone:
- `https://your-project-name.up.railway.app`
- Works on all devices
- No installation needed for players

## 🔄 **Automatic Updates (GitHub Method)**

If you used GitHub:
- Every time you push code to GitHub
- Railway automatically rebuilds and deploys
- Zero downtime updates
- Always stay up to date

## 💰 **Railway Pricing**

### **Hobby Plan - $5/month:**
- $5 usage credit included
- Perfect for small casinos
- 500GB bandwidth
- Community support

### **Pro Plan - $20/month:**
- $20 usage credit included
- Higher limits
- Priority support
- Advanced features

---

**🎮 Congratulations! Your Aviator Casino is now live on Railway!**

**Demo Accounts:**
- **Admin**: bdtraderadmin@aviator.com / bdtraderpassword125
- **Player**: player1@example.com / password123