# Webhook Setup Guide - Stripe & SendGrid

**Date**: January 30, 2026  
**Status**: Ready for Configuration  
**Purpose**: Configure webhooks for local development and production

---

## Overview

Your Washlee app now has two webhook endpoints:
1. **Stripe Webhooks** - `/api/webhooks/stripe` (Payment events)
2. **SendGrid Webhooks** - `/api/webhooks/email` (Email delivery events)

---

## Prerequisites

✅ ngrok tunnel running: `ngrok http 3000`  
✅ Next.js dev server running: `npm run dev`  
✅ ngrok Forwarding URL (e.g., `https://abc123def456.ngrok.io`)  

---

## Stripe Webhook Setup

### Step 1: Get Your ngrok URL
```bash
# Terminal showing ngrok output
Forwarding: https://abc123def456.ngrok.io → http://localhost:3000
```

Copy: `https://abc123def456.ngrok.io`

### Step 2: Configure Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate: **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter URL: `https://abc123def456.ngrok.io/api/webhooks/stripe`
5. Select events to listen:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.succeeded`
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.async_payment_succeeded`
   - ✅ `checkout.session.async_payment_failed`
6. Click **Add endpoint**

### Step 3: Get Signing Secret

1. Click on your newly created endpoint
2. Scroll to **Signing secret**
3. Click **Reveal** button
4. Copy the secret (starts with `whsec_`)
5. Add to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```
6. Restart dev server

### Step 4: Test Stripe Webhook

In Stripe Dashboard:
1. Go back to **Developers** → **Webhooks**
2. Click your endpoint
3. Scroll to **Recent events**
4. Click **Send test webhook**
5. Watch your terminal logs for:
   ```
   [WEBHOOK] Received Stripe event
   [WEBHOOK] ✓ Signature verified
   [WEBHOOK] Processing payment_intent.succeeded
   [WEBHOOK] ✓ Order updated to confirmed
   ```

### What Happens When Payment Succeeds

```
Customer clicks "Confirm & Pay"
    ↓
Stripe processes payment
    ↓
Stripe sends webhook to ngrok URL
    ↓
/api/webhooks/stripe receives event
    ↓
Verifies webhook signature
    ↓
Updates order status in Firebase: pending_payment → confirmed
    ↓
[TODO] Send confirmation email
    ↓
[TODO] Create tracking record
```

---

## SendGrid Webhook Setup

### Step 1: Get SendGrid Mail Send API Key

1. Go to [SendGrid Dashboard](https://app.sendgrid.com)
2. Navigate: **Settings** → **API Keys**
3. Click **Create API Key**
4. Name: `Washlee Development`
5. Select **Mail Send** access
6. Copy the key
7. Add to `.env.local`:
   ```env
   SENDGRID_API_KEY=SG.your_key_here
   ```

### Step 2: Configure SendGrid Webhooks

1. Go to **Settings** → **Mail Send** → **Event Webhook**
2. Enter URL: `https://abc123def456.ngrok.io/api/webhooks/email`
3. Select events to track:
   - ✅ `Delivered`
   - ✅ `Bounce`
   - ✅ `Open`
   - ✅ `Click`
   - ✅ `Dropped`
   - ✅ `Spam Report`
   - ✅ `Unsubscribe`
4. Click **Save**

### Step 3: Test SendGrid Webhook

SendGrid has a test feature:
1. Go to **Settings** → **Mail Send** → **Event Webhook**
2. Your endpoint URL is listed
3. Click **Test Your EventWebhook** button
4. Watch your terminal logs:
   ```
   [EMAIL-WEBHOOK] Received 1 event(s)
   [EMAIL-WEBHOOK] Processing: delivered for test@example.com
   [EMAIL-WEBHOOK] ✓ Email delivered to test@example.com
   ```

### What Happens When Email Sent

```
Order confirmed
    ↓
Trigger send confirmation email via SendGrid API
    ↓
SendGrid processes email
    ↓
Customer receives email
    ↓
SendGrid sends webhook: "delivered"
    ↓
/api/webhooks/email receives event
    ↓
Logs email engagement in Firestore
    ↓
[If customer opens email]
    ↓
SendGrid sends webhook: "open"
    ↓
/api/webhooks/email records open
```

---

## How Webhooks Work in Your App

### Stripe Flow

```typescript
// 1. Customer completes booking & payment
POST /api/orders
{
  "userId": "user123",
  "bookingData": { ... },
  "orderTotal": 45.00
}

// 2. Order created in Firebase with status: "pending_payment"
orders/{orderId} = {
  status: "pending_payment",
  deliveryAddressLine1: "35 Malcolm St",
  deliveryAddressLine2: "1403",
  deliveryCity: "South Yarra",
  deliveryState: "VIC",
  deliveryPostcode: "3141",
  deliveryCountry: "Australia",
  ...
}

// 3. Customer pays via Stripe
// 4. Stripe webhook POST /api/webhooks/stripe
// 5. Webhook verifies signature & finds order
// 6. Updates order status: pending_payment → confirmed

orders/{orderId} = {
  status: "confirmed",        // ← Updated by webhook
  paymentIntentId: "pi_...",  // ← Added by webhook
  amountPaid: 45.00,          // ← Added by webhook
  paidAt: "2026-01-30T..."    // ← Added by webhook
}
```

