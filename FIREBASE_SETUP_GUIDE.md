# 🔥 Firebase Integration Guide

## Overview

Hackathon Fusion now uses **Firebase** as its backend, providing:
- **Firestore Database** - Real-time NoSQL database for teams, judges, and evaluations
- **Firebase Authentication** - Secure user authentication for students, admins, and judges
- **Firebase Storage** - File storage for profile pictures and documents

---

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Firebase Account** (free tier is sufficient)
4. **Google Account** for Firebase

---

## 🚀 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `hackathon-fusion` (or your choice)
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Register Web App

1. In your Firebase project, click the **Web icon** (</>)
2. Enter app nickname: `Hackathon Fusion Web`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. **Copy the Firebase configuration** - you'll need this!

### Step 3: Enable Firestore Database

1. In Firebase Console, go to **"Build" > "Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select your region (closest to your users)
5. Click **"Enable"**

### Step 4: Set Up Authentication

1. Go to **"Build" > "Authentication"**
2. Click **"Get started"**
3. Enable **"Email/Password"** sign-in method
4. Click **"Save"**

### Step 5: Enable Storage (Optional)

1. Go to **"Build" > "Storage"**
2. Click **"Get started"**
3. Use default rules (Start in test mode)
4. Click **"Done"**

---

## 🔧 Project Configuration

### Step 1: Install Dependencies

```bash
npm install firebase
```

✅ Already done!

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Firebase configuration in `.env`:
```env
# Get these from Firebase Console > Project Settings > Your apps > SDK setup
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional - Google Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional - GitHub Token
VITE_GITHUB_TOKEN=your_github_token_here
```

### Step 3: Firestore Security Rules

In Firebase Console > Firestore Database > Rules, paste these rules:

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
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isOwner(userId) || isAdmin();
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
      allow update: if isAdmin() || isOwner(resource.data.userId);
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

### Step 4: Storage Security Rules (if using)

In Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /team-logos/{teamId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /documents/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📚 Firestore Database Structure

### Collections

```
hackathon-fusion/
├── users/
│   └── {userId}/
│       ├── uid: string
│       ├── email: string
│       ├── displayName: string
│       ├── role: 'student' | 'admin' | 'judge' | 'mentor'
│       ├── teamId?: string
│       ├── judgeId?: string
│       ├── createdAt: timestamp
│       └── lastLogin: timestamp
│
├── teams/
│   └── {teamId}/
│       ├── name: string
│       ├── leader: TeamMember
│       ├── members: TeamMember[]
│       ├── track: string
│       ├── collegeName: string
│       ├── projectSynopsis: string
│       ├── githubRepo: string
│       ├── qrCodeUrl: string
│       ├── status: 'Registered' | 'Checked-in' | 'Verified'
│       ├── submission?: Submission
│       ├── registeredAt: timestamp
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── judges/
│   └── {judgeId}/
│       ├── name: string
│       ├── email: string
│       ├── designation: string
│       ├── organization: string
│       ├── expertise: string[]
│       ├── assignedRounds: JudgingRound[]
│       ├── assignedTeams?: string[]
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
└── evaluations/
    └── {evaluationId}/
        ├── judgeId: string
        ├── judgeName: string
        ├── teamId: string
        ├── round: 'Round 1' | 'Round 2' | 'Final'
        ├── criteria: {
        │   ├── progress: number (0-10)
        │   ├── ui: number (0-10)
        │   ├── presentation: number (0-10)
        │   ├── idea: number (0-10)
        │   └── implementation: number (0-10)
        │   }
        ├── comments?: string
        ├── totalScore: number
        ├── evaluatedAt: string
        └── createdAt: timestamp
```

---

## 🔐 Authentication Flow

### For Students (Participants)

1. **Register**:
   - Create team in registration form
   - Team leader gets an email/password
   - Team ID is linked to user profile

2. **Login**:
   - Use email and password
   - System loads team data using `teamId`

### For Admins

1. **Manual Creation**:
   - Create admin user in Firebase Console
   - Go to Authentication > Users > Add user
   - Email: `admin@hackathon.com`
   - Password: Set strong password
   - Go to Firestore > users collection
   - Add document with admin role

### For Judges

1. **Admin Creates Judge**:
   - Admin creates judge profile in Jury section
   - Judge receives email with credentials
   - Judge can login and start evaluating

---

## 📝 Firebase Service Usage

### Teams Service

```typescript
import {
  createTeam,
  getTeamById,
  getAllTeams,
  updateTeam,
  submitProject,
  getTeamByGithubUsername
} from './services/firebaseTeamService';

// Create new team
const teamId = await createTeam({
  name: 'Code Wizards',
  leader: {...},
  members: [...],
  track: 'AI/ML',
  // ... other fields
});

// Get team
const team = await getTeamById(teamId);

// Update team
await updateTeam(teamId, { status: 'Checked-in' });

// Submit project
await submitProject(teamId, {
  link: 'https://github.com/...',
  description: 'Our project...'
});
```

### Judging Service

```typescript
import {
  createJudge,
  submitEvaluation,
  getTeamEvaluations,
  getLeaderboard
} from './services/firebaseJudgingService';

// Create judge
const judgeId = await createJudge({
  name: 'Dr. Smith',
  email: 'smith@example.com',
  designation: 'CTO',
  organization: 'TechCorp',
  expertise: ['AI', 'Cloud'],
  assignedRounds: ['Round 1', 'Final']
});

// Submit evaluation
await submitEvaluation({
  judgeId,
  judgeName: 'Dr. Smith',
  teamId,
  round: 'Round 1',
  criteria: {
    progress: 8,
    ui: 7,
    presentation: 9,
    idea: 8,
    implementation: 8
  },
  totalScore: 40,
  comments: 'Great work!'
});

// Get leaderboard
const leaderboard = await getLeaderboard('Round 1');
```

### Authentication Service

```typescript
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} from './services/firebaseAuthService';

// Register new user
const userProfile = await registerUser(
  'user@example.com',
  'password123',
  'John Doe',
  'student',
  { teamId: 'team123' }
);

// Login
const user = await loginUser('user@example.com', 'password123');

// Logout
await logoutUser();

// Check current user
const currentUser = await getCurrentUser();
```

---

## 🧪 Testing Firebase Integration

### Step 1: Create Admin User

```bash
# In Firebase Console:
1. Go to Authentication > Users
2. Click "Add user"
3. Email: admin@hackathon.com
4. Password: Admin@123
5. Add User

# Then in Firestore:
1. Go to Firestore Database
2. Click "Start collection"
3. Collection ID: users
4. Document ID: [the UID from auth]
5. Fields:
   - role: "admin"
   - email: "admin@hackathon.com"
   - displayName: "Admin"
   - createdAt: [timestamp]
```

### Step 2: Test Registration

1. Run the app: `npm run dev`
2. Go to Registration page
3. Fill in team details
4. Submit
5. Check Firestore > teams collection

### Step 3: Test Login

1. Go to Student Login
2. Enter GitHub username (from registered team)
3. Should load team dashboard

---

## 🚨 Common Issues & Solutions

### Issue 1: "Permission Denied" Errors

**Solution**: Check Firestore rules, ensure user is authenticated

### Issue 2: Environment Variables Not Loading

**Solution**: 
- Restart dev server after changing `.env`
- Ensure variables start with `VITE_`

### Issue 3: Firebase Not Initialized

**Solution**: Check `config/firebase.ts` is imported before using services

### Issue 4: Timestamp Errors

**Solution**: Use `serverTimestamp()` from Firestore for timestamps

---

## 📊 Monitoring & Analytics

### Firebase Console Dashboards

1. **Authentication Dashboard**:
   - View active users
   - Monitor login attempts
   - Track user growth

2. **Firestore Dashboard**:
   - Monitor read/write operations
   - Check database size
   - View query performance

3. **Usage Dashboard**:
   - Track API usage
   - Monitor quota limits
   - View billing (if on paid plan)

---

## 🔒 Security Best Practices

1. ✅ **Never commit `.env` file** - Added to `.gitignore`
2. ✅ **Use Firestore security rules** - Provided above
3. ✅ **Validate data on client and server**
4. ✅ **Use HTTPS only** (Firebase handles this)
5. ✅ **Enable Firebase App Check** (for production)
6. ✅ **Regular security audits**

---

## 📈 Scaling Considerations

### Free Tier Limits

- **Firestore**: 50K reads/day, 20K writes/day
- **Auth**: Unlimited users
- **Storage**: 5GB

### When to Upgrade

- Large hackathons (500+ teams)
- Multiple concurrent events
- Heavy file uploads

### Optimization Tips

1. Use pagination for large lists
2. Implement caching
3. Optimize queries with indexes
4. Use batch operations

---

## 🎓 Next Steps

1. ✅ Firebase installed and configured
2. ✅ Firestore database structure defined
3. ✅ Authentication system ready
4. ✅ Security rules in place
5. 🔄 **Update components to use Firebase** (Next phase)
6. 🔄 **Deploy to production** (Final phase)

---

## 📞 Support

- **Firebase Docs**: https://firebase.google.com/docs
- **Firestore Guide**: https://firebase.google.com/docs/firestore
- **Auth Guide**: https://firebase.google.com/docs/auth

---

**Status**: ✅ Backend Infrastructure Ready  
**Last Updated**: November 11, 2025
