# 🔥 Firebase Setup & Deployment Guide

This guide will walk you through setting up Firebase for your educational games app and deploying it to Firebase Hosting.

## 📋 Prerequisites

- Google Account
- Node.js installed on your computer

---

## Part 1: Firebase Console Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `educational-games` (or any name you prefer)
4. Click **Continue**
5. Disable Google Analytics (optional for this project)
6. Click **Create project**
7. Wait for the project to be created, then click **Continue**

### 2. Register Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Register app nickname: `Educational Games App`
3. **Check** the box "Also set up Firebase Hosting"
4. Click **Register app**
5. You'll see the Firebase configuration code - **KEEP THIS PAGE OPEN** (you'll need it in step 4)

### 3. Enable Firestore Database

1. In the left sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll set up rules next)
4. Select your **Cloud Firestore location** (choose closest to your region)
5. Click **Enable**

#### Set Firestore Security Rules:

1. Click the **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all sessions and results
    match /sessions/{sessionId} {
      allow read, write: if true;
    }

    match /results/{resultId} {
      allow read, write: if true;
    }

    // Note: In production, you should restrict write access
    // to authenticated users only or use Cloud Functions
  }
}
```

3. Click **Publish**

**⚠️ Security Note:** These rules allow anyone to read/write data. For production, you should:
- Restrict write access to authenticated users
- Use Firebase Cloud Functions to validate data
- Add stricter read permissions

### 4. Enable Authentication

1. In the left sidebar, click **Build** → **Authentication**
2. Click **Get started**
3. Click on **Email/Password** provider
4. **Enable** the Email/Password toggle
5. Click **Save**

#### Create Admin User:

1. Go to **Authentication** → **Users** tab
2. Click **Add user**
3. Enter your admin email: `admin@example.com` (use your real email)
4. Enter a strong password
5. Click **Add user**

**💡 Remember these credentials - you'll use them to login to the admin panel!**

---

## Part 2: Configure Your App

### 5. Update Firebase Config

1. Go back to the Firebase Console tab with your config code (from Step 2)
2. Copy the `firebaseConfig` object values
3. Open the file: `src/firebase/config.js`
4. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**Example:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1a2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q",
  authDomain: "educational-games-abc123.firebaseapp.com",
  projectId: "educational-games-abc123",
  storageBucket: "educational-games-abc123.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

5. Save the file

---

## Part 3: Local Testing

### 6. Test Locally

```bash
# Make sure you're in the project directory
cd дитячі-ігри

# Start the development server
npm run dev
```

The app should start at `http://localhost:5173`

### 7. Test the App

1. Open `http://localhost:5173` in your browser
2. Enter a student name and select a class
3. Play a game (like the Debug game)
4. Check your browser console for "Session created: [session-id]"

### 8. Verify Database

1. Go to Firebase Console → Firestore Database
2. You should see:
   - `sessions` collection with your test session
   - `results` collection with game results

### 9. Test Admin Panel

1. Go to `http://localhost:5173/admin`
2. Login with your admin credentials (from Step 4)
3. You should see the admin dashboard with your test data

**✅ If everything works, you're ready to deploy!**

---

## Part 4: Deploy to Firebase Hosting

### 10. Install Firebase CLI

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login
```

This will open a browser window for you to login with your Google account.

### 11. Initialize Firebase Hosting

```bash
# In your project directory
firebase init hosting
```

You'll be asked several questions:

1. **"Please select an option:"** → Choose **"Use an existing project"**
2. **"Select a default Firebase project:"** → Select your project (`educational-games`)
3. **"What do you want to use as your public directory?"** → Type: `dist`
4. **"Configure as a single-page app?"** → Type: `y` (yes)
5. **"Set up automatic builds and deploys with GitHub?"** → Type: `n` (no)
6. **"File dist/index.html already exists. Overwrite?"** → Type: `n` (no)

### 12. Build Your App

```bash
# Build the production version
npm run build
```

This creates an optimized version in the `dist` folder.

### 13. Deploy to Firebase

```bash
# Deploy to Firebase Hosting
firebase deploy
```

Wait for the deployment to complete. You'll see output like:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/educational-games-abc123/overview
Hosting URL: https://educational-games-abc123.web.app
```