### SendGrid Flow

```typescript
// 1. Order status changes to "confirmed"
// 2. [TODO] Backend sends confirmation email via SendGrid API
// 3. Email in transit to customer

// 4. Email delivered
// 5. SendGrid webhook POST /api/webhooks/email
// 6. Webhook logs: delivered event in Firestore

email_events/{messageId} = {
  email: "customer@example.com",
  type: "delivered",
  deliveredAt: "2026-01-30T...",
  timestamp: "2026-01-30T..."
}

// 7. Customer opens email
// 8. SendGrid webhook POST /api/webhooks/email
// 9. Webhook logs: open event in Firestore

email_events/{messageId} = {
  email: "customer@example.com",
  type: "open",
  openedAt: "2026-01-30T...",
  timestamp: "2026-01-30T..."
}
```

---

## Firestore Collections Created by Webhooks

### `orders` Collection
```
orders/{orderId}
├── status: "pending_payment" | "confirmed" | "payment_failed" | "refunded"
├── paymentIntentId: "pi_..."
├── amountPaid: 45.00
├── paidAt: "2026-01-30T..."
└── ... (all order data)
```

### `email_events` Collection
```
email_events/{messageId}
├── email: "customer@example.com"
├── type: "delivered" | "open" | "click" | "bounce" | "unsubscribe"
├── deliveredAt: "2026-01-30T..."
├── openedAt: "2026-01-30T..."
└── ... (event details)
```

### `email_spam_list` Collection
```
email_spam_list/{email}
├── email: "baduser@example.com"
├── reportedAt: "2026-01-30T..."
└── count: 2
```

### `email_unsubscribe_list` Collection
```
email_unsubscribe_list/{email}
├── email: "user@example.com"
└── unsubscribedAt: "2026-01-30T..."
```

---

## Troubleshooting Webhooks

### "Webhook endpoint not reached"

**Problem**: Stripe/SendGrid can't reach your webhook URL

**Solution**:
1. Make sure ngrok is running: `ngrok http 3000`
2. Check Forwarding URL in ngrok terminal
3. Verify URL is correct (includes `/api/webhooks/stripe` or `/api/webhooks/email`)
4. Test with curl:
   ```bash
   curl https://abc123def456.ngrok.io/api/webhooks/stripe
   # Should see "Stripe webhook endpoint is running"
   ```

### "Signature verification failed"

**Problem**: Webhook signature doesn't match

**Solution**:
1. Verify your `STRIPE_WEBHOOK_SECRET` in `.env.local` is correct
2. Make sure you copied the full secret (starts with `whsec_`)
3. Restart dev server after updating `.env.local`

### "Event not processed"

**Problem**: Webhook received but no action taken

**Solution**:
1. Check terminal logs for error messages
2. Verify order exists in Firestore
3. Check Firebase permissions (Admin SDK should work)
4. Try test webhook from dashboard

### "ngrok URL keeps changing"

**Problem**: Every time you restart ngrok, the URL changes

**Solution**:
- Subscribe to ngrok Pro ($12/month) for custom domains
- Or update webhook URLs in Stripe/SendGrid each time (annoying but free)
- For production, use your actual domain instead

---

## Production Deployment

When going to production:

### Replace ngrok URLs
```
Development: https://abc123def456.ngrok.io/api/webhooks/stripe
Production:  https://www.washlee.com.au/api/webhooks/stripe
```

### Stripe Production Setup
1. Go to [Stripe Production Dashboard](https://dashboard.stripe.com) (not test mode)
2. **Developers** → **Webhooks**
3. Add endpoint: `https://www.washlee.com.au/api/webhooks/stripe`
4. Get signing secret and add to production `.env`
5. Test with real payment

### SendGrid Production Setup
1. Go to [SendGrid Production Settings](https://app.sendgrid.com)
2. **Settings** → **Mail Send** → **Event Webhook**
3. Update URL: `https://www.washlee.com.au/api/webhooks/email`
4. Get API key for production account
5. Test with production email

---

## Quick Reference

### Webhook Endpoints
- **Stripe**: `/api/webhooks/stripe` (POST)
- **Email**: `/api/webhooks/email` (POST)

### Environment Variables
```env
# .env.local
STRIPE_WEBHOOK_SECRET=whsec_your_secret
SENDGRID_API_KEY=SG.your_key
NEXT_PUBLIC_APP_URL=https://abc123def456.ngrok.io (for local)
```

### Useful Commands
```bash
# Start dev server
npm run dev

# Start ngrok tunnel
ngrok http 3000

# Test Stripe webhook locally
curl -X POST https://abc123def456.ngrok.io/api/webhooks/stripe

# Check logs
# Terminal 1: Watch Next.js logs
# Terminal 2: Watch ngrok logs (http://127.0.0.1:4040)
```

---

## Next Steps

1. ✅ Configure Stripe webhook in dashboard
2. ✅ Configure SendGrid webhook in dashboard
3. ✅ Test with sample webhooks
4. ✅ Complete booking flow end-to-end
5. ✅ Add confirmation email sending
6. ✅ Deploy to production

---

**Status**: Ready to Configure ✅
