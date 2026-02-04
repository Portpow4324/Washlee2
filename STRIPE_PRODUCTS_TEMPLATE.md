# Stripe Products - Copy & Paste Template

Simply copy each section below and paste into Stripe Dashboard → Products → Create product

---

## Product 1: Laundry Service (Base)

**Name:**
```
Laundry Service
```

**Description:**
```
Professional wash, dry, and fold service. Charged per kilogram.

Includes:
✓ Professional washing & drying
✓ Expert folding or hanging
✓ Same bag for pickup & delivery
✓ Next-day delivery
✓ Live order tracking
✓ 24/7 customer support
```

**Image:** (Optional - any laundry icon)

**Pricing - Option A: Per Kilogram (Flexible)**
- Recurring: `One-off`
- Amount: `3.00`
- Currency: `AUD`

This lets your booking page calculate any weight (5kg, 11kg, 23kg, 34kg, etc.)

**OR Pricing - Option B: Fixed Tiers (Simple)**

If you want customers to choose from preset weights, create multiple prices:

1. Click **"Add more pricing"** after creating first price
2. Add each tier:

| Weight | Price |
|---|---|
| 5 kg | $15.00 |
| 11 kg | $33.00 |
| 23 kg | $69.00 |
| 34 kg | $102.00 |

**Which should I use?**
- **Per kg ($3.00)**: More flexible, works with your booking page calculator
- **Fixed tiers**: Simpler for customers, but less flexible

**Recommendation:** Use **Per kg** for now, since your booking page already calculates by weight.

---

## Product 2: Hang Dry Service

**Name:**
```
Hang Dry Service
```

**Description:**
```
Preserve delicate fabrics with professional hang-drying.

Charged per kilogram added to your laundry service.
```

**Image:** (Optional)

**Pricing:**
- Recurring: `One-off`
- Amount: `3.30`
- Currency: `AUD`

---

## Product 3: Delicates Care

**Name:**
```
Delicates Care
```

**Description:**
```
Gentle wash for silk, lace, and fine fabrics.

Protects your most delicate items with specialized care. Per kilogram.
```

**Image:** (Optional)

**Pricing:**
- Recurring: `One-off`
- Amount: `4.40`
- Currency: `AUD`

---

## Product 4: Comforter Service

**Name:**
```
Comforter Service
```

**Description:**
```
Professional washing and drying for comforters and large items.

One-time flat fee per comforter or large item.
```

**Image:** (Optional)

**Pricing:**
- Recurring: `One-off`
- Amount: `25.00`
- Currency: `AUD`

---

## Product 5: Stain Treatment

**Name:**
```
Stain Treatment
```

**Description:**
```
Professional pre-treatment for stubborn stains and marks.

Applied before washing to remove difficult stains. Per item.
```

**Image:** (Optional)

**Pricing:**
- Recurring: `One-off`
- Amount: `0.50`
- Currency: `AUD`

---

## Product 6: Ironing Service

**Name:**
```
Ironing Service
```

**Description:**
```
Professional ironing service for perfectly pressed clothes.

Charged per kilogram added to your laundry service.
```

**Image:** (Optional)

**Pricing:**
- Recurring: `One-off`
- Amount: `6.60`
- Currency: `AUD`

---

## Instructions

1. Go to **Stripe Dashboard** → **Products**
2. Click **"Create product"**
3. Copy the **Name** above and paste it
4. Copy the **Description** above and paste it
5. Leave **Image** empty (optional)
6. Set **Pricing:**
   - Select: `One-off` (not recurring)
   - Enter the **Amount** (e.g., `3.00`)
   - Currency: `AUD`
7. Click **"Add product"**
8. Repeat for each product

---

## After Creating All Products

1. Go to **Products** → **All products**
2. For each product, click it and scroll down to find:
   - **API ID** (looks like: `prod_1ABC123xyz`)
   - **Price ID** (looks like: `price_1ABC123xyz`)
3. Save these IDs somewhere (you'll need them later for advanced integrations)

---

## Example: What Your Stripe Dashboard Should Show

After creating all 6 products, you should see:

| Product Name | Amount | Currency |
|---|---|---|
| Laundry Service | $3.00 | AUD |
| Hang Dry Service | $3.30 | AUD |
| Delicates Care | $4.40 | AUD |
| Comforter Service | $25.00 | AUD |
| Stain Treatment | $0.50 | AUD |
| Ironing Service | $6.60 | AUD |

✅ You're all set!

---

## FAQ

**Q: Should I make these recurring?**
A: No, keep them as `One-off`. Customers pay per order, not subscriptions.

**Q: Do I need to upload images?**
A: Optional. They look nice on invoices but aren't required.

**Q: Why "per kilogram" in descriptions?**
A: So customers understand they might be charged differently based on weight. Your booking page will handle the calculation.

**Q: What about minimum order ($24)?**
A: That's enforced in your booking page code, not in Stripe. Stripe will accept any amount.

**Q: Can I change prices later?**
A: Yes! Go to product → edit price. Old prices stay for reference, new prices apply to future orders.

---

## How to Add Multiple Prices to One Product

**Example: Laundry Service with preset weight tiers**

### Step 1: Create First Price

In the **Pricing** section when creating "Laundry Service":
- Amount: `15.00` (for 5kg)
- Currency: `AUD`
- Recurring: `One-off`
- Click **"Add price"** or **"More pricing options"**

### Step 2: Add Second Price

After saving the first price, you should see **"Add more pricing"** button:
- Click it
- Amount: `33.00` (for 11kg)
- Currency: `AUD`
- Click **"Add price"**

### Step 3: Add Third Price

- Click **"Add more pricing"** again
- Amount: `69.00` (for 23kg)
- Click **"Add price"**

### Step 4: Add Fourth Price

- Click **"Add more pricing"** once more
- Amount: `102.00` (for 34kg)
- Click **"Add price"**

### Result

One product "Laundry Service" with 4 prices:
- $15.00 (5kg minimum)
- $33.00 (11kg average)
- $69.00 (23kg large)
- $102.00 (34kg family)

Customers choose which tier they want at checkout.

---

## Comparing the Two Approaches

| Aspect | Per Kilogram | Fixed Tiers |
|---|---|---|
| **Flexibility** | ✓ Any weight | ✗ Only 4 options |
| **Simplicity** | ✗ Math needed | ✓ Easy to choose |
| **Customer Experience** | Fine | Better (clear choices) |
| **Your Work** | Minimal | Minimal (just add prices) |
| **Matches Your Booking Page** | ✓ Yes | ✗ No (different flow) |

### Recommendation

Use **fixed tiers** if you want customers to see simple preset options ($15, $33, $69, $102).

Use **per kg** if you want to dynamically calculate (5kg = $15, 6kg = $18, 7kg = $21, etc.).

**For now: Start with per kg ($3.00) since your booking page already does the math.**

---

## If You Want Both (Advanced)

Create two separate Stripe products:

**Product A: "Laundry Service - Custom Weight"**
- Single price: $3.00/kg
- For flexible orders (5kg, 6kg, 7kg, etc.)

**Product B: "Laundry Service - Preset Tiers"**
- Multiple prices: $15 (5kg), $33 (11kg), $69 (23kg), $102 (34kg)
- For customers who want simple choices

Then your booking page can offer both options.

But for simplicity, just use Product A (per kg) for now.
