# Firebase CLI Setup Script
# Run these commands in order

Write-Output "🔥 Firebase CLI Setup for Hackathon Automation"
Write-Output "=============================================="
Write-Output ""

# Check if Firebase CLI is installed
Write-Output "📋 Step 1: Installing Firebase CLI..."
npm install -g firebase-tools

Write-Output ""
Write-Output "✅ Firebase CLI installed!"
Write-Output ""

# Login to Firebase
Write-Output "📋 Step 2: Login to Firebase..."
Write-Output "⚠️  A browser window will open for authentication"
Write-Output ""
firebase login

Write-Output ""
Write-Output "✅ Logged in to Firebase!"
Write-Output ""

# Initialize Firebase in project
Write-Output "📋 Step 3: Initializing Firebase in your project..."
Write-Output ""
Write-Output "⚠️  When prompted, select:"
Write-Output "   - Firestore"
Write-Output "   - Authentication"
Write-Output "   - Storage (optional)"
Write-Output ""
Write-Output "   Use existing project: routinetrack-70k62"
Write-Output ""

# Note: The actual initialization will be interactive
# firebase init

Write-Output ""
Write-Output "🎯 Next: Run 'firebase init' and follow the prompts"
Write-Output ""
