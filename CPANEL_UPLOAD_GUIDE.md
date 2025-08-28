# 🎯 cPanel Upload Guide - Step by Step

## 📋 **Before You Start**

Make sure you have:
- [ ] Built the project (`npm run build`)
- [ ] Access to your cPanel account
- [ ] `dist` folder with all files ready

## 🚀 **Step-by-Step Upload Process**

### **Step 1: Access cPanel File Manager**
1. **Login to cPanel**
2. **Find "File Manager"** (usually in Files section)
3. **Click File Manager**
4. **Navigate to "public_html"** folder

### **Step 2: Clear Existing Files (If Fresh Install)**
1. **Select all existing files** in public_html
2. **Click "Delete"** (if this is a new installation)
3. **Confirm deletion**

### **Step 3: Upload Project Files**
1. **Click "Upload"** button in File Manager
2. **Click "Select File"** or drag files
3. **Select ALL files from your `dist` folder**
   - ⚠️ **Important**: Upload the CONTENTS of dist folder, not the dist folder itself
4. **Wait for upload to complete**

### **Step 4: Verify File Structure**
Your public_html should look like this:
```
public_html/
├── index.html
├── .htaccess          ← Make sure this is visible
├── aviator.png
├── _redirects
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

### **Step 5: Show Hidden Files (Important!)**
1. **Click "Settings"** in File Manager
2. **Check "Show Hidden Files (dotfiles)"**
3. **Verify .htaccess file is visible**

### **Step 6: Set File Permissions**
1. **Select all uploaded files**
2. **Right-click → "Change Permissions"**
3. **Set permissions**:
   - **Files**: 644
   - **Folders**: 755
4. **Apply to all files and subdirectories**

## ✅ **Verification Steps**

### **Test Your Website:**
1. **Visit your domain** (e.g., https://yourdomain.com)
2. **Should load the Aviator Casino homepage**
3. **Test login**: admin@aviator.com / password123
4. **Check all pages work** (no 404 errors)

### **Check Browser Console:**
1. **Press F12** in your browser
2. **Go to Console tab**
3. **Look for any error messages**
4. **Should be minimal or no errors**

## 🚨 **Common Issues & Solutions**

### **Issue: Blank White Page**
**Solutions:**
- Check if `.htaccess` file is uploaded
- Verify all files from `dist` folder are uploaded
- Check browser console for errors
- Clear browser cache

### **Issue: 404 Errors on Navigation**
**Solutions:**
- Ensure `.htaccess` file is in public_html root
- Check if mod_rewrite is enabled (contact hosting support)
- Verify .htaccess content is correct

### **Issue: Assets Not Loading**
**Solutions:**
- Check if `assets` folder uploaded completely
- Verify file permissions (644 for files, 755 for folders)
- Check file paths in browser network tab

### **Issue: Can't See .htaccess File**
**Solutions:**
- Enable "Show Hidden Files" in File Manager settings
- Upload .htaccess file separately if missing
- Check if file was renamed during upload

## 📁 **File Checklist**

Before going live, verify these files exist:
- [ ] ✅ index.html (main page)
- [ ] ✅ .htaccess (routing - CRITICAL!)
- [ ] ✅ aviator.png (favicon)
- [ ] ✅ assets/index-[hash].css (styles)
- [ ] ✅ assets/index-[hash].js (functionality)
- [ ] ✅ _redirects (backup routing)

## 🎯 **Success Indicators**

Your deployment is successful when:
- ✅ Website loads at your domain
- ✅ Login modal appears and works
- ✅ Game interface is fully visible
- ✅ All buttons and features respond
- ✅ No console errors in browser
- ✅ Mobile version works correctly

## 📞 **Need Help?**

If you encounter issues:
1. **Check cPanel error logs** (if available)
2. **Contact your hosting provider** about:
   - mod_rewrite support
   - .htaccess file support
   - Static file serving
3. **Verify hosting requirements** are met

## 💡 **Pro Tips**

- **Backup first**: Always backup existing files before upload
- **Test locally**: Run `npm run preview` to test before upload
- **Use compression**: Some cPanel accounts support file compression
- **Monitor bandwidth**: Check if your hosting has bandwidth limits

---

**🎮 Your Aviator Casino should now be live on your cPanel hosting!**