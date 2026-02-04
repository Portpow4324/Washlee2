# Firebase Account Management Guide

## Overview

You now have a system to organize your Firebase test accounts into two categories:
- **Employees** - Pro accounts with job availability and earnings tracking
- **Customers** - Customer accounts with order history and spending tracking

---

## How to Organize Your Accounts

### Step 1: View All Firebase Auth Users

1. Go to `/secret-admin` (password: `LukaAnthony040107`)
2. Scroll to **Data Synchronization** section
3. Click **"Sync Firebase Auth Users as Employees"**
4. See list of all Firebase Auth accounts (14 in your case)

### Step 2: Convert Auth Users to Profiles

For each Firebase Auth user, you have two options:

#### Option A: Convert to Employee
- Click **"Employee"** button
- Creates employee profile in Firestore `employees/{uid}`
- Includes job tracking, availability, earnings
- Status: pending (requires verification)

#### Option B: Convert to Customer
- Click **"Customer"** button
- Creates customer profile in Firestore `customers/{uid}`
- Includes order history, spending, preferences
- Status: active (ready to use)

---

## What Happens When You Convert

### Converting to Employee

```
Firebase Auth User (email@example.com)
    ↓
"Employee" button clicked
    ↓
API creates document in employees/{uid}
    ↓
Employee Profile Created:
├─ uid: (same as Auth)
├─ email: email@example.com
├─ firstName: (extracted from displayName)
├─ status: pending
├─ totalJobs: 0
├─ totalEarnings: 0
├─ availability: (all days false)
└─ createdAt: now

Real-time Listener Updates Dashboard:
├─ Employees count: +1
├─ Auth Users count: -1
└─ Removed from conversion list
```

### Converting to Customer

```
Firebase Auth User (email@example.com)
    ↓
"Customer" button clicked
    ↓
API creates document in customers/{uid}
    ↓
Customer Profile Created:
├─ uid: (same as Auth)
├─ email: email@example.com
├─ firstName: (extracted from displayName)
├─ status: active
├─ totalOrders: 0
├─ totalSpent: 0
├─ personalUse: 'personal'
└─ createdAt: now

Real-time Listener Updates Dashboard:
├─ Customers count: +1
├─ Auth Users count: -1
└─ Removed from conversion list
```

---

## Firestore Collections Structure

### After Conversion to Employee

```
Firebase Firestore
│
└─ employees/
   └─ abc123def456...
      ├─ uid: "abc123def456..."
      ├─ email: "test@example.com"
      ├─ firstName: "Test"
      ├─ lastName: ""
      ├─ phone: ""
      ├─ state: ""
      ├─ status: "pending"
      ├─ totalJobs: 0
      ├─ totalEarnings: 0
      ├─ rating: 0
      ├─ availability:
      │  ├─ monday: false
      │  ├─ tuesday: false
      │  └─ ...
      ├─ verificationStatus:
      │  ├─ emailVerified: false
      │  ├─ phoneVerified: false
      │  ├─ idVerified: false
      │  └─ backgroundCheckPassed: false
      └─ createdAt: "2024-01-20T..."
```

### After Conversion to Customer

```
Firebase Firestore
│
└─ customers/
   └─ abc123def456...
      ├─ uid: "abc123def456..."
      ├─ email: "test@example.com"
      ├─ firstName: "Test"
      ├─ lastName: ""
      ├─ phone: ""
      ├─ status: "active"
      ├─ personalUse: "personal"
      ├─ totalOrders: 0
      ├─ totalSpent: 0
      ├─ rating: 0
      ├─ selectedPlan: "basic"
      ├─ preferenceMarketingTexts: false
      ├─ preferenceAccountTexts: true
      └─ createdAt: "2024-01-20T..."
```

---

## Your Account Organization Plan

Based on your 14 Firebase Auth accounts, here's a suggested breakdown:

### Example Organization

**Total Accounts: 14**

