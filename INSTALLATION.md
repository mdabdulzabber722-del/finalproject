# 📦 Installation Guide - Aviator Casino

## 🎯 Quick Installation (5 Minutes)

### Step 1: Prerequisites
Download and install these first:
- **Node.js** (v16+): https://nodejs.org/
- **Git** (optional): https://git-scm.com/

### Step 2: Get the Project
```bash
# Option A: If you have the project files
cd aviator-casino

# Option B: If cloning from repository
git clone <your-repo-url>
cd aviator-casino
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start the Application
```bash
npm run dev
```

### Step 5: Open in Browser
Go to: **http://localhost:3000**

## ✅ Verification Checklist

After installation, verify these work:
- [ ] Website loads at localhost:3000
- [ ] Login modal appears when clicking "Login"
- [ ] Demo login works (admin@aviator.com / password123)
- [ ] Game interface is visible and functional
- [ ] No errors in browser console (F12)

## 🎮 Demo Accounts

### Admin Account
- **Email**: admin@aviator.com
- **Password**: password123
- **Access**: Full admin panel, user management

### Player Account  
- **Email**: player1@example.com
- **Password**: password123
- **Balance**: $500 starting balance

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options

#### Railway (Recommended)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

#### cPanel Hosting
1. Run `npm run build`
2. Upload contents of `dist` folder to `public_html`
3. Ensure `.htaccess` file is included

## 🔧 Troubleshooting

### Issue: "npm install" fails
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Blank page after deployment
**Solution:**
- Check `.htaccess` file is uploaded
- Verify all files from `dist` folder are uploaded
- Check browser console for errors (F12)

### Issue: Port 3000 already in use
**Solution:**
```bash
npm run dev -- --port 3001
```

## 📞 Need Help?

1. **Check browser console** (F12) for error messages
2. **Verify Node.js version**: `node --version` (should be 16+)
3. **Clear browser cache** and try again
4. **Restart development server**: Stop (Ctrl+C) and run `npm run dev` again

---

**🎉 Installation Complete! Your Aviator Casino is ready to play!**