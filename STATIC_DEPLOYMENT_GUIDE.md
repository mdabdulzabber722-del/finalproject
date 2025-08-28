# 📁 Static File Deployment Guide

## 🎯 Deploy to Any Web Server (Apache/Nginx/cPanel)

Your Aviator Casino can be deployed as **static files** to any web server that supports HTML/CSS/JavaScript.

## 📦 **Step 1: Build the Project**

First, create the production files:
```bash
npm run build
```

This creates a `dist` folder with all the files you need.

## 📁 **Step 2: Files to Upload**

Upload **ONLY** the contents of the `dist` folder to your web server:

```
public_html/          (or your web root)
├── index.html        ← Main file
├── .htaccess         ← For Apache routing (IMPORTANT!)
├── aviator.png       ← Favicon
├── _redirects        ← Backup routing
└── assets/           ← CSS and JavaScript files
    ├── index-[hash].css
    └── index-[hash].js
```

## 🔧 **Step 3: Server Configuration**

### **For Apache Servers (.htaccess)**
The `.htaccess` file is already included and configured:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

### **For Nginx Servers**
Add this to your nginx config:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### **For cPanel Hosting**
1. Upload all files from `dist` folder to `public_html`
2. Ensure `.htaccess` file is uploaded (enable "Show Hidden Files")
3. Set file permissions: 644 for files, 755 for folders

## ✅ **Step 4: Verification**

After upload, check:
- [ ] Website loads at your domain
- [ ] Login works (admin@aviator.com / password123)
- [ ] Game interface appears
- [ ] No 404 errors when navigating
- [ ] All features work correctly

## 🚨 **Important Limitations**

When deployed as static files:
- ✅ **Works**: Game interface, login, betting, animations
- ✅ **Works**: All visual features and interactions
- ⚠️ **Limited**: No real-time multiplayer features
- ⚠️ **Limited**: No server-side data persistence
- ⚠️ **Limited**: Demo mode only (no real payments)

## 🔧 **Troubleshooting**

### **Blank Page:**
- Check if `.htaccess` file is uploaded
- Verify all files from `dist` folder are uploaded
- Check browser console (F12) for errors

### **404 Errors:**
- Ensure `.htaccess` is in the root directory
- Check if mod_rewrite is enabled on your server
- Contact hosting support if needed

### **Assets Not Loading:**
- Verify `assets` folder is uploaded completely
- Check file permissions (644 for files)
- Clear browser cache

## 📞 **Server Requirements**

Your web server needs:
- ✅ **HTML/CSS/JavaScript** support (all servers have this)
- ✅ **Apache with mod_rewrite** OR **Nginx**
- ✅ **HTTPS support** (recommended)
- ❌ **No PHP required**
- ❌ **No database required**
- ❌ **No special server software**

## 🎮 **What You Get**

After deployment:
- Professional casino interface
- Working game mechanics
- User authentication (demo mode)
- Admin panel access
- Mobile-responsive design
- Fast loading times

## 💡 **Pro Tips**

1. **Test locally first**: Run `npm run build && npm run preview`
2. **Backup original**: Keep a copy of your `dist` folder
3. **Monitor performance**: Check loading times after upload
4. **Update easily**: Rebuild and re-upload when making changes

---

**🎯 This method works with ANY web hosting that supports static files!**