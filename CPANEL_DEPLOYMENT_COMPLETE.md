# 🎯 Complete cPanel Deployment Guide - Aviator Casino

## 📋 **What You Need**

- ✅ cPanel hosting account with File Manager
- ✅ Domain name pointing to your hosting
- ✅ FTP access (optional, File Manager works fine)

## 📦 **Files Ready for Upload**

After running `npm run build`, your `dist` folder contains everything needed:

```
dist/
├── index.html          ← Main application file
├── .htaccess          ← Apache routing (CRITICAL!)
├── aviator.png        ← Favicon
├── _redirects         ← Backup routing
└── assets/            ← CSS and JavaScript files
    ├── index-[hash].css
    └── index-[hash].js
```

## 🚀 **Step-by-Step cPanel Upload**

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

### **Step 4: Verify File Structure**
Your public_html should look exactly like this:
```
public_html/
├── index.html
├── .htaccess          ← Make sure this is visible!
├── aviator.png
├── _redirects
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

### **Step 5: Show Hidden Files (CRITICAL!)**
1. **Click "Settings"** in File Manager
2. **Check "Show Hidden Files (dotfiles)"**
3. **Save Settings**
4. **Verify .htaccess file is now visible**

### **Step 6: Set File Permissions**
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
**Causes & Solutions:**
- ❌ `.htaccess` file missing → Upload .htaccess file
- ❌ Files in wrong location → Ensure files are in public_html root
- ❌ Incorrect permissions → Set files to 644, folders to 755
- ❌ Browser cache → Clear cache and refresh

### **Issue: 404 Errors on Navigation**
**Causes & Solutions:**
- ❌ `.htaccess` not working → Contact hosting support about mod_rewrite
- ❌ Hidden files not shown → Enable "Show Hidden Files" in File Manager
- ❌ Apache not configured → Ensure hosting supports .htaccess

### **Issue: Assets Not Loading (CSS/JS missing)**
**Causes & Solutions:**
- ❌ `assets` folder missing → Re-upload assets folder completely
- ❌ Wrong permissions → Set assets folder to 755, files to 644
- ❌ Corrupted upload → Delete and re-upload assets folder

### **Issue: Login/Game Features Don't Work**
**Causes & Solutions:**
- ❌ JavaScript errors → Check browser console (F12)
- ❌ Cached old version → Clear browser cache completely
- ❌ Files corrupted → Re-upload all files from dist folder

## 🔧 **Advanced Troubleshooting**

### **Check .htaccess Content**
Your .htaccess file should contain:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]

# Additional security and performance settings
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType text/css .css
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

### **Hosting Requirements**
Your hosting must support:
- ✅ **Apache with mod_rewrite** (for .htaccess)
- ✅ **Static file serving** (HTML/CSS/JS)
- ✅ **HTTPS support** (recommended)
- ❌ **No PHP required**
- ❌ **No database required**
- ❌ **No special server software**

## 🎮 **What Your Users Will Get**

After successful deployment:
- **Professional casino interface**
- **Working game mechanics**
- **User authentication system**
- **Admin panel access**
- **Mobile-responsive design**
- **Fast loading times**

## 💡 **Pro Tips**

1. **Test locally first**: Run `npm run build && npm run preview`
2. **Backup files**: Keep a copy of your dist folder
3. **Monitor performance**: Check loading times after upload
4. **Update easily**: Rebuild and re-upload when making changes
5. **Use compression**: Many cPanel accounts support file compression for faster uploads

## 📞 **Getting Help**

If you encounter issues:
1. **Check cPanel error logs** (if available in your hosting)
2. **Contact your hosting provider** about:
   - mod_rewrite support
   - .htaccess file support
   - Static file serving capabilities
3. **Verify hosting requirements** are met

## 🎉 **Success Indicators**

Your deployment is successful when:
- ✅ Casino loads at your domain
- ✅ Login modal appears and works
- ✅ Game interface is fully functional
- ✅ All buttons and features respond
- ✅ No console errors in browser
- ✅ Mobile version works correctly
- ✅ Admin panel accessible

---

**🎮 Your Aviator Casino is now ready for cPanel deployment!**

**Next Step**: Upload the contents of your `dist` folder to `public_html` and follow this guide!