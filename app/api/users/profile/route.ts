/**
 * User Type Management API
 * Endpoints for checking user roles, upgrading accounts, and managing dual profiles
 */

import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { 
  getEmployeeProfile, 
  getCustomerProfile, 
  upgradeCustomerToEmployee,
  upgradeEmployeeToCustomer,
  getPrimaryUserRole,
  getUserMetadata
} from '@/lib/userManagement'

// ============================================
// GET /api/users/profile-info
// Get user profile information and roles
// ============================================
export async function GET(req: NextRequest) {
  try {
    const uid = req.headers.get('X-User-ID')
    if (!uid) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user metadata
    const metadata = await getUserMetadata(uid)
    
    // Get both profiles
    const employeeProfile = await getEmployeeProfile(uid)
    const customerProfile = await getCustomerProfile(uid)

    return NextResponse.json({
      uid,
      userTypes: metadata?.userTypes || [],
      primaryUserType: metadata?.primaryUserType,
      hasEmployeeProfile: !!employeeProfile,
      hasCustomerProfile: !!customerProfile,
      employeeData: employeeProfile ? {
        status: employeeProfile.status,
        rating: employeeProfile.rating,
        totalJobs: employeeProfile.totalJobs,
        verificationStatus: employeeProfile.verificationStatus,
      } : null,
      customerData: customerProfile ? {
        status: customerProfile.status,
        rating: customerProfile.rating,
        totalOrders: customerProfile.totalOrders,
        selectedPlan: customerProfile.selectedPlan,
      } : null,
    })
  } catch (error) {
    console.error('Error fetching profile info:', error)
    return NextResponse.json({ error: 'Failed to fetch profile info' }, { status: 500 })
  }
}

// ============================================
// POST /api/users/upgrade-to-employee
// Upgrade existing customer account to also have employee profile
// ============================================
export async function POST(req: NextRequest) {
  try {
    const { uid, employeeData } = await req.json()
    
    if (!uid) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check if customer exists
    const customer = await getCustomerProfile(uid)
    if (!customer) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 })
    }

    // Check if already has employee profile
    const existingEmployee = await getEmployeeProfile(uid)
    if (existingEmployee) {
      return NextResponse.json({ error: 'User already has employee profile' }, { status: 400 })
    }

    // Upgrade to employee
    await upgradeCustomerToEmployee(uid, employeeData)

    return NextResponse.json({
      success: true,
      message: 'Customer upgraded to employee',
      userTypes: ['employee', 'customer'],
    })
  } catch (error) {
    console.error('Error upgrading to employee:', error)
    return NextResponse.json({ error: 'Failed to upgrade to employee' }, { status: 500 })
  }
}

// ============================================
// POST /api/users/upgrade-to-customer
// Upgrade existing employee account to also have customer profile
// ============================================
export async function PATCH(req: NextRequest) {
  try {
    const { uid, action, customerData } = await req.json()
    
    if (!uid) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (action === 'upgrade-to-customer') {
      // Check if employee exists
      const employee = await getEmployeeProfile(uid)
      if (!employee) {
        return NextResponse.json({ error: 'Employee profile not found' }, { status: 404 })
      }

      // Check if already has customer profile
      const existingCustomer = await getCustomerProfile(uid)
      if (existingCustomer) {
        return NextResponse.json({ error: 'User already has customer profile' }, { status: 400 })
      }

      // Upgrade to customer
      await upgradeEmployeeToCustomer(uid, customerData)

      return NextResponse.json({
        success: true,
        message: 'Employee upgraded to customer',
        userTypes: ['employee', 'customer'],
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Error upgrading to customer:', error)
    return NextResponse.json({ error: 'Failed to upgrade to customer' }, { status: 500 })
  }
}
