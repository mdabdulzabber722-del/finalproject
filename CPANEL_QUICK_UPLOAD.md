# ⚡ Quick cPanel Upload - 5 Minutes

## 🎯 **Super Quick cPanel Deployment**

### **Step 1: Build Project (1 minute)**
```bash
npm run build
```
This creates a `dist` folder with all files ready for upload.

### **Step 2: Access cPanel (1 minute)**
1. **Login to cPanel**
2. **Open File Manager**
3. **Go to public_html folder**

### **Step 3: Upload Files (2 minutes)**
1. **Click "Upload"**
2. **Select ALL files from `dist` folder**
3. **Upload to public_html**
4. **Enable "Show Hidden Files"** (for .htaccess)

### **Step 4: Set Permissions (1 minute)**
1. **Select all files**
2. **Change Permissions**: Files=644, Folders=755
3. **Apply to subdirectories**

### **Step 5: Test (30 seconds)**
- **Visit your domain**
- **Test login**: admin@aviator.com / password123

## ✅ **Done!**

Your Aviator Casino is now live at your domain!

**Total time: ~5 minutes**

---

**Need detailed help?** Check `CPANEL_DEPLOYMENT_COMPLETE.md` for full instructions.