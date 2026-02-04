# Quick Start: Firebase Real-Time Data Sync

## What You're Getting

Your admin dashboard now automatically shows:
- ✅ **Live customer count** (updates when customers sign up)
- ✅ **Live employee count** (updates when pros sign up)
- ✅ **Real-time data** (no page refresh needed)
- ✅ **Firebase Auth sync** (identify users that can be employees)

---

## Step 1: Add Firebase Admin Credentials

Edit `.env.local` in your project root:

```bash
# These are required for the sync feature to work
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxx@washlee-7d3c6.iam.gserviceaccount.com"
FIREBASE_PROJECT_ID="washlee-7d3c6"
```

### How to Get These Values:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click your project (Washlee)
3. Settings ⚙️ → Project Settings
4. **Service Accounts** tab
5. Click **"Generate New Private Key"**
6. Open the JSON file and copy:
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `project_id` → `FIREBASE_PROJECT_ID`

---

## Step 2: Test Real-Time Customer Sync

### Open Admin Dashboard:
- Go to `http://localhost:3000/secret-admin`
- Password: `LukaAnthony040107`
- You should see: "🟢 Real-time data status: Active"

### Create a Test Customer:
1. Open new tab: `http://localhost:3000/auth/signup-customer`
2. Fill form and sign up
3. Go back to admin dashboard
4. **Refresh is NOT needed** - customer appears automatically! ✓

---

## Step 3: Test Real-Time Employee Sync

### Create a Test Employee:
1. Go to `http://localhost:3000/auth/pro-signup-form` (or `/pro`)
2. Fill form and sign up
3. Go back to admin dashboard
4. Switch to **Employees** tab
5. **New employee appears without refresh!** ✓

---

## Step 4: Test Firebase Auth User Sync

### In Admin Dashboard:
1. Scroll to **Data Synchronization** section
2. See counts: Customers, Employees, Auth Users
3. Click **"Sync Firebase Auth Users as Employees"**
4. System will show any Firebase Auth accounts without employee profiles

---

## What's Happening Behind the Scenes

### Real-Time Listeners
```tsx
// When authenticated, these listeners start automatically:
- onSnapshot(customers) → updates customer list
- onSnapshot(employees) → updates employee list
// When data changes in Firestore, listeners fire and UI updates
```

### API Endpoint
```
GET /api/admin/get-auth-users
├─ Fetches all Firebase Auth users
├─ Compares against existing profiles
└─ Returns new users that could be employees
```

### Firestore Collections
```
customers/
├─ {uid1}
│  ├─ email: "john@example.com"
│  ├─ firstName: "John"
│  └─ createdAt: 2024-01-20
└─ {uid2}
   ├─ email: "jane@example.com"
   └─ ...

employees/
├─ {uid3}
│  ├─ email: "pro@example.com"
│  ├─ firstName: "Pro User"
│  └─ createdAt: 2024-01-20
└─ ...
```

---

## Troubleshooting

### Error: "Firebase Admin SDK not configured"

**Problem:** Missing `.env.local` credentials

**Solution:**
1. Add `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID` to `.env.local`
2. Restart dev server: `npm run dev`
3. Try again

### Error: "Real-time data status: 🔴 Inactive"

**Problem:** Not authenticated in admin dashboard

**Solution:**
1. Make sure you entered correct password: `LukaAnthony040107`
2. Check browser console (F12) for errors
3. Verify Firebase config is correct in `.env.local`

### Issue: Nothing appears when signing up

**Problem:** Real-time listeners might not have started

**Solution:**
1. Refresh admin dashboard
2. Re-enter password
3. Wait 2-3 seconds for data to load
4. Sign up as customer/pro in new tab
5. Data should appear within 1-2 seconds

---

## File Locations

**Admin Dashboard:**
- `app/secret-admin/page.tsx` - Contains real-time listeners and UI

**API Endpoint:**
- `app/api/admin/get-auth-users/route.ts` - Fetches Firebase Auth users

**Signup Forms:**
- `app/auth/signup-customer/page.tsx` - Creates customer profile
- `app/auth/pro-signup-form/page.tsx` - Creates employee profile

**Firebase Setup:**
- `lib/firebase.ts` - Client-side Firebase
- `lib/firebaseAdmin.ts` - Server-side Firebase Admin SDK

---

## Environment Variables Reference

```bash
# Required for real-time sync feature
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxx@project.iam.gserviceaccount.com"
FIREBASE_PROJECT_ID="your-project-id"

# Already should exist (client-side)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
```

---

## Next Steps

Once sync is working:

1. **Test with team members** - Have them sign up and verify they appear
2. **Set up employee verification** - Add phone/ID verification flow
3. **Create batch operations** - Convert multiple Auth users to employees at once
4. **Add analytics** - Track sign-ups and employee performance
5. **Set up notifications** - Notify admins of new sign-ups

---

## Support

**See full documentation:** `FIREBASE_DATA_SYNC_GUIDE.md`

Need help? Check:
- Browser console (F12) for errors
- Network tab to see API calls
- `.env.local` for missing variables
- Firebase Console for data verification
