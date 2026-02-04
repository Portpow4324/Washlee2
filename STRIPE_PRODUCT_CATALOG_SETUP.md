# Stripe Product Catalog Setup - Washlee Laundry

## Overview

Your Stripe product catalog is where you define all services, pricing, and add-ons. This guide walks you through setting up your laundry service pricing in Stripe.

---

## Part 1: Access Product Catalog

### In Stripe Dashboard:
1. Go to **Stripe Dashboard** → **Products**
2. You'll see three main sections:
   - **Analyze** - View sales, revenue, and product performance
   - **Create product** - Add new products/services
   - **All products** - View existing products

### For Washlee, set up:
- Base service (laundry per kg)
- Add-on services (hang dry, delicates, ironing, etc.)
- Subscription tiers (optional, for future loyalty plans)

---

## Part 2: Create Base Product - "Laundry Service"

### Step 1: Click "Create product"

### Step 2: Fill Basic Info

**Product Name:** `Laundry Service`

**Description:** 
```
Professional wash, dry, and fold service. Charged per kilogram.
Includes: Professional washing, expert folding, same bag delivery, 
next-day delivery, live tracking, and customer support.
```

**Type:** `Service` (not physical product)

### Step 3: Set Up Pricing

**Option A: Price Per KG (Recommended)**

1. Click **"Add price"**
2. **Currency:** AUD (Australian Dollars)
3. **Price model:** `Unit price`
4. **Recurring:** No (for base service - pay per order)
5. **Unit price:** `3.00` (your $3.00/kg rate)
6. **Billing period:** N/A (not recurring)

**Save this price**

**Option B: Tiered Pricing (If you want preset tiers)**

Create multiple prices instead of per-kg:
- `5kg Minimum` - $15.00
- `11kg Average` - $33.00
- `23kg Large` - $69.00
- `34kg Family` - $102.00

For now, stick with **Option A** (per kg is more flexible).

### Step 4: Add Product Image (Optional)

Upload a logo or laundry icon to make it look professional on invoices.

### Step 5: Save Product

Click **"Create product"** - You now have your base service!

---

## Part 3: Create Add-On Products

Each add-on is a separate product in Stripe. This lets customers see exactly what they're paying for.

### Add-On 1: Hang Dry Service

**Product Name:** `Hang Dry Service`

**Description:** `Preserve delicate fabrics. Added per kg to laundry service.`

**Type:** `Service`

**Pricing:**
- Currency: AUD
- Price: `3.30` (per kg)
- Billing period: N/A

**Save**

---

### Add-On 2: Delicates Care

**Product Name:** `Delicates Care`

**Description:** `Gentle wash for silk, lace, and fine fabrics. Added per kg.`

**Type:** `Service`

**Pricing:**
- Currency: AUD
- Price: `4.40` (per kg)
- Billing period: N/A

**Save**

---

### Add-On 3: Comforter Service

**Product Name:** `Comforter Service`

**Description:** `Dedicated washing for comforters and large items.`

**Type:** `Service`

**Pricing:**
- Currency: AUD
- Price: `25.00` (flat fee)
- Billing period: N/A

**Save**

---

### Add-On 4: Stain Treatment

**Product Name:** `Stain Treatment`

**Description:** `Professional pre-treatment for stubborn stains. Per item.`

**Type:** `Service`

**Pricing:**
- Currency: AUD
- Price: `0.50` (per item)
- Billing period: N/A

**Save**

---

### Add-On 5: Ironing Service

**Product Name:** `Ironing Service`

**Description:** `Professional ironing. Added per kg to laundry service.`

**Type:** `Service`

**Pricing:**
- Currency: AUD
- Price: `6.60` (per kg)
- Billing period: N/A

**Save**

---

## Part 4: View All Products

After creating all products, go to **Products** → **All products**

You should see:
- Laundry Service (base)
- Hang Dry Service
- Delicates Care
- Comforter Service
- Stain Treatment
- Ironing Service

Each with its own price and description.

---

## Part 5: Coupons (Discounts)

### Create a Discount Coupon

**For example: "WASHLEE20" = 20% off**

1. Go to **Products** → **Coupons**
2. Click **"Create coupon"**
3. **Coupon code:** `WASHLEE20`
4. **Discount type:** `Percentage` or `Amount`
5. **Discount amount:** `20%` (or `$5.00` flat)
6. **Max redemptions:** Leave blank (unlimited)
7. **Expiration date:** Set if needed
8. **Save coupon**

**Result:** Customers can enter `WASHLEE20` at checkout for discount.

---

## Part 6: Shipping Rates

Since you're a **service business** (not shipping physical products), you don't need shipping rates.

**Skip this section** - you handle delivery through your own logistics.

---

## Part 7: Tax Rates

### Set Up Australian GST (10%)

1. Go to **Settings** → **Tax rates**
2. Click **"Create tax rate"**
3. **Tax rate name:** `Australian GST`
4. **Tax rate:** `10%`
5. **Jurisdiction:** Australia
6. **Tax type:** GST (Goods and Services Tax)
7. **Save**

Now when creating invoices, you can apply 10% GST automatically.

---

## Part 8: Pricing Tables (Customer-Facing Pricing Page)

Stripe Pricing Tables let customers see and compare your services.

### Create a Pricing Table in Stripe Dashboard

1. Go to **Products** → **Pricing tables**
2. Click **"Create pricing table"**
3. **Table name:** `Washlee Services`

### Configure Layout

**Products to show:**
- Laundry Service (base price: $3.00/kg)
- Optional add-ons (Hang Dry, Delicates, etc.)

