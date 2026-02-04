import { NextRequest, NextResponse } from 'next/server'
import {
  savePaymentMethod,
  getPaymentMethods,
  processRefund,
} from '@/lib/paymentService'

// NOTE: This API uses Stripe directly and does NOT depend on Firebase Admin SDK
// Firebase Firestore saves are optional/best-effort only
// This ensures payment processing works even if Firebase has issues

const Stripe = require('stripe')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, customerId, amount, orderId, paymentMethodId, description } = body

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID required' },
        { status: 400 }
      )
    }

    // Initialize Stripe with secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-12-15.clover'
    })

    switch (action) {
      case 'create_payment_intent': {
        if (!amount || !orderId) {
          return NextResponse.json(
            { error: 'Amount and Order ID required' },
            { status: 400 }
          )
        }

        console.log('[PAYMENTS-API] Creating payment intent for customerId:', customerId)
        
        try {
          // Step 1: Create Stripe customer (required for payment intent)
          console.log('[PAYMENTS-API] Step 1: Creating Stripe customer...')
          
          const customer = await stripe.customers.create({
            email: `user-${customerId}@washlee.local`,
            name: 'Customer',
            metadata: {
              firebaseUid: customerId
            }
          })
          
          const stripeCustomerId = customer.id
          console.log('[PAYMENTS-API] ✓ Stripe customer created:', stripeCustomerId)

          // Step 2: Create payment intent with Stripe customer
          console.log('[PAYMENTS-API] Step 2: Creating payment intent...')
          
          const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert AUD to cents
            currency: 'aud',
            customer: stripeCustomerId,
            description: description || `Order ${orderId}`,
            metadata: {
              orderId,
              firebaseUid: customerId,
              timestamp: new Date().toISOString()
            }
          })

          console.log('[PAYMENTS-API] ✓ Payment intent created:', {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount
          })

          // Step 3: Return payment details to client
          return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            stripeCustomerId: stripeCustomerId,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
          }, { status: 200 })

        } catch (stripeErr: any) {
          const errorMsg = stripeErr.message || 'Stripe API error'
          console.error('[PAYMENTS-API] Stripe error:', errorMsg)
          
          return NextResponse.json(
            { error: `Payment processing failed: ${errorMsg}` },
            { status: 500 }
          )
        }
      }

      case 'save_payment_method': {
        if (!paymentMethodId) {
          return NextResponse.json(
            { error: 'Payment method ID required' },
            { status: 400 }
          )
        }

        const result = await savePaymentMethod(
          customerId,
          paymentMethodId,
          body.isDefault || false
        )

        return NextResponse.json(result, { status: 200 })
      }

      case 'get_payment_methods': {
        const methods = await getPaymentMethods(customerId)
        return NextResponse.json({ methods }, { status: 200 })
      }

      case 'refund_payment': {
        const { paymentIntentId, refundAmount } = body

        if (!paymentIntentId) {
          return NextResponse.json(
            { error: 'Payment intent ID required' },
            { status: 400 }
          )
        }

        const success = await processRefund(
          paymentIntentId,
          refundAmount ? Math.round(refundAmount * 100) : undefined
        )

        return NextResponse.json({ success }, { status: 200 })
      }

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
    console.error('[PAYMENTS-API] Request error:', errorMsg)
    
    return NextResponse.json(
      { error: errorMsg || 'Internal server error' },
      { status: 500 }
    )
  }
}
