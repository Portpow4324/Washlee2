# Firebase User Management - Quick Implementation Guide

## What Was Changed

### 1. New Utility File: `lib/userManagement.ts`
Complete user management system with separate collections for employees and customers.

**Key Functions:**
- `createEmployeeProfile()` - Create new employee
- `createCustomerProfile()` - Create new customer
- `upgradeCustomerToEmployee()` - Customer becomes employee
- `upgradeEmployeeToCustomer()` - Employee becomes customer
- `getUserMetadata()` - Get user role info
- `getUserTypesByEmail()` - Check what roles user has

### 2. Updated: `app/auth/pro-signup-form/page.tsx`
- Now uses `createEmployeeProfile()` instead of generic user doc
- Calls `upgradeCustomerToEmployee()` when existing customer signs up as pro
- Employees isolated in `employees/{uid}` collection

### 3. Updated: `app/auth/signup-customer/page.tsx`
- Now uses `createCustomerProfile()` instead of generic user doc
- Customers isolated in `customers/{uid}` collection

### 4. New API: `app/api/users/profile/route.ts`
REST endpoints for:
- `GET` - Retrieve user profile info (both roles)
- `POST` - Upgrade customer to employee
- `PATCH` - Upgrade employee to customer

### 5. Documentation: `FIREBASE_USER_MANAGEMENT.md`
Complete guide with architecture, workflows, security rules, and examples.

## Database Structure

```
Before (Mixed):
users/
  ├── uid123 { userType: 'pro', ... }
  ├── uid456 { userType: 'customer', ... }

After (Separated):
employees/
  └── uid123 { applicationType: 'employee', ... }
customers/
  └── uid456 { applicationType: 'customer', ... }
users/
  ├── uid123 { userTypes: ['employee'], primaryUserType: 'employee' }
  └── uid456 { userTypes: ['customer'], primaryUserType: 'customer' }
```

## Dual Profile Example

```
User abc123 (Both Employee & Customer):

Authentication:
  └── Firebase Auth: abc123

Collections:
  ├── employees/abc123 ✅
  │   ├── status: 'active'
  │   ├── totalJobs: 45
  │   ├── rating: 4.8
  │   └── linkedCustomerId: 'abc123'
  │
  ├── customers/abc123 ✅
  │   ├── status: 'active'
  │   ├── totalOrders: 12
  │   ├── rating: 4.9
  │   └── linkedEmployeeId: 'abc123'
  │
  └── users/abc123
      ├── userTypes: ['employee', 'customer']
      ├── primaryUserType: 'employee'
      ├── employeeId: 'abc123'
      └── customerId: 'abc123'
```

## Key Benefits

✅ **Complete Isolation**: Employee data never mixes with customer data
✅ **Independent Management**: Manage pros and customers separately
✅ **Flexible Roles**: One account can have multiple roles
✅ **Privacy**: Clear data boundaries
✅ **Scalable**: Easy to add more user types
✅ **Audit Trail**: Timestamps on all changes

## How to Use

### Check User Roles

```typescript
import { getUserMetadata } from '@/lib/userManagement'

const metadata = await getUserMetadata(uid)
// metadata.userTypes = ['employee', 'customer']
// metadata.primaryUserType = 'employee'
```

### Get Employee Profile

```typescript
import { getEmployeeProfile } from '@/lib/userManagement'

const employee = await getEmployeeProfile(uid)
// Only works if user has employee profile
```

### Get Customer Profile

```typescript
import { getCustomerProfile } from '@/lib/userManagement'

const customer = await getCustomerProfile(uid)
// Only works if user has customer profile
```

### Upgrade Customer to Employee

```typescript
import { upgradeCustomerToEmployee } from '@/lib/userManagement'

await upgradeCustomerToEmployee(uid, {
  state: 'NSW',
  employmentType: 'contractor',
  availability: { monday: true, tuesday: true, ... }
})
```

## Dashboard Usage

### Check if Employee Can Access Customer Dashboard

