# 🎮 Aviator Casino Game Platform

A modern, full-featured crash game platform built with React, TypeScript, and Tailwind CSS. Features real-time gameplay, user authentication, admin panel, and multiple payment methods.

## 🔥 Firebase Database Setup (Required)

This project uses Firebase (Google) for data persistence. You need to set up a Firebase project:

1. **Create Firebase Account**: Go to [console.firebase.google.com](https://console.firebase.google.com) and create a free account
2. **Create New Project**: Click "Create a project" and set up your database
3. **Enable Authentication**: Enable Email/Password authentication
4. **Create Firestore Database**: Set up Cloud Firestore in test mode
5. **Get Credentials**: Get your Firebase config from Project Settings
6. **Set Environment Variables**: Create `.env` file with your Firebase credentials

### Environment Variables
Create a `.env` file in your project root with your Firebase config:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## ✨ Features

- 🎯 **Real-time Crash Game** - Watch the multiplier rise and cash out before it crashes
- 👥 **User Authentication** - Secure login/register system
- 💰 **Payment System** - Nagad, bKash, and Binance Pay integration
- 🛡️ **Admin Panel** - Complete user and transaction management
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Beautiful, professional interface
- 📊 **Live Statistics** - Real-time game history and player stats

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

### Installation Steps

1. **Clone or Download the Project**
   ```bash
   # Option 1: Clone with Git
   git clone <repository-url>
   cd aviator-casino
   
   # Option 2: Download ZIP and extract
   # Then navigate to the extracted folder
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - Open your browser and go to: `http://localhost:3000`
   - The Aviator Casino should load immediately!

## 🎯 Demo Accounts

### Admin Account
- **Email**: `admin@aviator.com`
- **Password**: `password123`
- **Features**: Full admin panel access, user management, transaction approval

### Player Account
- **Email**: `player1@example.com`
- **Password**: `password123`
- **Features**: $500 starting balance, game access

### Or Create New Account
- Click "Sign up" to create a new player account
- New accounts get $100 welcome bonus

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Deployment
npm start           # Start production server (for hosting)
```

## 📁 Project Structure

```
aviator-casino/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── admin/          # Admin panel components
│   │   ├── wallet/         # Payment system components
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Main application component
├── public/                 # Static assets
├── dist/                   # Production build (generated)
└── package.json           # Dependencies and scripts
```

## 🎮 How to Play

1. **Login/Register** - Create an account or use demo credentials
2. **Place Bet** - Choose your bet amount and click "Place Bet"
3. **Watch the Multiplier** - See it rise in real-time
4. **Cash Out** - Click "Cash Out" before it crashes to win!
5. **Manage Funds** - Use Deposit/Withdraw for account management

## 💳 Payment Methods

### Supported Methods:
- **Nagad** - Mobile payment (Bangladesh)
- **bKash** - Mobile payment (Bangladesh)  
- **Binance Pay** - Cryptocurrency payment

### How It Works:
1. **Deposits** - Submit payment details, admin approves
2. **Withdrawals** - Request withdrawal, admin processes
3. **Manual System** - All transactions require admin verification

## 👨‍💼 Admin Features

Access admin panel with admin credentials:
- **User Management** - View, ban/unban users
- **Transaction Control** - Approve/reject deposits and withdrawals
- **Statistics Dashboard** - Monitor platform performance
- **Balance Management** - Adjust user balances

## 🚀 Deployment Options

### 1. Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### 2. cPanel Web Hosting
```bash
# Build the project
npm run build

# Upload contents of 'dist' folder to public_html
# Make sure .htaccess file is included
```

### 3. Other Platforms
- **Netlify**: Connect GitHub repo for auto-deployment
- **Vercel**: Import project from GitHub
- **Heroku**: Use Node.js buildpack

## 🔧 Configuration

### Environment Variables (Optional)
Create `.env` file in root directory:
```env
VITE_APP_NAME=Aviator Casino
VITE_API_URL=your-api-url
```

### Customization
- **Colors**: Edit `tailwind.config.js`
- **Game Logic**: Modify `src/hooks/useGameEngine.ts`
- **Payment Methods**: Update `src/components/wallet/`

## 🐛 Troubleshooting

### Common Issues:

**1. Blank Page After Deployment**
- Ensure `.htaccess` file is uploaded (for Apache servers)
- Check browser console for errors (F12)
- Verify all files in `dist` folder are uploaded

**2. npm install Fails**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Ensure Node.js version is 16+

**3. Development Server Won't Start**
- Check if port 3000 is available
- Try `npm run dev -- --port 3001`
- Restart your terminal/command prompt

**4. Build Errors**
- Run `npm run lint` to check for code issues
- Ensure all dependencies are installed
- Check Node.js version compatibility

## 📞 Support

### Getting Help:
1. **Check Browser Console** - Press F12 and look for errors
2. **Review Installation Steps** - Make sure all steps were followed
3. **Check Dependencies** - Ensure Node.js 16+ is installed
4. **Clear Cache** - Try clearing browser cache and cookies

### Technical Requirements:
- **Node.js**: 16.0.0 or higher
- **npm**: 7.0.0 or higher
- **Modern Browser**: Chrome, Firefox, Safari, Edge
- **Internet Connection**: Required for real-time features

## 📄 License

This project is for educational and demonstration purposes. Please ensure compliance with local gambling laws and regulations before deploying in production.

## 🎯 Next Steps

After installation:
1. **Explore the Game** - Try playing with demo accounts
2. **Test Admin Panel** - Login as admin to see management features
3. **Customize Design** - Modify colors and styling to your preference
4. **Deploy Online** - Choose a hosting platform and go live!

---

**🎮 Ready to Play? Start the development server and visit localhost:3000!**