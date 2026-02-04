#!/bin/bash

# Washlee - Pre-Deployment Fix Script
# Run this script to automatically fix the critical issues identified in VERCEL_PRE_DEPLOYMENT_AUDIT.md
# WARNING: This script will delete files. Ensure you have committed to git first!

set -e

echo "🔧 Washlee Pre-Deployment Fix Script"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "app/api" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Check git status
if [ -z "$(git status --short)" ]; then
    echo "✅ Git working directory is clean"
else
    echo "⚠️  Warning: You have uncommitted changes"
    echo "   Please commit or stash changes before running this script"
    read -p "   Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📋 Step 1: Removing duplicate API files..."

# Remove duplicate API files
if [ -f "app/api/orders/index.ts" ]; then
    rm app/api/orders/index.ts
    echo "   ✓ Removed app/api/orders/index.ts"
fi

if [ -f "app/api/webhooks/stripe.ts" ]; then
    rm app/api/webhooks/stripe.ts
    echo "   ✓ Removed app/api/webhooks/stripe.ts"
fi

if [ -f "app/api/notifications/send.ts" ]; then
    rm app/api/notifications/send.ts
    echo "   ✓ Removed app/api/notifications/send.ts"
fi

if [ -f "app/api/payments.ts" ]; then
    rm app/api/payments.ts
    echo "   ✓ Removed app/api/payments.ts"
fi

echo ""
echo "📁 Step 2: Reorganizing middleware..."

# Create lib/middleware directory
if [ ! -d "lib/middleware" ]; then
    mkdir -p lib/middleware
    echo "   ✓ Created lib/middleware/"
fi

# Move middleware/admin.ts to lib/middleware/admin.ts
if [ -f "middleware/admin.ts" ]; then
    cp middleware/admin.ts lib/middleware/admin.ts
    rm middleware/admin.ts
    rmdir middleware 2>/dev/null || true
    echo "   ✓ Moved middleware/admin.ts → lib/middleware/admin.ts"
fi

echo ""
echo "🗂️  Step 3: Standardizing API route structure..."
echo ""
echo "   This requires manual reorganization of these files:"
echo "   (Each should move to a subfolder with route.ts)"
echo ""

api_files=(
    "app/api/admin/analytics.ts"
    "app/api/admin/pro-approvals.ts"
    "app/api/claims/resolution.ts"
    "app/api/emails/send.ts"
    "app/api/loyalty/points.ts"
    "app/api/notifications/preferences.ts"
    "app/api/payment/checkout.ts"
    "app/api/pro/earnings.ts"
    "app/api/pro/orders.ts"
    "app/api/pro/payouts.ts"
    "app/api/pro/verification.ts"
    "app/api/reviews/moderation.ts"
    "app/api/subscriptions/update.ts"
    "app/api/tracking/[orderId].ts"
)

for file in "${api_files[@]}"; do
    if [ -f "$file" ]; then
        dir=$(dirname "$file")
        base=$(basename "$file" .ts)
        
        if [ "$base" != "route" ]; then
            mkdir -p "$dir/$base"
            mv "$file" "$dir/$base/route.ts"
            echo "   ✓ Reorganized: $file → $dir/$base/route.ts"
        fi
    fi
done

echo ""
echo "🔧 Step 4: Checking Firebase Admin configuration..."

# Check if firebaseAdmin.ts needs updating
if grep -q "export const adminRealtimeDb = admin.database();" lib/firebaseAdmin.ts; then
    echo "   ⚠️  Firebase Admin needs manual update to lib/firebaseAdmin.ts"
    echo "   See: VERCEL_PRE_DEPLOYMENT_AUDIT.md - Step 1"
else
    echo "   ✓ Firebase Admin configuration looks good"
fi

echo ""
echo "✅ Automatic fixes completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Review and update lib/firebaseAdmin.ts (if needed)"
echo "   2. Update imports for moved files"
echo "   3. Update imports for lib/middleware/admin.ts"
echo "   4. Run: npm run build"
echo "   5. Run: npm run dev (test locally)"
echo "   6. Commit and push to git"
echo ""
echo "📖 Full details: see VERCEL_PRE_DEPLOYMENT_AUDIT.md"
echo ""
