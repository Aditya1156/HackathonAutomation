# 🔥 Firebase Setup Instructions for Your Project

## ✅ Your Firebase Project: `routinetrack-70k62`

### Configuration Status: ✅ COMPLETE
- Project ID: `routinetrack-70k62`
- `.env` file: ✅ Created with your credentials
- `.gitignore`: ✅ Updated to protect `.env`

---

## 🚀 Next Steps (Do These Now!)

### Step 1: Enable Firestore Database (3 minutes)

1. Go to: https://console.firebase.google.com/project/routinetrack-70k62/firestore
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select your preferred region (closest to India: `asia-south1` or `asia-southeast1`)
5. Click **"Enable"**

### Step 2: Enable Authentication (2 minutes)

1. Go to: https://console.firebase.google.com/project/routinetrack-70k62/authentication
2. Click **"Get started"**
3. Click **"Email/Password"**
4. Toggle **"Enable"** switch
5. Click **"Save"**

### Step 3: Apply Firestore Security Rules (2 minutes)

1. Go to: https://console.firebase.google.com/project/routinetrack-70k62/firestore/rules
2. Replace all content with the rules below
3. Click **"Publish"**

**Copy these rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isJudge() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'judge';
    }
    
    function isStudent() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'student';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if request.auth.uid == userId || isAdmin();
      allow delete: if isAdmin();
    }

    // Teams collection
    match /teams/{teamId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isAdmin() || 
                       (isStudent() && 
                        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.teamId == teamId);
      allow delete: if isAdmin();
    }

    // Judges collection
    match /judges/{judgeId} {
      allow read: if isSignedIn();
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // Evaluations collection
    match /evaluations/{evalId} {
      allow read: if isSignedIn();
      allow create: if isJudge() || isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
  }
}
```

### Step 4: Create Admin User (3 minutes)

**Method 1: Via Firebase Console**
1. Go to: https://console.firebase.google.com/project/routinetrack-70k62/authentication/users
2. Click **"Add user"**
3. Email: `admin@hackathon.com`
4. Password: `Admin@123456` (change this later!)
5. Click **"Add user"**
6. **Copy the User UID** (you'll need this!)

**Method 2: Create Admin Profile in Firestore**
1. Go to: https://console.firebase.google.com/project/routinetrack-70k62/firestore/data
2. Click **"Start collection"**
3. Collection ID: `users`
4. Click **"Next"**
5. Document ID: **[Paste the User UID from step 6 above]**
6. Add these fields:
   - `role` (string): `admin`
   - `email` (string): `admin@hackathon.com`
   - `displayName` (string): `Admin`
   - `createdAt` (timestamp): Click "Use server timestamp"
   - `lastLogin` (timestamp): Click "Use server timestamp"
7. Click **"Save"**

### Step 5: Enable Storage (Optional - for profile pictures)

1. Go to: https://console.firebase.google.com/project/routinetrack-70k62/storage
2. Click **"Get started"**
3. Use default security rules
4. Click **"Done"**

---

## ✅ Verification Checklist

After completing the steps above, verify:

- [ ] Firestore Database is enabled
- [ ] Authentication (Email/Password) is enabled
- [ ] Security rules are published
- [ ] Admin user is created in Authentication
- [ ] Admin user document exists in `users` collection
- [ ] Storage is enabled (optional)

---

## 🧪 Test Your Setup

### Test 1: Run the Dev Server

```bash
npm run dev
```

Should start without errors!

### Test 2: Check Firebase Connection

Open browser console and check for any Firebase errors. You should see:
- ✅ No "Firebase not initialized" errors
- ✅ No "Permission denied" errors

### Test 3: Test Admin Login

1. Go to your app
2. Try to login with:
   - Email: `admin@hackathon.com`
   - Password: `Admin@123456`

---

## 📊 Your Firebase Project Dashboard

**Quick Links:**
- **Console**: https://console.firebase.google.com/project/routinetrack-70k62
- **Firestore**: https://console.firebase.google.com/project/routinetrack-70k62/firestore
- **Authentication**: https://console.firebase.google.com/project/routinetrack-70k62/authentication
- **Storage**: https://console.firebase.google.com/project/routinetrack-70k62/storage
- **Settings**: https://console.firebase.google.com/project/routinetrack-70k62/settings/general

---

## 🎯 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔐 Security Notes

✅ `.env` file is added to `.gitignore` - Your credentials are safe!
✅ Never commit `.env` to GitHub
✅ For production, use Firebase App Check for additional security

---

## 💡 What's Next?

Once you complete these steps:
1. ✅ Your database is ready
2. ✅ Authentication works
3. ✅ Admin can login
4. ✅ Ready to integrate Firebase in components!

---

## 🆘 Troubleshooting

**Issue**: "Permission denied" errors
**Fix**: Make sure you published the Firestore rules

**Issue**: "User not found" when logging in
**Fix**: Make sure you created both the Auth user AND the Firestore user document

**Issue**: Environment variables not loading
**Fix**: Restart dev server after creating `.env`

---

## 📞 Need Help?

- Firebase Console: https://console.firebase.google.com/
- Firebase Docs: https://firebase.google.com/docs
- Firestore Guide: https://firebase.google.com/docs/firestore

---

**Status**: ⏳ Waiting for you to enable Firestore + Auth  
**Time Required**: ~10 minutes  
**Next**: Test Firebase integration!

---

*Once you complete these steps, come back and I'll help integrate Firebase into your components!* 🚀