**Display format:**
- Show as tiered (5kg, 11kg, 23kg, 34kg) OR
- Show per-kg pricing

**Recommendation:** Show tiered pricing for simplicity:
- 5kg: $15
- 11kg: $33
- 23kg: $69
- 34kg: $102

### Add CTA Button

**Button text:** `Get Started` or `Book Now`

**Button redirect:** `https://yourdomain.com/booking`

### Generate Code

After creating, click **"Embed"** to get HTML code for your pricing page.

This will replace your current static pricing tables.

---

## Part 9: Link Products to Your Checkout

Currently, your checkout uses hardcoded prices. You can upgrade to use Stripe products:

### Current Setup (Hardcoded)
```typescript
// In /app/api/checkout/route.ts
price_data: {
  currency: 'aud',
  product_data: {
    name: 'Laundry Service',
  },
  unit_amount: 3.00 * 100, // $3.00
}
```

### Upgraded Setup (Using Stripe Products)
```typescript
// Reference product from Stripe catalog
price: 'price_1ABC123xyz', // Get this from Stripe Dashboard
quantity: 5, // 5kg
```

**Benefits:**
- ✓ Prices stay in sync across website and Stripe
- ✓ Easier to update pricing (update once in Stripe)
- ✓ Invoices show product names automatically
- ✓ Analytics on product performance

---

## Part 10: How It All Connects

```
┌─────────────────────────────────────┐
│   Stripe Product Catalog            │
│                                     │
│  Products:                          │
│  • Laundry Service ($3/kg)         │
│  • Hang Dry (+$3.30/kg)            │
│  • Delicates (+$4.40/kg)           │
│  • Comforter (+$25)                │
│  • Stain Treatment (+$0.50/item)   │
│  • Ironing (+$6.60/kg)             │
│                                     │
│  + Tax Rates (10% GST)             │
│  + Coupons (WASHLEE20, etc.)       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Your Website Checkout Flow        │
│                                     │
│  1. User selects weight (5kg)       │
│  2. User adds add-ons               │
│  3. System calculates total         │
│  4. Calls /api/checkout             │
│  5. Creates Stripe session          │
│  6. Redirects to Stripe payment     │
│  7. Webhook updates order           │
└─────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Customer Receipt/Invoice          │
│                                     │
│  Order #12345                       │
│  Laundry Service (5kg) .... $15.00  │
│  Hang Dry (5kg) ........... $16.50  │
│  Stain Treatment (2 items) . $1.00  │
│  Subtotal ................. $32.50  │
│  GST (10%) ................ $3.25   │
│  TOTAL .................... $35.75  │
└─────────────────────────────────────┘
```

---

## Part 11: Getting Product IDs for Your Code

Once you've created products in Stripe, you need their IDs to reference them.

### Find Product ID

1. Go to **Products** → **All products**
2. Click on a product (e.g., "Laundry Service")
3. Scroll down to **API ID**
4. Copy it (looks like: `prod_1ABC123xyz`)

### Find Price ID

1. In the same product page
2. Click on the **Price** section
3. Copy the **Price ID** (looks like: `price_1ABC123xyz`)

### Save These IDs

Create a `.env.local` section:
```env
STRIPE_PRODUCT_LAUNDRY=prod_1ABC123xyz
STRIPE_PRICE_LAUNDRY=price_1ABC123xyz

STRIPE_PRODUCT_HANG_DRY=prod_2DEF456abc
STRIPE_PRICE_HANG_DRY=price_2DEF456abc

STRIPE_PRODUCT_DELICATES=prod_3GHI789def
STRIPE_PRICE_DELICATES=price_3GHI789def
```

Then reference in code:
```typescript
price: process.env.STRIPE_PRICE_LAUNDRY,
```

---

## Part 12: Quick Checklist

- [ ] Create "Laundry Service" product ($3.00/kg)
- [ ] Create "Hang Dry Service" add-on ($3.30/kg)
- [ ] Create "Delicates Care" add-on ($4.40/kg)
- [ ] Create "Comforter Service" add-on ($25.00)
- [ ] Create "Stain Treatment" add-on ($0.50/item)
- [ ] Create "Ironing Service" add-on ($6.60/kg)
- [ ] Create GST tax rate (10%)
- [ ] Create "WASHLEE20" coupon (20% off) - optional
- [ ] Get product IDs and price IDs
- [ ] Save IDs to `.env.local`
- [ ] Test checkout with products

---

## Part 13: View Analytics

After customers start paying:

1. Go to **Products** → **Analyze**
2. See:
   - **Total revenue** - How much you've made
   - **Revenue by product** - Which add-ons are popular
   - **Sales trends** - Peak ordering times
   - **Customer count** - How many unique customers
   - **Refunds** - Disputed payments

This helps you understand what customers want most.

---

## Summary

| Section | Purpose | For Washlee |
|---------|---------|------------|
| **Products** | Define your services | Laundry + 5 add-ons |
| **Pricing** | Set prices per service | $3/kg base, various add-ons |
| **Coupons** | Discounts | WASHLEE20 (20% off) |
| **Shipping** | Delivery costs | Skip (you handle this) |
| **Tax rates** | Apply taxes | 10% GST (Australia) |
| **Pricing Tables** | Customer-facing | Embed on pricing page |
| **Analyze** | View sales data | Track product popularity |

**Next Steps:**
1. Create all products in Stripe Dashboard
2. Note the product and price IDs
3. Update `.env.local` with IDs
4. (Optional) Integrate product IDs into checkout code for better sync

You're ready to manage your pricing professionally! 🎉
