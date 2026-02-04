import { NextRequest, NextResponse } from 'next/server'
import admin from 'firebase-admin'
import '@/lib/firebaseAdmin' // Initialize Firebase Admin

/**
 * GET /api/admin/get-auth-users
 * 
 * Fetches all Firebase Authentication users
 * Returns users that don't have corresponding employee profiles
 * 
 * Used by: Admin dashboard to identify users to convert to employees
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication check (admin only)
    // const authHeader = request.headers.get('authorization')
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Get Firebase Admin instance
    const adminApp = admin.app()
    const auth = admin.auth(adminApp)

    // Get all users from Firebase Auth
    const listUsersResult = await auth.listUsers(1000) // Max 1000 users per call
    
    const users = listUsersResult.users.map(user => {
      // Handle metadata timestamps which can be Date or string
      const getTimeString = (time: any): string => {
        if (!time) return 'Never'
        return typeof time === 'string' ? time : time.toISOString?.() || String(time)
      }

      return {
        uid: user.uid,
        email: user.email || 'No email',
        displayName: user.displayName || 'No name',
        createdAt: getTimeString(user.metadata?.creationTime) || 'Unknown',
        lastSignInTime: getTimeString(user.metadata?.lastSignInTime) || 'Never',
      }
    })

    return NextResponse.json({
      success: true,
      count: users.length,
      users: users,
      message: `Retrieved ${users.length} Firebase Auth users`
    })
  } catch (error: any) {
    console.error('[API] Error fetching auth users:', error)
    
    // Check if error is about missing Firebase Admin SDK
    if (error.message?.includes('FIREBASE_ADMIN_SDK_PATH') || error.code === 'app/invalid-credential') {
      return NextResponse.json({
        success: false,
        error: 'Firebase Admin SDK not configured',
        message: 'To enable employee sync, set up Firebase Admin SDK credentials in environment variables',
        hint: 'Set FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID in .env.local',
      }, { status: 503 })
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch users',
      code: error.code || 'UNKNOWN_ERROR'
    }, { status: 500 })
  }
}
