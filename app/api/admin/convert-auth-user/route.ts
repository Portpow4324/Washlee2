import { NextRequest, NextResponse } from 'next/server'
import admin from 'firebase-admin'
import { setDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import '@/lib/firebaseAdmin' // Initialize Firebase Admin

/**
 * POST /api/admin/convert-auth-user
 * 
 * Converts a Firebase Auth user to an Employee or Customer profile
 * 
 * Body:
 * {
 *   uid: string (Firebase Auth UID)
 *   email: string
 *   displayName: string
 *   type: 'employee' | 'customer'
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { uid, email, displayName, type } = body

    if (!uid || !email || !type) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: uid, email, type'
      }, { status: 400 })
    }

    if (type !== 'employee' && type !== 'customer') {
      return NextResponse.json({
        success: false,
        error: 'Type must be "employee" or "customer"'
      }, { status: 400 })
    }

    // Create profile in appropriate collection
    if (type === 'employee') {
      const employeeProfile = {
        uid,
        email,
        firstName: displayName?.split(' ')[0] || 'Employee',
        lastName: displayName?.split(' ')[1] || '',
        phone: '',
        state: '',
        applicationType: 'employee',
        employmentType: 'contractor',
        status: 'pending',
        verificationStatus: {
          emailVerified: false,
          phoneVerified: false,
          idVerified: false,
          backgroundCheckPassed: false,
        },
        applicationStep: 0,
        availability: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        },
        rating: 0,
        totalJobs: 0,
        totalEarnings: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        onboardingCompleted: false,
      }

      // Write to Firebase using client SDK
      const docRef = doc(db, 'employees', uid)
      await setDoc(docRef, employeeProfile)

      return NextResponse.json({
        success: true,
        message: `Successfully converted ${email} to employee profile`,
        type: 'employee',
        uid
      })
    } else if (type === 'customer') {
      const customerProfile = {
        uid,
        email,
        firstName: displayName?.split(' ')[0] || 'Customer',
        lastName: displayName?.split(' ')[1] || '',
        phone: '',
        applicationType: 'customer',
        status: 'active',
        personalUse: 'personal',
        ageOver65: false,
        preferenceMarketingTexts: false,
        preferenceAccountTexts: true,
        selectedPlan: 'basic',
        totalOrders: 0,
        totalSpent: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        onboardingCompleted: false,
      }

      // Write to Firebase using client SDK
      const docRef = doc(db, 'customers', uid)
      await setDoc(docRef, customerProfile)

      return NextResponse.json({
        success: true,
        message: `Successfully converted ${email} to customer profile`,
        type: 'customer',
        uid
      })
    }
  } catch (error: any) {
    console.error('[API] Error converting user:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to convert user',
      code: error.code || 'UNKNOWN_ERROR'
    }, { status: 500 })
  }
}
