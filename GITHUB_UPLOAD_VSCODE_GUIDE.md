# 🚀 Upload Project to GitHub using Visual Studio Code

## 📋 **Prerequisites**

Before starting, make sure you have:
- ✅ **Visual Studio Code** installed
- ✅ **Git** installed on your computer - [Download here](https://git-scm.com/)
- ✅ **GitHub account** - [Sign up here](https://github.com) if you don't have one

## 🎯 **Method 1: Using VS Code Built-in Git (Easiest)**

### **Step 1: Open Your Project in VS Code**
1. **Open Visual Studio Code**
2. **File** → **Open Folder**
3. **Select your aviator-casino project folder**

### **Step 2: Initialize Git Repository**
1. **Open Terminal** in VS Code: `Ctrl + ` (backtick) or **Terminal** → **New Terminal**
2. **Run this command**:
   ```bash
   git init
   ```

### **Step 3: Create .gitignore File**
1. **Right-click** in VS Code file explorer
2. **New File** → name it `.gitignore`
3. **Add this content**:
   ```
   node_modules/
   dist/
   .env
   .env.local
   .env.production
   .DS_Store
   Thumbs.db
   *.log
   ```

### **Step 4: Stage All Files**
1. **Click the Source Control icon** (looks like a branch) in the left sidebar
2. **You'll see all your files** listed under "Changes"
3. **Click the "+" button** next to "Changes" to stage all files
4. **Or stage individual files** by clicking "+" next to each file

### **Step 5: Make Initial Commit**
1. **In the message box** at the top, type: `Initial commit - Aviator Casino`
2. **Click the checkmark** (✓) or press `Ctrl + Enter`

### **Step 6: Create GitHub Repository**
1. **Go to [github.com](https://github.com)** and login
2. **Click the "+" icon** → **"New repository"**
3. **Repository name**: `aviator-casino`
4. **Description**: `Aviator Casino Game Platform`
5. **Set to Public** (free option)
6. **DON'T check** "Add a README file" (we already have files)
7. **Click "Create repository"**

### **Step 7: Connect to GitHub**
1. **Copy the repository URL** from GitHub (looks like: `https://github.com/yourusername/aviator-casino.git`)
2. **In VS Code terminal**, run:
   ```bash
   git remote add origin https://github.com/yourusername/aviator-casino.git
   git branch -M main
   git push -u origin main
   ```

## 🎯 **Method 2: Using VS Code GitHub Extension**

### **Step 1: Install GitHub Extension**
1. **Click Extensions** icon in VS Code (square icon in sidebar)
2. **Search for "GitHub"**
3. **Install "GitHub Pull Requests and Issues"** by GitHub

### **Step 2: Sign in to GitHub**
1. **Press `Ctrl + Shift + P`** to open command palette
2. **Type**: `GitHub: Sign in`
3. **Follow the authentication process**

### **Step 3: Publish to GitHub**
1. **Open Source Control** panel (Ctrl + Shift + G)
2. **Click "Publish to GitHub"**
3. **Choose repository name**: `aviator-casino`
4. **Select "Public repository"**
5. **VS Code will automatically** create the repo and push your code

## ✅ **Verification Steps**

After uploading, verify everything worked:

### **Check GitHub Repository**
1. **Go to your GitHub repository**
2. **You should see all your files**:
   - ✅ `src/` folder with all components
   - ✅ `public/` folder with assets
   - ✅ `package.json`
   - ✅ `index.html`
   - ✅ `vite.config.ts`
   - ✅ And all other project files

### **Test Clone (Optional)**
```bash
# In a different folder, test cloning
git clone https://github.com/yourusername/aviator-casino.git
cd aviator-casino
npm install
npm run dev
```

## 🔄 **Making Future Updates**

Once your project is on GitHub, here's how to update it:

### **Method A: Using VS Code Interface**
1. **Make changes** to your files
2. **Go to Source Control** panel
3. **Stage changes** (click + next to files)
4. **Write commit message**
5. **Click checkmark** to commit
6. **Click "Sync Changes"** or the sync icon

### **Method B: Using Terminal Commands**
```bash
# Stage all changes
git add .

# Commit with message
git commit -m "Update game features"

# Push to GitHub
git push
```

## 🚨 **Common Issues & Solutions**

### **Issue: "Git not found"**
**Solution**: Install Git from [git-scm.com](https://git-scm.com/)

### **Issue: Authentication failed**
**Solution**: 
- Use GitHub Personal Access Token instead of password
- Go to GitHub → Settings → Developer settings → Personal access tokens

### **Issue: Large files error**
**Solution**: Make sure `.gitignore` excludes `node_modules/` and `dist/`

### **Issue: Repository already exists**
**Solution**: Either delete the existing repo or use a different name

## 🎯 **Pro Tips**

1. **Always use .gitignore** - Never commit `node_modules/` or build files
2. **Write meaningful commit messages** - Describe what you changed
3. **Commit frequently** - Small, focused commits are better
4. **Pull before pushing** - If working with others, always pull first

## 🎉 **Success!**

Once uploaded, your Aviator Casino will be:
- ✅ **Safely stored** on GitHub
- ✅ **Version controlled** - track all changes
- ✅ **Ready for deployment** to Vercel, Netlify, etc.
- ✅ **Shareable** with others
- ✅ **Backed up** in the cloud

## 🚀 **Next Steps**

After uploading to GitHub:
1. **Deploy to Vercel** for live hosting
2. **Share the GitHub link** with others
3. **Continue developing** with version control
4. **Create branches** for new features

---

**🎮 Your Aviator Casino is now safely stored on GitHub and ready for the world!**