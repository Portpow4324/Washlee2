# Washlee Firebase User Management System

## Overview

This document outlines the new distinguished Firebase system for managing employees (Pro) and customers while allowing employees to also have customer privileges.

## Architecture

### Key Principles

1. **Single Firebase Auth**: All users (employees and customers) share one Firebase Authentication account
2. **Separate Collections**: Employees and customers have separate Firestore collections
3. **Dual Profiles**: An employee can have BOTH an employee profile AND a customer profile
4. **Management Separation**: Employee data is isolated from customer data for independent management

### Collections Structure

```
Firestore Database
├── employees/{uid}          # Employee/Pro profiles
├── customers/{uid}          # Customer profiles
└── users/{uid}             # User metadata (maps auth UID to both systems)
```

## Data Models

### 1. Employee Profile (`employees/{uid}`)

```typescript
{
  uid: string
  email: string
  firstName: string
  lastName: string
  phone: string
  state: string
  applicationType: 'employee'
  employmentType: 'full-time' | 'part-time' | 'contractor'
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'active'
  
  verificationStatus: {
    emailVerified: boolean
    phoneVerified: boolean
    idVerified: boolean
    backgroundCheckPassed: boolean
  }
  
  applicationStep: number
  availability: {
    monday: boolean
    // ... other days
  }
  
  rating: number
  totalJobs: number
  totalEarnings: number
  
  // Linking
  linkedCustomerId?: string          # UID if also a customer
  hasCustomerProfile: boolean        # Quick flag
  
  // Profile completion
  onboardingCompleted: boolean
  preferences?: {
    communicationMethod: 'email' | 'sms' | 'both'
    notificationSettings: Record<string, boolean>
  }
  
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2. Customer Profile (`customers/{uid}`)

```typescript
{
  uid: string
  email: string
  firstName: string
  lastName: string
  phone: string
  applicationType: 'customer'
  status: 'active' | 'suspended' | 'inactive'
  personalUse: 'personal' | 'business'
  
  ageOver65?: boolean
  preferenceMarketingTexts: boolean
  preferenceAccountTexts: boolean
  selectedPlan?: string # 'basic' | 'premium' | 'enterprise'
  
  paymentMethods?: Array<{
    id: string
    type: string
    last4: string
    default: boolean
  }>
  
  deliveryAddresses?: Array<{
    id: string
    address: string
    default: boolean
  }>
  
  totalOrders: number
  totalSpent: number
  rating: number
  
  // Linking
  linkedEmployeeId?: string          # UID if also an employee
  hasEmployeeProfile: boolean        # Quick flag
  
  // Profile completion
  onboardingCompleted: boolean
  preferences?: {
    communicationMethod: 'email' | 'sms' | 'both'
    notificationSettings: Record<string, boolean>
  }
  
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 3. User Metadata (`users/{uid}`)

```typescript
{
  uid: string
  email: string
  userTypes: ('employee' | 'customer')[]    # Array of all roles
  primaryUserType: 'employee' | 'customer'  # Default role
  
  employeeId?: string                        # Reference to employee profile
  customerId?: string                        # Reference to customer profile
  
  firstLoginAt?: Timestamp
  lastLoginAt?: Timestamp
  
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## Use Cases & Workflows

### Use Case 1: New Employee Sign-Up

1. User signs up via `/auth/pro-signup-form`
2. Firebase Auth account created
3. **Only** employee profile created in `employees/{uid}`
4. User metadata created with `userTypes: ['employee']`
5. Employee completes onboarding steps
6. Employee can later upgrade to also be a customer

```
User ID: abc123
├── Auth: abc123
├── employees/abc123 ✅
├── customers/abc123 ❌
└── users/abc123 (userTypes: ['employee'])
```

### Use Case 2: New Customer Sign-Up

1. User signs up via `/auth/signup-customer`
2. Firebase Auth account created
3. **Only** customer profile created in `customers/{uid}`
4. User metadata created with `userTypes: ['customer']`
5. Customer can later upgrade to also become an employee

```
User ID: xyz789
├── Auth: xyz789
├── employees/xyz789 ❌
├── customers/xyz789 ✅
└── users/xyz789 (userTypes: ['customer'])
```

### Use Case 3: Customer Becomes Employee

1. Existing customer at `/auth/pro-signup-form`
2. Enters credentials for existing customer account
3. Successfully signs in
4. System calls `upgradeCustomerToEmployee()`
5. Employee profile created in `employees/{uid}`
6. Both profiles linked
7. User metadata updated to `userTypes: ['employee', 'customer']`

```
User ID: xyz789
├── Auth: xyz789
├── employees/xyz789 ✅ (NEW)
├── customers/xyz789 ✅ (UNCHANGED)
└── users/xyz789 (userTypes: ['employee', 'customer'], primaryUserType: 'employee')
```

### Use Case 4: Employee Becomes Customer (Future)

1. Existing employee wants to book laundry services
2. Navigate to customer onboarding
3. System calls `upgradeEmployeeToCustomer()`
4. Customer profile created in `customers/{uid}`
5. Both profiles linked
6. User metadata updated to `userTypes: ['employee', 'customer']`

```
User ID: abc123
├── Auth: abc123
├── employees/abc123 ✅ (UNCHANGED)
├── customers/abc123 ✅ (NEW)
└── users/abc123 (userTypes: ['employee', 'customer'], primaryUserType: 'employee')
```

## API Functions

### Employee Management

```typescript
// Create new employee profile
await createEmployeeProfile(uid, employeeData)

// Get employee profile
const employee = await getEmployeeProfile(uid)

// Update employee profile
await updateEmployeeProfile(uid, updates)

// Update verification status
await updateEmployeeVerification(uid, verificationData)
```

### Customer Management

```typescript
// Create new customer profile
await createCustomerProfile(uid, customerData)

// Get customer profile
const customer = await getCustomerProfile(uid)

// Update customer profile
await updateCustomerProfile(uid, updates)
```

### User Metadata

```typescript
// Get user metadata
const metadata = await getUserMetadata(uid)

// Update user metadata
await updateUserMetadata(uid, data)
```

### Linked Accounts

```typescript
// Convert customer to also be employee
await upgradeCustomerToEmployee(uid, employeeData)

// Convert employee to also be customer
await upgradeEmployeeToCustomer(uid, customerData)

// Check if user has both profiles
const hasBoth = await hasLinkedProfiles(uid)

// Get primary user role
const role = await getPrimaryUserRole(uid)

// Get user types by email
const types = await getUserTypesByEmail(email)
```

### Batch Operations

```typescript
// Delete only employee profile (keep customer if exists)
await deleteEmployeeProfile(uid)

// Delete only customer profile (keep employee if exists)
await deleteCustomerProfile(uid)
```

## Security & Isolation

### Firestore Rules (Recommended)

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Employees can only see their own profile
    match /employees/{uid} {
      allow read, write: if request.auth.uid == uid
        && request.auth.uid != null
      allow read: if request.auth.token.admin == true // Admin override
    }
    
    // Customers can only see their own profile
    match /customers/{uid} {
      allow read, write: if request.auth.uid == uid
        && request.auth.uid != null
      allow read: if request.auth.token.admin == true // Admin override
    }
    
    // User metadata - read own, admins can read all
    match /users/{uid} {
      allow read: if request.auth.uid == uid
        && request.auth.uid != null
      allow read: if request.auth.token.admin == true
      allow write: if request.auth.uid == uid
        && request.auth.uid != null
    }
  }
}
```

### Key Security Points

1. **No Cross-Collection Access**: Employee data completely separate from customer
2. **User Isolation**: Users can only access their own profiles
3. **Admin Override**: Admins can manage both systems via custom claims
4. **Audit Trail**: Timestamps track all profile changes

## Migration Path (If Existing Users)

If you have existing users in an old `users/` collection, you'll need to migrate:

```typescript
// Migration function
export async function migrateExistingUser(oldUserDoc: any) {
  const uid = oldUserDoc.uid
  const batch = writeBatch(db)
  
  // Determine user type from old document
  if (oldUserDoc.userType === 'pro') {
    // Create new employee profile
    const employeeRef = doc(db, 'employees', uid)
    batch.set(employeeRef, {
      // ... map old fields to new employee structure
    })
  } else if (oldUserDoc.userType === 'customer') {
    // Create new customer profile
    const customerRef = doc(db, 'customers', uid)
    batch.set(customerRef, {
      // ... map old fields to new customer structure
    })
  }
  
  // Create new user metadata
  const userRef = doc(db, 'users', uid)
  batch.set(userRef, {
    uid,
    email: oldUserDoc.email,
    userTypes: [oldUserDoc.userType === 'pro' ? 'employee' : 'customer'],
    primaryUserType: oldUserDoc.userType === 'pro' ? 'employee' : 'customer',
  })
  
  await batch.commit()
}
```

## Dashboard Implementation

### For Employees

```typescript
// Check if employee can also access customer features
const profile = await getUserMetadata(uid)

if (profile.userTypes.includes('customer')) {
  // Show "Switch to Customer Mode" button
  // Allow access to customer dashboard
}
```

### For Customers

```typescript
// Check if customer can also access employee features
const profile = await getUserMetadata(uid)

if (profile.userTypes.includes('employee')) {
  // Show "Switch to Pro Mode" button
  // Allow access to employee dashboard
}
```

## Admin Dashboard Considerations

1. **Employee Management Panel**
   - List of employees
   - Verification status updates
   - Job assignments
   - Earnings tracking

2. **Customer Management Panel**
   - List of customers
   - Order history
   - Payment methods
   - Subscription management

3. **Dual Account Management**
   - Identify users with both profiles
   - View linked account info
   - Manage profile relationships

## Benefits of This Architecture

✅ **Complete Isolation**: Employee and customer data never mix
✅ **Flexible User Types**: Users can have multiple roles
✅ **Scalable**: Easy to add new user types (e.g., admin, support)
✅ **Clear Management**: Separate dashboards/UIs per role
✅ **Privacy**: Customers don't see employee data, employees don't see customer data
✅ **Audit Trail**: All changes timestamped
✅ **Future-Proof**: Easy to add more user types

## Common Operations

### Check User Status

```typescript
const metadata = await getUserMetadata(uid)

// Is user an employee?
const isEmployee = metadata.userTypes.includes('employee')

// Is user a customer?
const isCustomer = metadata.userTypes.includes('customer')

// What's their primary role?
const primary = metadata.primaryUserType
```

### Get Complete User Profile

```typescript
async function getFullUserProfile(uid: string) {
  const metadata = await getUserMetadata(uid)
  const employee = metadata?.userTypes.includes('employee') 
    ? await getEmployeeProfile(uid) 
    : null
  const customer = metadata?.userTypes.includes('customer') 
    ? await getCustomerProfile(uid) 
    : null
  
  return {
    metadata,
    employee,
    customer,
  }
}
```

### Switch Primary Role

```typescript
async function switchPrimaryRole(uid: string, newPrimary: 'employee' | 'customer') {
  const metadata = await getUserMetadata(uid)
  
  // Validate new primary is in userTypes
  if (!metadata.userTypes.includes(newPrimary)) {
    throw new Error('User does not have this role')
  }
  
  await updateUserMetadata(uid, {
    primaryUserType: newPrimary,
  })
}
```

## Testing

```typescript
// Test new account creation
const testCustomer = await createCustomerProfile('test1', { ... })
const testEmployee = await createEmployeeProfile('test2', { ... })

// Test upgrade flow
await upgradeCustomerToEmployee('test1', { ... })
const upgraded = await hasLinkedProfiles('test1') // Should be true

// Test verification
await updateEmployeeVerification('test2', { emailVerified: true })
```

---

**Last Updated**: February 1, 2026
**Version**: 1.0
**Status**: Production Ready