- **Employees: 2-3 accounts**
  - Use for testing pro signup flow
  - Test job posting and availability
  - Track earnings system

- **Customers: 4-5 accounts**
  - Use for testing customer signup flow
  - Test order placement
  - Track spending and order history

- **Testing/Temp: 6-8 accounts**
  - Use for one-off testing
  - Can delete later if needed
  - Not critical for system

---

## Complete Your Organization

### Quick Checklist

```
□ Step 1: Go to /secret-admin
          Password: LukaAnthony040107

□ Step 2: Click "Sync Firebase Auth Users as Employees"
          Wait for list to load

□ Step 3: For first 2-3 accounts:
          Click "Employee" button

□ Step 4: For next 4-5 accounts:
          Click "Customer" button

□ Step 5: Monitor progress:
          ✓ Employees count increases
          ✓ Customers count increases
          ✓ Auth Users count decreases

□ Step 6: Verify in User Management:
          - Switch to Employees tab → see converted employees
          - Switch to Customers tab → see converted customers
```

---

## Expected Results After Organization

### Admin Dashboard Counters

```
Before Organization:
├─ Customers: 0
├─ Employees: 0
└─ Auth Users: 14

After Organization:
├─ Customers: 5 (converted)
├─ Employees: 3 (converted)
└─ Auth Users: 6 (remaining unorganized)
```

### User Management Tables

**Employees Tab:**
```
| Name | Email | Status | Jobs | Earnings | Rating |
|------|-------|--------|------|----------|--------|
| Test | test@ex.com | pending | 0 | $0 | N/A |
| ... | ... | ... | ... | ... | ... |
```

**Customers Tab:**
```
| Name | Email | Status | Orders | Total Spent | Rating |
|------|-------|--------|--------|-------------|--------|
| Test | test@ex.com | active | 0 | $0 | N/A |
| ... | ... | ... | ... | ... | ... |
```

---

## Features

### Real-Time Updates ✓
- Dashboard updates instantly as you convert accounts
- No page refresh needed
- Live counters change immediately

### Easy Bulk Conversion ✓
- One click per account
- Instant feedback
- Error messages if something goes wrong

### Organized Data ✓
- Clear separation between employees and customers
- Proper Firestore collection structure
- Ready for feature development

### No Data Loss ✓
- Firebase Auth accounts remain unchanged
- Conversion just adds Firestore profile
- Can convert same account differently later if needed

---

## Troubleshooting

### "Failed to convert to employee/customer"

**Check:**
1. Are you logged into admin? (Red alert should show)
2. Check browser console (F12) for errors
3. Verify Firebase Admin credentials in `.env.local`
4. Restart dev server: `npm run dev`

### Counts not updating

**Solution:**
1. Wait 2-3 seconds for real-time listener
2. Refresh page manually
3. Check browser console for errors

### Account appears twice

**This is OK:**
- Firebase Auth account still exists
- Firestore profile created separately
- Just means Auth account has a profile now

---

## Next Steps

1. **Organize all accounts** - Convert to employee or customer
2. **Test workflows** - Try signing in as each type
3. **Verify profiles** - Check Firestore to see created documents
4. **Delete temp accounts** - Remove unused test accounts (optional)

---

## API Reference

### POST /api/admin/convert-auth-user

**Request:**
```json
{
  "uid": "user123abc...",
  "email": "test@example.com",
  "displayName": "Test User",
  "type": "employee" // or "customer"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Successfully converted test@example.com to employee profile",
  "type": "employee",
  "uid": "user123abc..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Missing required fields: uid, email, type",
  "code": "VALIDATION_ERROR"
}
```

---

## Summary

You now have:
✅ List of all 14 Firebase Auth accounts
✅ One-click conversion to employee profiles
✅ One-click conversion to customer profiles
✅ Real-time dashboard updates
✅ Organized Firestore collections
✅ Ready for feature development

**Start organizing your accounts now!**
