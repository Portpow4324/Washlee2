/**
 * Employee Login API Route
 * 
 * Authenticates employees using their 6-digit employee ID + password
 * 
 * POST /api/auth/employee-login
 * Body: {
 *   employeeId: string (6-digit code)
 *   password: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  try {
    const { employeeId, password } = await req.json()

    // Validate input
    if (!employeeId || !password) {
      return NextResponse.json(
        { success: false, error: 'Employee ID and password are required' },
        { status: 400 }
      )
    }

    if (!/^\d{6}$/.test(employeeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid employee ID format' },
        { status: 400 }
      )
    }

    // Query employees collection by employeeId
    const employeesRef = collection(db, 'employees')
    const q = query(employeesRef, where('employeeId', '==', employeeId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Employee ID not found' },
        { status: 401 }
      )
    }

    const employeeDoc = querySnapshot.docs[0]
    const employee = employeeDoc.data()

    // Verify employee status
    if (employee.status === 'rejected' || employee.status === 'suspended') {
      return NextResponse.json(
        { success: false, error: `Account is ${employee.status}` },
        { status: 403 }
      )
    }

    // Attempt to sign in with email and password
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        employee.email,
        password
      )

      // Get ID token for authentication
      const idToken = await userCredential.user.getIdToken()

      return NextResponse.json(
        {
          success: true,
          token: idToken,
          employee: {
            uid: employee.uid,
            employeeId: employee.employeeId,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            state: employee.state,
            status: employee.status,
            rating: employee.rating,
            totalJobs: employee.totalJobs,
            totalEarnings: employee.totalEarnings,
          },
        },
        { status: 200 }
      )
    } catch (authError: any) {
      if (authError.code === 'auth/wrong-password') {
        return NextResponse.json(
          { success: false, error: 'Incorrect password' },
          { status: 401 }
        )
      }
      throw authError
    }
  } catch (error: any) {
    console.error('Employee login error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed' },
      { status: 500 }
    )
  }
}