**🎉 Your app is now live!**

---

## Part 5: Accessing Your Deployed App

### 14. Use Your App

**Student Access:**
- URL: `https://your-project-id.web.app`
- Students visit this URL to play games
- All data is automatically saved to Firebase

**Admin Access:**
- URL: `https://your-project-id.web.app/admin`
- Login with your admin credentials
- View all student sessions, statistics, and analytics
- Export data to CSV

---

## 📊 How to Use the Admin Panel

### Overview Tab
- See total students, sessions, games played
- View average scores
- See recent sessions

### Sessions Tab
- View all game sessions
- Search by student name
- Filter by class (2 or 4)
- Export all data to CSV

### Students Tab
- See list of all students who played
- Click on a student to see their detailed stats
- View their recent sessions and achievements

### Analytics Tab
- See which games are most played
- View distribution by class level
- Analyze game popularity

---

## 🔄 Updating Your App

When you make changes to your app:

```bash
# 1. Test locally
npm run dev

# 2. Build the production version
npm run build

# 3. Deploy the update
firebase deploy
```

---

## 🛠️ Troubleshooting

### Problem: "Firebase not defined" error

**Solution:** Make sure you updated `src/firebase/config.js` with your actual Firebase config values.

### Problem: Can't login to admin panel

**Solution:**
1. Check Firebase Console → Authentication → Users
2. Make sure you created an admin user
3. Try resetting the password if needed

### Problem: Data not saving

**Solution:**
1. Check browser console for errors
2. Verify Firestore rules are published
3. Check Firebase Console → Firestore Database to see if collections exist

### Problem: Deployment fails

**Solution:**
```bash
# Clear cache and rebuild
rm -rf dist
rm -rf node_modules
npm install
npm run build
firebase deploy
```

### Problem: "Permission denied" in Firestore

**Solution:**
1. Go to Firestore Database → Rules
2. Make sure the rules allow read/write (see Step 3)
3. Click **Publish**

---

## 📱 Bonus: Custom Domain (Optional)

If you want to use your own domain:

1. Go to Firebase Console → Hosting
2. Click **Add custom domain**
3. Enter your domain name
4. Follow the DNS configuration instructions
5. Wait for SSL certificate to be provisioned (can take up to 24 hours)

---

## 🔒 Security Best Practices

For production use, consider:

1. **Stricter Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sessions/{sessionId} {
      allow read: if true;
      allow write: if request.auth != null;  // Only authenticated users
    }

    match /results/{resultId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

2. **Environment Variables:**
   - Store Firebase config in environment variables
   - Use `.env` files (not committed to Git)

3. **Rate Limiting:**
   - Use Firebase App Check to prevent abuse
   - Monitor usage in Firebase Console

---

## 💰 Cost Estimates (Firebase Free Tier)

Firebase's free "Spark" plan includes:
- ✅ **Firestore:** 50K reads/day, 20K writes/day
- ✅ **Hosting:** 10 GB storage, 360 MB/day transfer
- ✅ **Authentication:** Unlimited users

**For a typical school class (30 students):**
- Daily writes: ~300-500 (well under 20K limit)
- Daily reads: ~1000-2000 (well under 50K limit)
- **Cost: $0** (stays on free tier)

---

## 📞 Support

If you run into issues:

1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Check browser console for error messages
3. Verify all steps in this guide were completed
4. Check Firebase Console for service status

---

## ✅ Quick Checklist

- [ ] Firebase project created
- [ ] Web app registered
- [ ] Firestore enabled with rules published
- [ ] Authentication enabled
- [ ] Admin user created
- [ ] Firebase config updated in `src/firebase/config.js`
- [ ] App tested locally
- [ ] Admin panel tested locally
- [ ] Firebase CLI installed and logged in
- [ ] Firebase hosting initialized
- [ ] App built (`npm run build`)
- [ ] App deployed (`firebase deploy`)
- [ ] Production app tested
- [ ] Admin credentials saved securely

---

**🎉 Congratulations! Your educational games app is now live with a centralized admin dashboard!**

Students can access it at: `https://your-project-id.web.app`

You can monitor everything at: `https://your-project-id.web.app/admin`
