# Stripe Webhook Setup - Complete Instructions

## What Changed

Your Stripe checkout now displays **separate line items**:
1. **Laundry Service** (70% of total) - Shows weight and wash type
2. **Delivery Fee** (30% of total) - Shows pickup & delivery

These appear separately on the Stripe checkout page, giving customers transparency on costs.

---

## Webhook Setup for Sandbox (Testing)

### Step 1: Open Stripe Dashboard Webhooks
1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. You should see an existing endpoint or see "Add endpoint" button

### Step 2: Create New Endpoint (if needed)

If you don't see an existing webhook endpoint, click **"Add endpoint"**:

```
Endpoint URL: http://localhost:3000/api/webhooks/stripe
```

**Note:** For local testing with `localhost`, use **Stripe CLI** (see Step 4)

### Step 3: Select Events to Listen For

From the massive event list you showed, select **ONLY these 5 core events**:

```
✓ charge.succeeded
✓ payment_intent.succeeded  
✓ payment_intent.payment_failed
✓ checkout.session.completed
✓ invoice.payment_succeeded
```

**Why these?**
- `charge.succeeded` - Customer paid
- `payment_intent.succeeded` - Backup confirmation
- `payment_intent.payment_failed` - Payment declined
- `checkout.session.completed` - Order completed
- `invoice.payment_succeeded` - Subscription payments (future)

**Ignore all other events** - you don't need them for basic payments.

### Step 4: Get Webhook Signing Secret

After creating the endpoint:

1. Click on the endpoint you just created
2. Scroll down to **"Signing secret"**
3. Click **"Reveal"** button
4. Copy the secret (starts with `whsec_`)
5. Add to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here_from_stripe
```

---

## Local Testing with Stripe CLI

### Install Stripe CLI (one-time)

```bash
# macOS using Homebrew
brew install stripe/stripe-cli/stripe

# Verify installation
stripe version
```

### Forward Webhooks to Your Local Server

```bash
# Start listening for webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Output will show:
# > Ready! Your webhook signing secret is: whsec_test_abc123...
```

**Copy that secret** and add to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_test_abc123...
```

### Trigger Test Events

In another terminal:

```bash
# Test payment succeeded event
stripe trigger charge.succeeded

# Test payment failed event
stripe trigger payment_intent.payment_failed

# Test checkout completed
stripe trigger checkout.session.completed
```

Watch your dev server logs to see webhooks being received.

---

## Settings Summary

### What to Select in Stripe Dashboard

```
Events from:
  → [x] Your account

API version:
  → 2025-12-15.clover

Events to listen for:
  → [x] Charge
       └─ [x] charge.succeeded
  
  → [x] Checkout
       └─ [x] checkout.session.completed
  
  → [x] Payment Intent
       └─ [x] payment_intent.succeeded
       └─ [x] payment_intent.payment_failed
  
  → [x] Invoice (for future subscriptions)
       └─ [x] invoice.payment_succeeded
```

**Total:** 5 events selected

---

## What Each Event Does in Your Code

From `/app/api/webhooks/stripe/route.ts`:

| Event | Action |
|-------|--------|
| `charge.succeeded` | Sets order status to `confirmed`, records payment ID |
| `payment_intent.succeeded` | Sets order status to `confirmed` |
| `payment_intent.payment_failed` | Sets order status to `payment_failed` |
| `checkout.session.completed` | Sets order status to `confirmed` |
| `invoice.payment_succeeded` | Sets subscription status to `active` |

All events:
- Update Firestore order document
- Log payment details (ID, amount, timestamp)
- Verify Stripe signature for security

---

## Environment Variables Needed

```env
# Stripe API Keys (from Stripe Dashboard)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Webhook Signing Secret (from webhook endpoint)
STRIPE_WEBHOOK_SECRET=whsec_test_...

# App URL for redirects
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Testing Workflow

### 1. Start Stripe CLI Listener (Terminal 1)
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
**Save the `STRIPE_WEBHOOK_SECRET`** from output

### 2. Update `.env.local` (Terminal 2)
Add the secret to your environment

### 3. Restart Dev Server (Terminal 2)
```bash
npm run dev
```

### 4. Test Payment Flow (Browser)
1. Go to http://localhost:3000
2. Click "Book Now"
3. Fill in booking details
4. Click "Confirm & Pay"
5. Use test card: `4242 4242 4242 4242`
6. Use any future date (e.g., `12/25`)
7. Use any 3-digit CVC (e.g., `123`)
8. Complete payment

### 5. Watch Logs
- Your Terminal 1 should show: `webhook received` 
- Your Terminal 2 should show: `[WEBHOOK] Processing event: charge.succeeded`
- Order status should update to `confirmed` in Firestore

---

## Production Setup (When Going Live)

### 1. Get Production Keys
- Switch Stripe account to **Live** mode
- Get live keys (starts with `pk_live_` and `sk_live_`)
- Get live webhook secret

### 2. Configure Production Webhook
1. In Stripe Dashboard, create webhook for production
2. Set endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
3. Select same 5 events
4. Get signing secret

### 3. Update Production `.env`
```env
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Deploy & Monitor
```bash
npm run build
npm run start
```

Monitor order status in Firestore Dashboard to see payments coming through.

---

## Troubleshooting

### "Webhook signature verification failed"
- ✓ You copied `STRIPE_WEBHOOK_SECRET` correctly
- ✓ Restarted dev server after updating `.env.local`
- ✓ Secret matches the endpoint in Stripe Dashboard

### "Order status not updating"
- ✓ Check `/app/api/webhooks/stripe/route.ts` logs
- ✓ Verify order exists in Firestore before payment
- ✓ Check Firebase Admin SDK credentials

### "Webhook not receiving events"
- ✓ Stripe CLI still running? (`stripe listen` command)
- ✓ Dev server running? (`npm run dev`)
- ✓ Correct URL in webhook endpoint?
- ✓ Run `stripe trigger charge.succeeded` to test manually

### "Test card not working"
- ✓ Using `4242 4242 4242 4242` (correct test card)
- ✓ Using future expiry date
- ✓ Not using real card numbers (ever)

---

## Key Files

- **Webhook Handler:** `/app/api/webhooks/stripe/route.ts`
- **Checkout Session:** `/app/api/checkout/route.ts` (creates line items)
- **Order Creation:** `/app/api/orders/route.ts` (server-side)
- **Success Page:** `/app/payment-success/page.tsx`

---

## Next Steps

1. ✓ Install Stripe CLI
2. ✓ Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. ✓ Copy webhook secret to `.env.local`
4. ✓ Restart dev server
5. ✓ Test payment flow
6. ✓ Watch logs and Firestore for updates

You're ready to start receiving payments! 🎉
