# Stripe Webhook Setup Guide

## What You Need to Do

Your Washlee app now has a **webhook endpoint** that listens for Stripe payment events. You need to configure Stripe to send these events to your app.

### Step 1: Get Your Webhook Endpoint URL

Your webhook endpoint is:
```
https://your-domain.com/api/webhooks/stripe
```

**For Development (localhost):**
- If testing locally, you'll need **Stripe CLI** to forward webhooks
- In production, use your actual domain

### Step 2: Set Up Webhook in Stripe Dashboard

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
   - Link: https://dashboard.stripe.com/webhooks

2. Click **"Add an endpoint"**

3. Enter your endpoint URL:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```
   (Replace with your actual production domain)

4. Select events to listen for (already configured in code):
   - ✅ `payment_intent.succeeded` - Payment completed
   - ✅ `payment_intent.payment_failed` - Payment failed
   - ✅ `charge.succeeded` - Charge confirmed
   - ✅ `checkout.session.completed` - Checkout completed
   - ✅ `checkout.session.async_payment_succeeded` - Async payment succeeded
   - ✅ `checkout.session.async_payment_failed` - Async payment failed

5. Click **"Add events"** → **"Create endpoint"**

6. **Copy the Signing Secret**:
   - It starts with `whsec_`
   - Add it to your `.env.local`:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
     ```

### Step 3: Verify Your Setup

You can verify the webhook is working by:

1. **Test in Stripe Dashboard**:
   - Go to your webhook endpoint in Stripe
   - Click **"Send a test event"**
   - Select any event type
   - Click **"Send event"**

2. **Check your app logs**:
   - Look at the terminal where your dev server is running
   - Should see logs like:
     ```
     [WEBHOOK] Received Stripe event
     [WEBHOOK] ✓ Signature verified
     [WEBHOOK] Event type: payment_intent.succeeded
     [WEBHOOK] ✓ Order xxx updated to confirmed
     ```

### Step 4: Testing Payments End-to-End

1. Go to http://localhost:3000/booking
2. Fill out the form and click "Confirm & Pay"
3. Use test card: `4242 4242 4242 4242`
4. Complete the payment
5. Check your Firestore console - order status should change to `confirmed`

## What the Webhook Does

When a payment is successful:
1. Stripe sends an event to `/api/webhooks/stripe`
2. The webhook verifies it's really from Stripe (using the signing secret)
3. It extracts the order ID from the metadata
4. It updates the order in Firestore:
   - Changes status from `pending_payment` → `confirmed`
   - Records the payment ID and amount paid
   - Adds the paid timestamp

## Environment Variables You Need

Add these to your `.env.local`:

```dotenv
# Already configured:
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Add this from webhook setup:
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

## Development vs Production

### For Development (localhost testing):
- Webhook endpoints don't work on localhost
- Use **Stripe CLI** to forward webhooks:
  ```bash
  stripe listen --api-key sk_test_xxxxx --forward-to http://localhost:3000/api/webhooks/stripe
  ```
- This gives you a signing secret to use locally

### For Production:
- Configure the webhook in Stripe Dashboard with your production URL
- Webhook events will be sent automatically
- Make sure `STRIPE_WEBHOOK_SECRET` is set in production environment variables

## Webhook Events Handled

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Order marked as `confirmed` |
| `payment_intent.succeeded` | Order marked as `confirmed` |
| `charge.succeeded` | Order marked as `confirmed` |
| `payment_intent.payment_failed` | Order marked as `payment_failed` |
| `checkout.session.async_payment_failed` | Order marked as `payment_failed` |

## Troubleshooting

### Webhook not receiving events?
1. Check the endpoint URL is correct (no typos)
2. Verify signing secret is correct in `.env.local`
3. In test mode, events may take a few seconds to arrive
4. Check Stripe Dashboard → Webhooks → Your endpoint → "Recent deliveries" tab

### "Signature verification failed"?
1. Verify `STRIPE_WEBHOOK_SECRET` is correct
2. Make sure it matches the secret in Stripe Dashboard
3. In development, you may need to use Stripe CLI instead

### Order not updating in Firestore?
1. Check webhook logs in your terminal
2. Verify order ID is being passed correctly
3. Make sure Firestore has write permissions
4. Check if order exists in Firestore (webhook only updates existing orders)

## Next Steps

1. ✅ Copy webhook code to `/app/api/webhooks/stripe/route.ts` (already done)
2. Add `STRIPE_WEBHOOK_SECRET` to `.env.local`
3. Go to Stripe Dashboard and create a webhook endpoint
4. Test with test card `4242 4242 4242 4242`
5. Monitor the logs to see payments being processed

---

**That's it!** Your payment webhook is now set up and will automatically update order statuses when payments are confirmed.
