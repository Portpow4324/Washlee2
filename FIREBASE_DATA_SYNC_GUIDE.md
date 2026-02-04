# Firebase Data Sync Setup Guide

## Overview

The admin dashboard now has **real-time data synchronization** with Firebase. This means:

✅ **Customers** - Real-time sync from Firestore  
✅ **Employees** - Real-time sync from Firestore  
✅ **Firebase Auth Users** - Can be converted to employees  

---

## How It Works

### 1. Real-Time Customer & Employee Sync

**Automatic Updates:**
- When a customer signs up → appears immediately in admin dashboard
- When an employee signs up → appears immediately in admin dashboard
- No page refresh needed - Firebase listeners update in real-time

**Location:** Admin Dashboard → User Management section
- Shows current count of both user types
- Live data from `customers` and `employees` Firestore collections

### 2. Firebase Auth User Sync

**Purpose:** Convert Firebase Auth accounts to employee profiles

**Step-by-step:**
1. Go to Admin Dashboard → Data Synchronization section
2. Click "Sync Firebase Auth Users as Employees"
3. System checks all Firebase Auth users
4. Shows count of users without employee profiles
5. These can be converted to employees

---

## Setup Requirements

### Prerequisites

You need **Firebase Admin SDK** credentials in your `.env.local` file:

```bash
# Firebase Admin SDK (for server-side operations)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PROJECT_ID="your-project-id"
```

### Getting Firebase Admin Credentials

1. **Go to Firebase Console**
   - https://console.firebase.google.com
   - Select your project (Washlee)

2. **Create a Service Account Key**
   - Settings (gear icon) → Project Settings
   - Service Accounts tab
   - Click "Generate New Private Key"
   - Save the JSON file

3. **Extract Credentials from JSON**
   ```json
   {
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com",
     "project_id": "your-project-id"
   }
   ```

4. **Add to `.env.local`**
   ```bash
   FIREBASE_PRIVATE_KEY="[paste private_key value]"
   FIREBASE_CLIENT_EMAIL="[paste client_email value]"
   FIREBASE_PROJECT_ID="[paste project_id value]"
   ```

---

## Data Flow

### Customer Signup → Firestore

```
1. User signs up at /auth/signup-customer
   ↓
2. Firebase Auth account created
   ↓
3. createCustomerProfile() called
   ↓
4. Document created in customers/{uid}
   ↓
5. Admin dashboard real-time listener detects change
   ↓
6. Dashboard updates instantly (no refresh needed)
```

### Employee Signup → Firestore

```
1. User signs up at /auth/pro-signup-form
   ↓
2. Firebase Auth account created
   ↓
3. createEmployeeProfile() called
   ↓
4. Document created in employees/{uid}
   ↓
5. Admin dashboard real-time listener detects change
   ↓
6. Dashboard updates instantly (no refresh needed)
```

### Auth User → Employee Sync (Manual)

```
1. Click "Sync Firebase Auth Users" in admin dashboard
   ↓
2. API fetches all Firebase Auth users
   ↓
3. Compares against existing customer profiles
   ↓
4. Shows users that could be employees
   ↓
5. (Optional: Batch convert with button)
```

---

## What You Can Do Now

### ✅ View Live Data

1. Go to `/secret-admin` (password: `LukaAnthony040107`)
2. See real-time customer and employee counts
3. View full profiles in User Management section
4. Data updates automatically when users sign up

### ✅ Check Firebase Auth Users

1. In Admin Dashboard → Data Synchronization
2. Click "Sync Firebase Auth Users as Employees"
3. See all Firebase Auth accounts
4. Identify which ones could be converted to employees

### ✅ Monitor Data Status

- **Green dot** = Real-time sync is active
- **Last sync time** = When data was last refreshed
- **Live counts** = Customers, Employees, Auth Users

---

## Firestore Collections Structure

### `customers/{uid}` Collection

```typescript
{
  uid: string                    // Firebase Auth UID
  email: string                  // Customer email
  firstName: string              // First name
  lastName: string               // Last name
  phone: string                  // Contact number
  status: 'active' | 'inactive'  // Account status
  personalUse: string            // 'personal' | 'business'
  totalOrders: number            // Lifetime orders
  totalSpent: number             // Lifetime spending
  rating: number                 // Customer rating (0-5)
  createdAt: Timestamp           // Signup date
  updatedAt: Timestamp           // Last update
}
```

