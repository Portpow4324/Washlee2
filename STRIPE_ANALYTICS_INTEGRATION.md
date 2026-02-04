# Real-Time Analytics & Stripe Integration Guide

## Overview

The admin dashboard now features **real-time analytics** synced directly from:
- 📊 Firestore orders collection
- 💳 Stripe payment processing
- 👥 Customer and employee profiles

## How It Works

### 1. Analytics Endpoint (`/api/admin/stripe-analytics`)

**Location**: `app/api/admin/stripe-analytics/route.ts`

**Functionality**:
- Fetches all orders from Firestore `orders` collection
- Filters orders by date range (7days, 30days, 90days)
- Calculates order statuses: active, completed, cancelled
- Fetches Stripe charge data for revenue verification
- Returns comprehensive analytics object

**Response Structure**:
```json
{
  "success": true,
  "analytics": {
    "orders": {
      "total": 150,
      "active": 45,
      "completed": 95,
      "cancelled": 10,
      "activePercentage": 30,
      "completionRate": 63,
      "cancellationRate": 7
    },
    "revenue": {
      "total": 4500.50,
      "average": 30.00,
      "stripeVerified": 4500.50,
      "refunds": 250.00
    },
    "users": {
      "totalCustomers": 125,
      "totalEmployees": 45
    },
    "stripe": {
      "stripeCharges": 148,
      "stripeRevenue": 4500.50,
      "stripeRefunds": 250.00,
      "stripeFailedCharges": 2
    },
    "dateRange": "30days",
    "generatedAt": "2026-02-01T10:30:00.000Z"
  }
}
```

### 2. Admin Dashboard Updates

**Location**: `app/secret-admin/page.tsx`

**Real-Time Features**:

#### A. Live Analytics Metrics
- **Total Orders**: All orders in selected date range
- **Active Orders**: Pending, accepted, or in-progress orders
- **Completed Orders**: Successfully delivered orders
- **Cancelled Orders**: Cancelled or refunded orders

#### B. Revenue Dashboard
- **Total Revenue**: Sum of all order totals
- **Average per Order**: Revenue divided by order count
- **Stripe Verified Revenue**: Cross-checked with Stripe charges
- **Refunds**: Total refunded amount from Stripe

#### C. Stripe Payment Status
- **Total Charges**: Number of Stripe charges processed
- **Failed Charges**: Declined or failed payment attempts
- **Refunded Amount**: Total amount refunded via Stripe

#### D. User Statistics
- **Total Customers**: Active customer profiles
- **Total Employees**: Active employee/service provider profiles

### 3. Real-Time Listeners

**Orders Auto-Refresh**:
```tsx
const unsubscribeOrders = onSnapshot(
  query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
  (snapshot) => {
    // Automatically refresh analytics when orders change
    fetchAnalytics()
  }
)
```

When any order is created or updated, the analytics automatically refresh without requiring a page refresh.

### 4. Date Range Filtering

Users can select from three date ranges:
- **Last 7 Days**: Recent activity
- **Last 30 Days**: Monthly trends (default)
- **Last 90 Days**: Quarterly overview

Analytics automatically recalculate when date range changes.

## Admin Dashboard Layout

### Quick Stats (Top)
4-column grid showing:
1. Total Orders
2. Active Orders (% of total)
3. Completed Orders
4. Cancelled Orders

### Live Analytics Section
**Live Analytics & Revenue Dashboard** with:
1. **Order Metrics Grid** (4 columns)
   - Total Orders
   - Active Orders
   - Completed Orders
   - Cancelled Orders (with rates)

2. **Revenue Analytics** (2 columns)
   - Total Revenue
   - Stripe Verified Revenue & Refunds

3. **Stripe Payment Status** (3 columns)
   - Total Charges
   - Failed Charges
   - Refunded Amount

4. **User Statistics** (2 columns)
   - Total Customers
   - Total Employees

### Firebase Auth Management Section
- Sync Firebase Auth users
- Convert to Employee/Customer profiles
- Real-time profile counts

### User Management Section
- Employees/Customers toggle slider
- Detailed tables with all profile data
- Real-time updates

## Firestore Collections

### Orders Collection
```
orders/{orderId}
├── customerId (string)
├── proId (string)
├── status (string: "pending"|"accepted"|"in_progress"|"completed"|"cancelled"|"refunded")
├── pricing
│   └── total (number)
├── stripePaymentId (string)
├── createdAt (timestamp)
└── updatedAt (timestamp)
```

### Customers Collection
```
customers/{uid}
├── uid (string)
├── email (string)
├── firstName (string)
├── lastName (string)
├── totalOrders (number)
├── totalSpent (number)
├── rating (number)
└── createdAt (timestamp)
```

### Employees Collection
```
employees/{uid}
├── uid (string)
├── email (string)
├── firstName (string)
├── lastName (string)
├── totalJobs (number)
├── totalEarnings (number)
├── rating (number)
└── createdAt (timestamp)
```

## API Usage

### Fetch Analytics

**GET** `/api/admin/stripe-analytics?dateRange=30days`

```typescript
const response = await fetch('/api/admin/stripe-analytics?dateRange=30days')
const { analytics } = await response.json()

console.log(analytics.orders.total)      // 150
console.log(analytics.revenue.total)      // 4500.50
console.log(analytics.stripe.stripeCharges) // 148
```

### Date Ranges

- `7days` - Last 7 days
- `30days` - Last 30 days (default)
- `90days` - Last 90 days

## Features

✅ **Real-Time Updates**: Orders automatically trigger analytics refresh
✅ **Stripe Integration**: Revenue verified against Stripe charges
✅ **Date Range Filtering**: View data for different time periods
✅ **Comprehensive Metrics**: Orders, revenue, payments, users, rates
✅ **Live Status**: Real-time indicator showing active/inactive status
✅ **Professional UI**: Color-coded sections for different metrics
✅ **Error Handling**: Graceful fallback if Stripe data unavailable
✅ **Performance**: Efficient queries with proper indexing

## How to Use

1. **Login** to `/secret-admin` with admin password
2. **View Analytics**: Scroll to "Live Analytics & Revenue Dashboard"
3. **Change Date Range**: Select from dropdown (7/30/90 days)
4. **Refresh Data**: Click "Refresh" button to manually update
5. **Monitor Real-Time**: Changes to orders automatically update metrics
6. **Review Stripe Data**: Check payment status and revenue verification
7. **Manage Users**: See customer and employee counts with real-time sync

## Troubleshooting

### Analytics Not Showing

1. Check Stripe API keys in `.env.local`
2. Verify orders exist in Firestore `orders` collection
3. Check browser console for errors
4. Click "Refresh" button to manually trigger update

### Stripe Data Missing

1. Ensure `STRIPE_SECRET_KEY` is configured
2. Verify orders have `stripePaymentId` field
3. Check Stripe dashboard for charge records
4. Stripe data is fetched in real-time from API

### Real-Time Not Working

1. Check Firebase connection status (green 🟢 indicator)
2. Verify Firestore rules allow read access
3. Check browser console for listener errors
4. Manually click "Refresh" button

## Future Enhancements

- 📈 Historical trend charts
- 📊 Pro earnings breakdown by employee
- 🎯 Conversion rate analytics
- 💡 Predictive insights
- 📧 Email reports
- 🔔 Alert thresholds

## Performance Notes

- Analytics queries run efficiently with `orderBy('createdAt', 'desc')`
- Real-time listeners auto-update without manual refresh
- Stripe API calls limited to prevent rate limiting
- Date range calculations done server-side for accuracy

---

**Last Updated**: February 1, 2026
**Status**: Production Ready ✅
