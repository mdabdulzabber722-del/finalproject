# 🚀 Upload to GitHub using Visual Studio Code

## 📋 **Prerequisites**

Make sure you have:
- ✅ **Visual Studio Code** installed
- ✅ **Git** installed - [Download here](https://git-scm.com/)
- ✅ **GitHub account** - [Sign up here](https://github.com)

## 🎯 **Step-by-Step Guide**

### **Step 1: Open Project in VS Code**
1. **Open Visual Studio Code**
2. **File** → **Open Folder**
3. **Select your aviator-casino project folder**

### **Step 2: Initialize Git Repository**
1. **Open Terminal** in VS Code: Press `Ctrl + ` (backtick)
2. **Run this command**:
   ```bash
   git init
   ```

### **Step 3: Configure Git (First Time Only)**
If you haven't used Git before, set your identity:
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

### **Step 4: Create .gitignore File**
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

### **Step 5: Stage All Files**
1. **Click the Source Control icon** (branch icon) in left sidebar
2. **You'll see all files** under "Changes"
3. **Click the "+" button** next to "Changes" to stage all files

### **Step 6: Make Initial Commit**
1. **In the message box**, type: `Initial commit - Aviator Casino with Firebase`
2. **Click the checkmark** (✓) or press `Ctrl + Enter`

### **Step 7: Create GitHub Repository**
1. **Go to [github.com](https://github.com)** and login
2. **Click the "+" icon** → **"New repository"**
3. **Repository name**: `aviator-casino`
4. **Description**: `Aviator Casino Game with Firebase Database`
5. **Set to Public** (free option)
6. **DON'T check** "Add a README file"
7. **Click "Create repository"**

### **Step 8: Connect to GitHub**
1. **Copy the repository URL** from GitHub
2. **In VS Code terminal**, run:
   ```bash
   git remote add origin https://github.com/yourusername/aviator-casino.git
   git branch -M main
   git push -u origin main
   ```

## ✅ **Verification**

After upload, check:
- [ ] All files visible on GitHub
- [ ] No `.env` file uploaded (should be ignored)
- [ ] Repository shows your project structure

## 🔄 **Future Updates**

To update your GitHub repository:
1. **Make changes** to your code
2. **Go to Source Control** in VS Code
3. **Stage changes** (+ button)
4. **Write commit message**
5. **Click checkmark** to commit
6. **Click "Sync Changes"** to push to GitHub

## 🚨 **Common Issues**

### **"Git not found"**
- Install Git from [git-scm.com](https://git-scm.com/)

### **Authentication failed**
- Use GitHub Personal Access Token instead of password
- Go to GitHub → Settings → Developer settings → Personal access tokens

### **Repository already exists**
- Delete existing repo or use different name

## 🎉 **Success!**

Your Aviator Casino is now on GitHub and ready for deployment!

**Next**: Deploy to Vercel with Firebase environment variables.