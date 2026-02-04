import { NextRequest, NextResponse } from 'next/server'
import admin from 'firebase-admin'

/**
 * GET /api/admin/firestore-diagnostics
 * Checks Firestore connectivity and Admin SDK status
 */
export async function GET(request: NextRequest) {
  try {
    const results: any = {
      timestamp: new Date().toISOString(),
      checks: {},
    }

    // Check 1: Admin App Initialization
    results.checks.adminAppInit = {
      status: 'checking...',
      message: '',
    }

    try {
      if (!admin.apps.length) {
        const serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID || 'washlee-7d3c6',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }

        // Validate service account
        if (!serviceAccount.projectId) {
          throw new Error('FIREBASE_PROJECT_ID not set')
        }
        if (!serviceAccount.clientEmail) {
          throw new Error('FIREBASE_CLIENT_EMAIL not set')
        }
        if (!serviceAccount.privateKey) {
          throw new Error('FIREBASE_PRIVATE_KEY not set')
        }

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
          projectId: serviceAccount.projectId,
        })

        results.checks.adminAppInit.status = 'success'
        results.checks.adminAppInit.message = 'Admin app initialized'
      } else {
        results.checks.adminAppInit.status = 'success'
        results.checks.adminAppInit.message = 'Admin app already initialized'
      }
    } catch (error: any) {
      results.checks.adminAppInit.status = 'error'
      results.checks.adminAppInit.message = error.message
      results.checks.adminAppInit.error = error.toString()
    }

    // Check 2: Firestore Connection
    results.checks.firestoreConnection = {
      status: 'checking...',
      message: '',
    }

    try {
      const db = admin.firestore()
      const testDoc = await db.collection('_diagnostics').doc('connection-test').get()
      results.checks.firestoreConnection.status = 'success'
      results.checks.firestoreConnection.message = 'Firestore connection successful'
    } catch (error: any) {
      results.checks.firestoreConnection.status = 'error'
      results.checks.firestoreConnection.message = error.message
      results.checks.firestoreConnection.error = error.toString()
    }

    // Check 3: Write Permission Test
    results.checks.writePermission = {
      status: 'checking...',
      message: '',
    }

    try {
      const db = admin.firestore()
      const testRef = db.collection('_diagnostics').doc(`test-${Date.now()}`)
      await testRef.set({
        test: true,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      })
      results.checks.writePermission.status = 'success'
      results.checks.writePermission.message = 'Write permission test successful'
      
      // Clean up
      await testRef.delete()
    } catch (error: any) {
      results.checks.writePermission.status = 'error'
      results.checks.writePermission.message = error.message
      results.checks.writePermission.error = error.toString()
    }

    // Check 4: Orders Collection
    results.checks.ordersCollection = {
      status: 'checking...',
      message: '',
    }

    try {
      const db = admin.firestore()
      const ordersRef = db.collection('orders')
      const snapshot = await ordersRef.limit(1).get()
      results.checks.ordersCollection.status = 'success'
      results.checks.ordersCollection.message = `Orders collection exists (${snapshot.size} documents found)`
      results.checks.ordersCollection.documentCount = snapshot.size
    } catch (error: any) {
      results.checks.ordersCollection.status = 'error'
      results.checks.ordersCollection.message = error.message
      results.checks.ordersCollection.error = error.toString()
    }

    // Summary
    const allChecks = Object.values(results.checks) as any[]
    const passedChecks = allChecks.filter((c) => c.status === 'success').length
    const failedChecks = allChecks.filter((c) => c.status === 'error').length

    results.summary = {
      totalChecks: allChecks.length,
      passed: passedChecks,
      failed: failedChecks,
      allPassed: failedChecks === 0,
    }

    const statusCode = results.summary.allPassed ? 200 : 503

    return NextResponse.json(results, { status: statusCode })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Diagnostics failed',
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
