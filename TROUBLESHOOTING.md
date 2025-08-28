# 🔧 Railway Deployment Troubleshooting Guide

## 🚨 Common Problems & Solutions

### **Problem 1: Build Fails**
**Error**: `npm install` or `npm run build` fails

**Solutions:**
```bash
# Check Node.js version compatibility
# Railway uses Node.js 18+ by default

# If you see dependency errors:
1. Delete package-lock.json locally
2. Run: npm install
3. Commit and push changes
```

### **Problem 2: App Won't Start**
**Error**: Application deployed but won't start

**Solutions:**
1. **Check start script** in package.json:
   ```json
   "start": "vite preview --host 0.0.0.0 --port ${PORT:-3000}"
   ```

2. **Verify port binding** in vite.config.ts:
   ```javascript
   preview: {
     port: parseInt(process.env.PORT || '3000'),
     host: true,
   }
   ```

### **Problem 3: GitHub Connection Issues**
**Error**: Can't connect repository to Railway

**Solutions:**
1. **Make repository public** (if private, need Railway Pro)
2. **Check repository permissions**:
   - Go to GitHub → Settings → Applications
   - Find Railway → Grant access
3. **Re-authorize Railway** in GitHub

### **Problem 4: Environment Variables**
**Error**: App runs but features don't work

**Solutions:**
1. **In Railway dashboard**:
   - Go to Variables tab
   - Add any missing environment variables
2. **Check if PORT is set** (Railway sets this automatically)

### **Problem 5: Domain/URL Issues**
**Error**: Can't access the deployed app

**Solutions:**
1. **Check deployment status**:
   - Railway dashboard → Deployments
   - Look for green checkmark
2. **Wait for DNS propagation** (can take 5-10 minutes)
3. **Try the Railway-provided URL** first

## 🔍 **Debugging Steps**

### **Step 1: Check Railway Logs**
1. Go to Railway dashboard
2. Click your project
3. Click "Logs" tab
4. Look for error messages

### **Step 2: Test Locally First**
```bash
# Test the production build locally
npm run build
npm start

# Should work on localhost:3000
```

### **Step 3: Verify Files**
Make sure these files exist:
- [ ] `package.json` (with correct start script)
- [ ] `vite.config.ts` (with port configuration)
- [ ] `railway.json` (Railway configuration)
- [ ] All source files in `src/` folder

## 🆘 **Still Having Issues?**

### **Quick Fixes to Try:**

1. **Re-deploy from scratch**:
   ```bash
   # Delete the Railway project
   # Create new project
   # Connect repository again
   ```

2. **Check Railway status**:
   - Visit [railway.app/status](https://railway.app/status)
   - Check if Railway services are down

3. **Try Railway CLI**:
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

## 📞 **Get Help**

If none of these solutions work:

1. **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
2. **Railway Docs**: [docs.railway.app](https://docs.railway.app)
3. **Check Railway logs** for specific error messages

## ✅ **Success Checklist**

Your deployment should have:
- [ ] ✅ Green deployment status in Railway
- [ ] ✅ App accessible at Railway URL
- [ ] ✅ Login works (admin@aviator.com / password123)
- [ ] ✅ Game interface loads
- [ ] ✅ No console errors in browser

---

**💡 Tip**: Most issues are solved by checking the Railway logs and ensuring the start script is correct!