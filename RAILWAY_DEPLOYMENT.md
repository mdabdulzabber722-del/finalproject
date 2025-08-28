# 🚂 Railway Deployment Guide - AviatorCasino

## 🚀 Quick Deploy to Railway (Updated 2025)

Railway is a modern deployment platform that makes it easy to deploy your Aviator Casino with zero configuration.

### **Method 1: GitHub Integration (Recommended)**

#### **Step 1: Push to GitHub**
```bash
# If you haven't already, initialize git in your project
git init
git add .
git commit -m "Initial commit - Aviator Casino"
git branch -M main

# Create a new repository on GitHub first, then:
git remote add origin https://github.com/yourusername/aviator-casino.git
git push -u origin main
```

#### **Step 2: Deploy on Railway**
1. **Go to [railway.app](https://railway.app)**
2. **Click "Start a New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Connect your GitHub account** (if not already connected)
5. **Select your `aviator-casino` repository**
6. **Railway will automatically:**
   - Detect it's a Node.js project
   - Install dependencies (`npm install`)
   - Build the project (`npm run build`)
   - Start the server (`npm start`)

#### **Step 3: Wait for Deployment**
- Railway shows real-time build logs
- Wait for "✅ Deployment successful"
- You'll get a URL like: `https://aviator-casino-production.up.railway.app`

### **Method 2: Railway CLI**

#### **Step 1: Install Railway CLI**
```bash
npm install -g @railway/cli
```

#### **Step 2: Login and Deploy**
```bash
# Navigate to your project folder
cd path/to/your/aviator-casino

# Login to Railway
railway login

# Initialize and deploy
railway init
railway up
```

### **Method 3: Direct Upload (Drag & Drop)**

#### **Step 1: Prepare Your Project**
```bash
# Make sure your project is ready
npm install
npm run build
```

#### **Step 2: Upload to Railway**
1. **Go to [railway.app](https://railway.app)**
2. **Click "Start a New Project"**
3. **Select "Empty Project"**
4. **Click "Deploy from Local Directory"**
5. **Upload your entire project folder**
6. **Railway will auto-detect and deploy**

## ⚙️ **Railway Configuration**

Your project includes these Railway-optimized files:

### **railway.json**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### **package.json (optimized for Railway)**
```json
{
  "scripts": {
    "start": "vite preview --host 0.0.0.0 --port ${PORT:-3000}",
    "build": "vite build"
  }
}
```

## 🔧 **Environment Variables (Optional)**

If you need custom environment variables:
1. **In Railway dashboard** → Your Project
2. **Go to "Variables" tab**
3. **Add variables** like:
   - `NODE_ENV=production`
   - `VITE_APP_NAME=AviatorCasino`

## 🌐 **Custom Domain Setup**

1. **In Railway dashboard** → Your Project
2. **Go to "Settings" → "Domains"**
3. **Click "Custom Domain"**
4. **Add your domain**: `yourdomain.com`
5. **Update DNS** with provided CNAME record

## 📊 **Railway Features**

### **What You Get:**
- ✅ **Automatic HTTPS** - Secure by default
- ✅ **Global CDN** - Fast loading worldwide
- ✅ **Auto-scaling** - Handles traffic spikes
- ✅ **Real-time logs** - Monitor your app
- ✅ **Zero downtime deploys** - Seamless updates
- ✅ **Automatic backups** - Your data is safe

### **Monitoring:**
- **Real-time metrics** - CPU, Memory, Network
- **Application logs** - Debug issues easily
- **Deployment history** - Rollback if needed
- **Custom alerts** - Get notified of issues

## 💰 **Railway Pricing (2025)**

### **Hobby Plan - $5/month:**
- $5 usage credit included
- Perfect for small projects
- 500GB bandwidth
- Community support

### **Pro Plan - $20/month:**
- $20 usage credit included
- Higher resource limits
- Priority support
- Advanced features

## 🚨 **Troubleshooting**

### **Build Fails:**
```bash
# Check these common issues:
1. Ensure package.json has correct scripts
2. Verify all dependencies are listed
3. Check Node.js version compatibility
4. Review Railway build logs
```

### **App Won't Start:**
```bash
# Common solutions:
1. Check if PORT environment variable is used
2. Verify start script binds to 0.0.0.0
3. Ensure vite.config.ts has correct preview settings
```

### **404 Errors:**
```bash
# For SPA routing issues:
1. Verify build output includes all files
2. Check if routing is configured correctly
3. Ensure static files are served properly
```

## ✅ **Deployment Checklist**

Before deploying, verify:
- [ ] ✅ `npm run build` works locally
- [ ] ✅ `npm start` serves the built app
- [ ] ✅ All environment variables are set
- [ ] ✅ Repository is pushed to GitHub
- [ ] ✅ No sensitive data in code

## 🎯 **Success Indicators**

Your deployment is successful when:
- [ ] ✅ Railway shows "Deployed" status
- [ ] ✅ App loads at Railway URL
- [ ] ✅ Login works (bdtraderadmin@aviator.com / bdtraderpassword125)
- [ ] ✅ Game functionality works
- [ ] ✅ No console errors
- [ ] ✅ Mobile version responsive

## 🔄 **Continuous Deployment**

Once connected to GitHub:
- **Every git push** triggers automatic deployment
- **Pull requests** get preview deployments
- **Rollback** to previous versions easily
- **Branch deployments** for testing

## 📞 **Getting Help**

### **Railway Support:**
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status Page](https://status.railway.app)

### **Common Commands:**
```bash
# Check deployment status
railway status

# View logs
railway logs

# Open deployed app
railway open

# Connect to database (if using)
railway connect
```

---

## 🎉 **You're Done!**

Your AviatorCasino is now live on Railway with:
- ✅ Professional hosting infrastructure
- ✅ Automatic HTTPS and security
- ✅ Global CDN for fast loading
- ✅ Automatic deployments
- ✅ Real-time monitoring

**Your live URL:** `https://your-project-name.up.railway.app`

**Demo Accounts:**
- **Admin**: bdtraderadmin@aviator.com / bdtraderpassword125
- **Player**: player1@example.com / password123

Share this URL with anyone to play your Aviator Casino game! 🎮✈️