```typescript
const metadata = await getUserMetadata(uid)

if (metadata.userTypes.includes('customer')) {
  // Show "View as Customer" button
  // Allow access to customer dashboard
}
```

### Get Primary Role for UI

```typescript
const metadata = await getUserMetadata(uid)

if (metadata.primaryUserType === 'employee') {
  // Show employee dashboard by default
} else {
  // Show customer dashboard by default
}
```

## Migration from Old System

If you have existing users in old `users/` collection:

```typescript
// Run migration for each old user
async function migrateUser(oldUser) {
  const uid = oldUser.uid
  
  if (oldUser.userType === 'pro') {
    await createEmployeeProfile(uid, {
      email: oldUser.email,
      firstName: oldUser.firstName,
      lastName: oldUser.lastName,
      phone: oldUser.phone,
      state: oldUser.state,
      // ... map other fields
    })
  } else if (oldUser.userType === 'customer') {
    await createCustomerProfile(uid, {
      email: oldUser.email,
      firstName: oldUser.firstName,
      lastName: oldUser.lastName,
      phone: oldUser.phone,
      personalUse: oldUser.personalUse,
      // ... map other fields
    })
  }
}
```

## Testing the System

```typescript
// Test 1: Create new customer
const cust = await createCustomerProfile('test1', {
  email: 'customer@test.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '0412345678',
  personalUse: 'personal',
})

// Test 2: Check profile
const meta = await getUserMetadata('test1')
// { userTypes: ['customer'], primaryUserType: 'customer', ... }

// Test 3: Upgrade to employee
await upgradeCustomerToEmployee('test1', {
  state: 'NSW',
  employmentType: 'contractor',
})

// Test 4: Verify both profiles exist
const hasLinked = await hasLinkedProfiles('test1')
// true

// Test 5: Check metadata updated
const updated = await getUserMetadata('test1')
// { userTypes: ['employee', 'customer'], primaryUserType: 'employee', ... }
```

## Common Queries

### Get All Admins (Employees Only)
```typescript
const q = query(
  collection(db, 'employees'),
  where('status', '==', 'active'),
  where('employmentType', '==', 'full-time')
)
const result = await getDocs(q)
```

### Get Active Customers
```typescript
const q = query(
  collection(db, 'customers'),
  where('status', '==', 'active')
)
const result = await getDocs(q)
```

### Find Users with Both Profiles
```typescript
const q = query(
  collection(db, 'users'),
  where('userTypes', 'array-contains', 'employee')
)
const docs = await getDocs(q)

// Filter for those with both
const bothProfiles = docs.docs.filter(doc => 
  doc.data().userTypes.length === 2
)
```

## Security Firestore Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /employees/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if request.auth.token.admin == true;
    }
    
    match /customers/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if request.auth.token.admin == true;
    }
    
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow read: if request.auth.token.admin == true;
    }
  }
}
```

## What's Next

1. **Update Dashboards**
   - Modify `/dashboard/employee` to read from `employees/{uid}`
   - Modify `/dashboard/customer` to read from `customers/{uid}`
   - Add role switcher UI

2. **Update Login Logic**
   - Check `getUserMetadata()` to determine default dashboard
   - Show role selector if user has multiple roles

3. **Update Profile Pages**
   - Separate employee and customer profile management
   - Allow editing each profile independently

4. **Add Admin Dashboard**
   - View employees collection
   - View customers collection
   - Manage approvals/suspensions

5. **Migrate Old Users** (if applicable)
   - Run batch migration script
   - Verify all users migrated
   - Delete old `users/` collection

## Troubleshooting

**Issue**: "Employee profile not found"
**Solution**: Check if user exists in `getEmployeeProfile()` - returns null if not found

**Issue**: User can't upgrade
**Solution**: Verify user only has one profile type - use `hasLinkedProfiles()` first

**Issue**: Metadata not updating
**Solution**: Always call `updateUserMetadata()` after creating profiles

**Issue**: Can't access other user's profile
**Solution**: Firestore rules prevent cross-user access - this is intentional

---

**Documentation Version**: 1.0
**Last Updated**: February 1, 2026
