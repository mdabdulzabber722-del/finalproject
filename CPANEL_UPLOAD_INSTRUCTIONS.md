# 🚀 cPanel Upload Instructions - Aviator Casino

## 📦 **Files Ready for Upload**

Your project has been built and optimized for cPanel hosting. Here's what to upload:

### **Upload ONLY these files from the `dist` folder to your `public_html`:**

```
public_html/
├── index.html          ← Main application file
├── .htaccess          ← Apache routing (CRITICAL!)
├── aviator.png        ← Favicon
├── _redirects         ← Backup routing
└── assets/            ← CSS and JavaScript files
    ├── [name].[hash].css
    └── [name].[hash].js
```

## 🔧 **Step-by-Step Upload Process**

### **Step 1: Access cPanel File Manager**
1. **Login to your cPanel account**
2. **Find "File Manager"** (usually in Files section)
3. **Click File Manager**
4. **Navigate to "public_html"** folder

### **Step 2: Clear Existing Files (If Fresh Install)**
1. **Select all existing files** in public_html (if any)
2. **Click "Delete"** to remove old files
3. **Confirm deletion**

### **Step 3: Upload Project Files**
1. **Click "Upload"** button in File Manager
2. **Select ALL files from your `dist` folder**
   - ⚠️ **IMPORTANT**: Upload the CONTENTS of dist folder, not the dist folder itself
3. **Wait for upload to complete**
4. **Click "Go Back to [domain]/public_html"**

### **Step 4: Show Hidden Files (CRITICAL!)**
1. **Click "Settings"** in File Manager
2. **Check "Show Hidden Files (dotfiles)"**
3. **Save Settings**
4. **Verify .htaccess file is now visible**

### **Step 5: Set File Permissions**
1. **Select all uploaded files and folders**
2. **Right-click → "Change Permissions"**
3. **Set permissions**:
   - **Files**: 644
   - **Folders**: 755
4. **Check "Recurse into subdirectories"**
5. **Apply changes**

## ✅ **Testing Your Deployment**

### **1. Basic Test**
- Visit your domain: `https://yourdomain.com`
- Should load the Aviator Casino homepage
- No need to add `/index.html` to the URL

### **2. Login Test**
- Click "Login" button
- Use demo accounts:
  - **Admin**: admin@aviator.com / password123
  - **Player**: player1@example.com / password123

### **3. Game Test**
- Place a bet
- Watch the multiplier rise
- Try cashing out
- Check admin panel (with admin account)

### **4. Browser Console Check**
- Press **F12** → Console tab
- Should have minimal or no errors
- Game should run smoothly

## 🚨 **Common Issues & Solutions**

### **Issue: Blank White Page**
**Solutions:**
- ✅ Check if `.htaccess` file is uploaded
- ✅ Verify all files from `dist` folder are uploaded
- ✅ Set correct file permissions (644 for files, 755 for folders)
- ✅ Clear browser cache and refresh

### **Issue: 404 Errors on Navigation**
**Solutions:**
- ✅ Ensure `.htaccess` is in public_html root
- ✅ Contact hosting support about mod_rewrite support
- ✅ Enable "Show Hidden Files" to see .htaccess

### **Issue: Assets Not Loading (CSS/JS missing)**
**Solutions:**
- ✅ Re-upload `assets` folder completely
- ✅ Check file permissions on assets folder
- ✅ Verify no files were corrupted during upload

## 🎮 **What Your Users Will Get**

After successful deployment:
- **Professional casino interface**
- **Working game mechanics**
- **User authentication system**
- **Admin panel access**
- **Payment system (Nagad, bKash, Binance Pay)**
- **Mobile-responsive design**
- **Fast loading times**

## 🔧 **Hosting Requirements**

Your hosting must support:
- ✅ **Apache with mod_rewrite** (for .htaccess)
- ✅ **Static file serving** (HTML/CSS/JS)
- ✅ **HTTPS support** (recommended)
- ❌ **No PHP required**
- ❌ **No database required**
- ❌ **No special server software**

## 📞 **Getting Help**

If you encounter issues:
1. **Check browser console** (F12) for error messages
2. **Contact your hosting provider** about:
   - mod_rewrite support
   - .htaccess file support
   - Static file serving capabilities
3. **Verify all files from dist folder are uploaded**

## 🎉 **Success Indicators**

Your deployment is successful when:
- ✅ Casino loads at your domain
- ✅ Login modal appears and works
- ✅ Game interface is fully functional
- ✅ All buttons and features respond
- ✅ No console errors in browser
- ✅ Admin panel accessible
- ✅ Payment settings can be customized

---

**🎮 Your Aviator Casino is now ready for cPanel deployment!**

**Demo Accounts:**
- **Admin**: admin@aviator.com / password123
- **Player**: player1@example.com / password123