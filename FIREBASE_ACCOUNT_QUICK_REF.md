# Firebase Account Management - Quick Reference

## What You Have

**14 Firebase Auth Accounts** ready to be organized into:
- 🟢 **Employees** (Pro users - job tracking, earnings)
- 🔵 **Customers** (Customers - order history, spending)

---

## How to Use

### Step 1: Open Admin Dashboard
```
URL: http://localhost:3000/secret-admin
Password: LukaAnthony040107
```

### Step 2: Find Data Synchronization Section
```
Scroll down to see:
┌─────────────────────────────────┐
│ Data Synchronization            │
├─────────────────────────────────┤
│ Status: 🟢 Active               │
│ Customers: 0                    │
│ Employees: 0                    │
│ Auth Users: 14                  │
│ [Sync Firebase Auth Users...]   │
└─────────────────────────────────┘
```

### Step 3: Click Sync Button
```
Displays:
✓ Customers: 0
✓ Employees: 0
✓ Auth Users: 14 ← Available to convert
```

### Step 4: Convert Accounts

For each account you want to keep:

```
Account: test@example.com

Option 1: Click [Employee]
          ↓
          Creates employee profile
          • Track jobs and earnings
          • Set availability
          • Pending verification

Option 2: Click [Customer]
          ↓
          Creates customer profile
          • Track orders and spending
          • Manage preferences
          • Active immediately
```

---

## Example Organization

**Convert your 14 accounts like this:**

```
Total: 14 accounts

├─ 2-3 → [Employee] buttons
│        (Pro/service provider accounts)
│        ✓ Employees: 2-3
│
├─ 4-5 → [Customer] buttons
│        (Regular user accounts)
│        ✓ Customers: 4-5
│
└─ 6-8 → Leave as is or delete
         (Temporary test accounts)
```

---

## Dashboard After Organization

```
Before:
├─ Customers: 0
├─ Employees: 0
└─ Auth Users: 14

After converting ~8 accounts:
├─ Customers: 5 ✓
├─ Employees: 3 ✓
└─ Auth Users: 6 ✓
```

---

## Conversion UI

### How It Looks

```
Firebase Auth Users to Convert (14)

[User Card 1]
├─ Name: John Doe
├─ Email: john@example.com
├─ Joined: 1/20/2024
└─ [Employee] [Customer]

[User Card 2]
├─ Name: Jane Smith
├─ Email: jane@example.com
├─ Joined: 1/18/2024
└─ [Employee] [Customer]

... (more cards)
```

### Clicking a Button

```
Click [Employee]
  ↓
🔄 Converting...
  ↓
✓ Successfully converted john@example.com to employee profile
  ↓
Dashboard updates:
  • Employees: 3 → 4
  • Auth Users: 6 → 5
  • Card disappears from list
```

---

## What Gets Created

### When You Click [Employee]

**Firestore Document Created:**
```
Collection: employees
Document ID: {same as Auth UID}

{
  uid: "abc123xyz...",
  email: "john@example.com",
  firstName: "John",
  lastName: "",
  status: "pending",
  totalJobs: 0,
  totalEarnings: 0,
  rating: 0,
  availability: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  },
  createdAt: "2024-01-20T14:30:00Z"
}
```

### When You Click [Customer]

**Firestore Document Created:**
```
Collection: customers
Document ID: {same as Auth UID}

{
  uid: "abc123xyz...",
  email: "john@example.com",
  firstName: "John",
  lastName: "",
  status: "active",
  personalUse: "personal",
  totalOrders: 0,
  totalSpent: 0,
  rating: 0,
  selectedPlan: "basic",
  createdAt: "2024-01-20T14:30:00Z"
}
```

---

## Keyboard Shortcuts

```
Left click [Employee]  → Convert to employee
Left click [Customer]  → Convert to customer
Scroll down           → See more accounts
Page reload           → Refresh all data
```

---

## Common Actions

### View Your Employees
```
1. Go to /secret-admin
2. Scroll down to "User Management"
3. Click [Employees] button
4. See table with all employees
```

### View Your Customers
```
1. Go to /secret-admin
2. Scroll down to "User Management"
3. Click [Customers] button
4. See table with all customers
```

### Convert More Accounts
```
1. Go to Data Synchronization
2. Click [Sync Firebase Auth Users...]
3. Converted accounts disappear
4. New list shows remaining auth accounts
5. Convert more using [Employee] [Customer] buttons
```

### Start Fresh
```
After organizing:
├─ Check Employees table
├─ Check Customers table
├─ Verify all accounts organized
└─ Delete temp accounts if needed
```

---

## Status Indicators

### Employee Status

```
pending  → Email/phone not verified yet
active   → Fully verified and active
inactive → Account disabled
```

### Customer Status

```
active   → Account is active
inactive → Account disabled
```

---

## Useful Info

| Item | Value |
|------|-------|
| Admin URL | /secret-admin |
| Admin Password | LukaAnthony040107 |
| Total Auth Accounts | 14 |
| Employee Collection | employees/ |
| Customer Collection | customers/ |
| API Endpoint | /api/admin/convert-auth-user |

---

## Tips & Tricks

💡 **Organize by role**
- Use consistent naming
- Test accounts → employees
- Regular accounts → customers

💡 **Batch convert**
- Do 3-5 at a time
- Watch dashboard update
- Take breaks between batches

💡 **Verify results**
- Check User Management tabs
- Confirm in Firestore
- Test signing in as each account

💡 **Keep organized**
- Document which email is which
- Note why each account exists
- Delete unused accounts later

---

## Quick Checklist

```
□ Admin password ready
□ Open /secret-admin
□ Click sync button
□ See 14 accounts listed
□ Click [Employee] for 2-3 accounts
□ Click [Customer] for 4-5 accounts
□ Watch counters update
□ Check User Management tabs
□ Verify in Firestore
□ Done! 🎉
```

---

## Need Help?

**If conversion fails:**
1. Check browser console (F12)
2. Look for error message
3. Verify Firebase setup
4. Try again

**If data won't update:**
1. Wait 2-3 seconds
2. Refresh page
3. Check real-time status (🟢 Active)

**If you want to undo:**
1. Delete from Firestore
2. Auth account still exists
3. Can convert again

---

## Estimated Time

- **Organize 10 accounts:** 5-10 minutes
- **Verify all accounts:** 3-5 minutes
- **Total setup:** ~15 minutes

**Start now!** 🚀
