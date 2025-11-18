# 🔥 Firestore Database Setup Guide

## Step 1: Open Firebase Console

1. Go to: https://console.firebase.google.com/project/school-project-87100
2. Login with your Google account

## Step 2: Create Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click the **"Create database"** button
3. Choose **"Start in test mode"** (this allows read/write without authentication for testing)
   - ⚠️ Note: Test mode is only for development. Change to production rules later!
4. Choose your **location** (select the closest region to you):
   - For Ukraine: `europe-west3` (Frankfurt) or `europe-west1` (Belgium)
5. Click **"Enable"**
6. Wait 1-2 minutes for the database to be created

## Step 3: Configure Security Rules

After the database is created:

1. Go to the **"Rules"** tab in Firestore Database
2. Replace the existing rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Allow anyone to create and read sessions
    match /sessions/{sessionId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      allow delete: if request.auth != null;
    }

    // Allow anyone to create results
    match /results/{resultId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      allow delete: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 4: Test the Setup

1. Go to your app: http://localhost:3321/
2. Enter a player name and select class 2
3. Play one of the games
4. Check the browser console (F12) for any errors
5. Go back to Firebase Console > Firestore Database
6. You should see two collections appear:
   - `sessions` - with player session data
   - `results` - with individual game results

## Step 5: Setup Authentication (for Admin Panel)

1. In Firebase Console, go to **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Enable **"Email/Password"** sign-in method:
   - Click on "Email/Password"
   - Toggle the first switch to "Enable"
   - Click "Save"
4. Go to the **"Users"** tab
5. Click **"Add user"**
6. Create admin account:
   - Email: `admin@school.com` (or your email)
   - Password: `admin123` (use a strong password!)
7. Click **"Add user"**

## Step 6: Test Admin Panel

1. Go to: http://localhost:3321/admin
2. Login with the admin credentials you created
3. You should see the admin dashboard
4. If you played games in Step 4, you'll see the data

## Troubleshooting

### Problem: "Permission denied" errors
**Solution**: Check that your Firestore rules are published correctly (Step 3)

### Problem: Admin panel shows "No data"
**Solution**:
- Play some games first to generate data
- Check browser console (F12) for errors
- Verify Firestore collections exist in Firebase Console

### Problem: Login doesn't work
**Solution**:
- Verify Authentication is enabled in Firebase Console
- Check that you created an admin user
- Clear browser cache and try again

### Problem: Database queries are slow
**Solution**:
- This is normal for first-time setup
- Firestore creates indexes automatically
- Performance improves after first queries

## Database Structure

Once games are played, your Firestore will have this structure:

```
firestore/
├── sessions/
│   ├── {sessionId}/
│   │   ├── playerName: "Андрій"
│   │   ├── playerClass: 2
│   │   ├── startTime: timestamp
│   │   ├── totalScore: 120
│   │   ├── maxStreak: 5
│   │   └── achievementsUnlocked: []
│   └── ...
└── results/
    ├── {resultId}/
    │   ├── sessionId: "{sessionId}"
    │   ├── gameType: "guess"
    │   ├── points: 15
    │   ├── score: 15
    │   └── timestamp: timestamp
    └── ...
```

## Next Steps

Once everything works:

1. **Update Security Rules** for production (more strict)
2. **Add indexes** for better query performance
3. **Monitor usage** in Firebase Console > Firestore Database > Usage tab
4. **Backup data** regularly using Firebase Console > Firestore Database > Import/Export

## Support

If you encounter issues:
- Check browser console (F12) for error messages
- Check Firebase Console > Functions logs
- Verify all setup steps were completed
