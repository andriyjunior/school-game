# Firebase Firestore Security Rules Update

## Problem
You're getting "Missing or insufficient permissions" error when trying to access custom tests.

## Solution - Update Firestore Security Rules

### Option 1: Update via Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab at the top
5. Copy the rules from `firestore.rules` file in your project
6. Paste them into the rules editor
7. Click **Publish** button

### Option 2: Update via Firebase CLI

If you have Firebase CLI installed:

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done)
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

## Quick Fix for Development (Temporary)

If you just want to test quickly, you can temporarily use open rules (⚠️ NOT SECURE for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ WARNING: This allows anyone to read/write everything!
    }
  }
}
```

**Remember to change this back to secure rules before going to production!**

## What the New Rules Do

The `firestore.rules` file includes proper security:

### Custom Tests Collection
```javascript
match /customTests/{testId} {
  allow read: if true; // Everyone can read tests
  allow create: if isAdmin();
  allow update: if isAdmin();
  allow delete: if isAdmin();
}
```

### Test Attempts Collection
```javascript
match /testAttempts/{attemptId} {
  allow create: if isAuthenticated(); // Students can create test attempts
  allow read: if isAdmin() || resource.data.playerName == request.auth.token.name;
  allow update: if isAdmin();
  allow delete: if isAdmin();
}
```

### Other Collections
- **sessions**: Students can create, admins can manage all
- **gameResults**: Anyone can create, admins can read all
- **liveSessions**: Everyone can read (to see active sessions), only admins can write
- **admins**: Admin verification collection

## Testing After Update

1. Update the rules in Firebase Console
2. Refresh your app: http://localhost:3321
3. Go to admin panel: http://localhost:3321/admin
4. Try to access the Tests tab
5. You should now be able to see and create tests!

## Troubleshooting

### Still getting permissions error?
1. Make sure you're logged in as admin
2. Check that your admin user exists in the `admins` collection in Firestore
3. Verify the rules were published successfully (green checkmark in Firebase Console)
4. Try refreshing the page or logging out and back in

### Can't create tests?
Make sure you're authenticated and have admin privileges:
- Check `admins` collection has your user's UID
- Verify authentication is working

### Students can't take tests?
The current rules allow everyone to read tests, but for authenticated actions, make sure:
- Authentication is properly set up
- Students are creating sessions correctly
