# 🚀 cPanel Web Hosting Deployment Guide

## 📁 Files to Upload

Upload **ONLY** the contents of the `dist` folder to your cPanel hosting:

### Required Files:
```
public_html/
├── index.html
├── .htaccess
├── aviator.png
├── _redirects
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
└── [any other files from dist folder]
```

## 🔧 Step-by-Step cPanel Upload Instructions

### Step 1: Access cPanel File Manager
1. Login to your cPanel account
2. Find and click **"File Manager"**
3. Navigate to **"public_html"** folder
4. Delete any existing files if this is a fresh install

### Step 2: Upload Files
1. Click **"Upload"** button in File Manager
2. Select **ALL files** from the `dist` folder (not the dist folder itself)
3. Upload them to the `public_html` directory
4. Wait for upload to complete

### Step 3: Extract/Move Files (if needed)
1. If files are in a zip, extract them
2. Make sure all files are directly in `public_html/`, not in a subfolder
3. Verify `.htaccess` file is present (enable "Show Hidden Files" if needed)

### Step 4: Set Permissions
1. Select all uploaded files
2. Right-click → **"Change Permissions"**
3. Set folders to **755** and files to **644**
4. Apply to all files and subdirectories

## ✅ Verification Checklist

After upload, verify:
- [ ] `index.html` is in `public_html/`
- [ ] `.htaccess` file is present and visible
- [ ] `assets/` folder contains CSS and JS files
- [ ] `aviator.png` favicon is uploaded
- [ ] All files have correct permissions

## 🌐 Access Your Site

Visit your domain: `https://yourdomain.com`
- Should load the Aviator Casino game
- No need to add `/index.html` to the URL
- Should work on all pages and routes

## 🔧 Troubleshooting

### Blank Page Issues:
1. Check browser console (F12) for errors
2. Verify all files uploaded correctly
3. Check if `.htaccess` is working
4. Clear browser cache

### 404 Errors:
1. Ensure `.htaccess` file is in `public_html/`
2. Check if mod_rewrite is enabled on your server
3. Contact hosting support if needed

### Assets Not Loading:
1. Verify `assets/` folder uploaded completely
2. Check file permissions (should be 644)
3. Ensure no files are corrupted during upload

## 📞 Support

If you encounter issues:
1. Check cPanel error logs
2. Contact your hosting provider
3. Verify your hosting supports:
   - PHP (any version)
   - mod_rewrite (for .htaccess)
   - Static file serving

---

**Note:** Only upload the contents of the `dist` folder, never upload the entire project folder to public_html.