### `employees/{uid}` Collection

```typescript
{
  uid: string                    // Firebase Auth UID
  email: string                  // Employee email
  firstName: string              // First name
  lastName: string               // Last name
  phone: string                  // Contact number
  state: string                  // Service state
  status: 'pending' | 'active'   // Verification status
  totalJobs: number              // Completed jobs
  totalEarnings: number          // Total earned
  rating: number                 // Employee rating (0-5)
  createdAt: Timestamp           // Signup date
  updatedAt: Timestamp           // Last update
}
```

---

## Testing

### Test Customer Creation

1. Go to `/auth/signup-customer`
2. Fill out form and sign up
3. Go to `/secret-admin`
4. Enter password
5. See new customer appear in real-time ✓

### Test Employee Creation

1. Go to `/auth/pro-signup-form` (or `/pro`)
2. Fill out form and sign up
3. Go to `/secret-admin`
4. Switch to Employees tab
5. See new employee appear in real-time ✓

### Test Auth User Sync

1. Go to `/secret-admin`
2. Go to Data Synchronization section
3. Click "Sync Firebase Auth Users as Employees"
4. If you see "Failed", check:
   - Firebase Admin credentials in `.env.local`
   - Network connection
   - Console errors (F12 DevTools)

---

## Troubleshooting

### Issue: "Firebase Admin SDK not configured"

**Cause:** Missing environment variables

**Fix:**
1. Add to `.env.local`:
   ```bash
   FIREBASE_PRIVATE_KEY="..."
   FIREBASE_CLIENT_EMAIL="..."
   FIREBASE_PROJECT_ID="..."
   ```
2. Restart dev server: `npm run dev`

### Issue: "No employees found in database"

**This is normal!** Employees only appear after someone completes the pro signup form.

**To test:**
1. Go to `/auth/pro-signup-form`
2. Fill out and submit the form
3. An employee profile is created
4. Check admin dashboard - should see it in Employees tab

### Issue: Real-time sync not working

**Check:**
1. Are you authenticated? (Red alert should show)
2. Open DevTools Console (F12)
3. Look for error messages
4. Check network tab to see if requests are going through

---

## Next Steps

### 1. Test with Real Users
- Have team members sign up as customers or pros
- Watch them appear instantly in admin dashboard
- Verify real-time updates work

### 2. Set Up Additional Features
- Employee verification (email, phone, ID)
- Customer payment methods
- Order management
- Employee availability schedules

### 3. Add More Admin Functions
- Bulk employee creation
- Batch profile updates
- User suspension/deletion
- Revenue analytics

---

## API Reference

### GET `/api/admin/get-auth-users`

Fetch all Firebase Auth users.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "users": [
    {
      "uid": "user123",
      "email": "user@example.com",
      "displayName": "John Doe",
      "createdAt": "2024-01-15T10:30:00Z",
      "lastSignInTime": "2024-01-20T14:45:00Z"
    }
  ],
  "message": "Retrieved 5 Firebase Auth users"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Firebase Admin SDK not configured",
  "message": "To enable employee sync, set up Firebase Admin SDK credentials...",
  "hint": "Set FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID in .env.local"
}
```

---

## Files Modified/Created

- ✅ `app/secret-admin/page.tsx` - Added real-time listeners and sync UI
- ✅ `app/api/admin/get-auth-users/route.ts` - New API endpoint
- ✅ `lib/firebaseAdmin.ts` - Already configured for Admin SDK

---

## Summary

You now have:

1. **Real-time Firebase Integration**
   - Customers sync automatically when they sign up
   - Employees sync automatically when they sign up

2. **Admin Dashboard Data Sync**
   - Live customer and employee counts
   - One-click sync of Firebase Auth users
   - Real-time status indicator

3. **Employee Creation Options**
   - Via pro signup form (auto-creates employee profile)
   - Via Firebase Auth sync (for existing accounts)

**To get started:** Add Firebase Admin credentials to `.env.local` and restart the dev server!
