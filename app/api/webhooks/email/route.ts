import { NextRequest, NextResponse } from 'next/server'
import admin from 'firebase-admin'

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'washlee-7d3c6',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@washlee-7d3c6.iam.gserviceaccount.com',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: serviceAccount.projectId,
    })
  } catch (error: any) {
    if (!error.message.includes('already exists')) {
      console.error('[EMAIL-WEBHOOK] Firebase init error:', error.message)
    }
  }
}

const db = admin.firestore()

/**
 * POST /api/webhooks/email
 * Handles SendGrid webhook events (bounce, delivered, opened, clicked)
 * Tracks email engagement and delivery status
 */
export async function POST(request: NextRequest) {
  try {
    const events = await request.json()

    if (!Array.isArray(events)) {
      console.warn('[EMAIL-WEBHOOK] Invalid payload - not an array')
      return NextResponse.json({ received: false }, { status: 400 })
    }

    console.log(`[EMAIL-WEBHOOK] Received ${events.length} event(s)`)

    for (const event of events) {
      const { event: eventType, email, messageId } = event

      console.log(`[EMAIL-WEBHOOK] Processing: ${eventType} for ${email}`)

      switch (eventType) {
        case 'delivered': {
          // Email successfully delivered
          const emailRef = db.collection('email_events').doc(messageId || email)
          await emailRef.set(
            {
              email,
              messageId: messageId || email,
              type: 'delivered',
              deliveredAt: admin.firestore.FieldValue.serverTimestamp(),
              timestamp: new Date().toISOString(),
            },
            { merge: true }
          )

          console.log(`[EMAIL-WEBHOOK] ✓ Email delivered to ${email}`)
          break
        }

        case 'bounce': {
          // Email bounced (hard or soft)
          const bounceType = event.bounce_type || 'unknown'
          const emailRef = db.collection('email_events').doc(messageId || email)
          await emailRef.set(
            {
              email,
              messageId: messageId || email,
              type: 'bounce',
              bounceType, // 'hard' or 'soft'
              bouncedAt: admin.firestore.FieldValue.serverTimestamp(),
              reason: event.reason || 'Unknown',
              timestamp: new Date().toISOString(),
            },
            { merge: true }
          )

          // Mark email as bounced in user profile (if applicable)
          if (bounceType === 'hard') {
            const usersRef = db.collection('users')
            const query = await usersRef.where('email', '==', email).limit(1).get()
            if (!query.empty) {
              const userDoc = query.docs[0]
              await userDoc.ref.update({
                emailVerified: false,
                emailBounced: true,
                bouncedAt: admin.firestore.FieldValue.serverTimestamp(),
              })
            }
          }

          console.log(`[EMAIL-WEBHOOK] ⚠ Email bounced (${bounceType}): ${email}`)
          break
        }

        case 'open': {
          // Email opened
          const emailRef = db.collection('email_events').doc(messageId || email)
          await emailRef.set(
            {
              email,
              messageId: messageId || email,
              type: 'open',
              openedAt: admin.firestore.FieldValue.serverTimestamp(),
              userAgent: event.useragent || '',
              timestamp: new Date().toISOString(),
            },
            { merge: true }
          )

          console.log(`[EMAIL-WEBHOOK] ✓ Email opened by ${email}`)
          break
        }

        case 'click': {
          // Email link clicked
          const emailRef = db.collection('email_events').doc(messageId || email)
          await emailRef.set(
            {
              email,
              messageId: messageId || email,
              type: 'click',
              clickedAt: admin.firestore.FieldValue.serverTimestamp(),
              url: event.url || '',
              userAgent: event.useragent || '',
              timestamp: new Date().toISOString(),
            },
            { merge: true }
          )

          console.log(`[EMAIL-WEBHOOK] ✓ Email link clicked by ${email}`)
          break
        }

        case 'dropped': {
          // Email dropped
          const emailRef = db.collection('email_events').doc(messageId || email)
          await emailRef.set(
            {
              email,
              messageId: messageId || email,
              type: 'dropped',
              droppedAt: admin.firestore.FieldValue.serverTimestamp(),
              reason: event.reason || 'Unknown',
              timestamp: new Date().toISOString(),
            },
            { merge: true }
          )

          console.log(`[EMAIL-WEBHOOK] ✗ Email dropped: ${email}`)
          break
        }

        case 'spamreport': {
          // Email marked as spam
          const emailRef = db.collection('email_events').doc(messageId || email)
          await emailRef.set(
            {
              email,
              messageId: messageId || email,
              type: 'spamreport',
              reportedAt: admin.firestore.FieldValue.serverTimestamp(),
              timestamp: new Date().toISOString(),
            },
            { merge: true }
          )

          // Add to spam list
          const spamListRef = db.collection('email_spam_list').doc(email)
          await spamListRef.set(
            {
              email,
              reportedAt: admin.firestore.FieldValue.serverTimestamp(),
              count: admin.firestore.FieldValue.increment(1),
            },
            { merge: true }
          )

          console.log(`[EMAIL-WEBHOOK] 🚨 Email reported as spam: ${email}`)
          break
        }

        case 'unsubscribe': {
          // User unsubscribed
          const emailRef = db.collection('email_events').doc(messageId || email)
          await emailRef.set(
            {
              email,
              messageId: messageId || email,
              type: 'unsubscribe',
              unsubscribedAt: admin.firestore.FieldValue.serverTimestamp(),
              timestamp: new Date().toISOString(),
            },
            { merge: true }
          )

          // Add to unsubscribe list
          const unsubscribeRef = db.collection('email_unsubscribe_list').doc(email)
          await unsubscribeRef.set(
            {
              email,
              unsubscribedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          )

          // Mark user as unsubscribed
          const usersRef = db.collection('users')
          const query = await usersRef.where('email', '==', email).limit(1).get()
          if (!query.empty) {
            const userDoc = query.docs[0]
            await userDoc.ref.update({
              emailUnsubscribed: true,
              unsubscribedAt: admin.firestore.FieldValue.serverTimestamp(),
            })
          }

          console.log(`[EMAIL-WEBHOOK] 📧 User unsubscribed: ${email}`)
          break
        }

        default:
          console.log(`[EMAIL-WEBHOOK] Unhandled event type: ${eventType}`)
      }
    }

    return NextResponse.json({ received: true, processed: events.length }, { status: 200 })
  } catch (error: any) {
    console.error('[EMAIL-WEBHOOK] Processing error:', error.message)
    return NextResponse.json(
      { error: error.message, received: false },
      { status: 200 } // Return 200 to avoid retries
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Email webhook endpoint is running',
    endpoint: '/api/webhooks/email',
    method: 'POST',
    events: [
      'delivered',
      'bounce',
      'open',
      'click',
      'dropped',
      'spamreport',
      'unsubscribe',
    ],
  })
}
