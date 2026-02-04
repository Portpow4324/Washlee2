import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, getDocs, where, Timestamp, orderBy } from 'firebase/firestore'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
})

/**
 * GET /api/admin/stripe-analytics
 * Fetches real analytics data from Firestore orders and Stripe payments
 * Returns: total orders, active orders, completed orders, cancelled orders, revenue
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange') || '30days'

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    if (dateRange === '7days') startDate.setDate(now.getDate() - 7)
    else if (dateRange === '30days') startDate.setDate(now.getDate() - 30)
    else if (dateRange === '90days') startDate.setDate(now.getDate() - 90)

    // Get all orders from Firestore
    const ordersRef = collection(db, 'orders')
    const ordersSnapshot = await getDocs(ordersRef)
    const allOrders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Filter orders by date range
    const filteredOrders = allOrders.filter((order: any) => {
      const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt)
      return orderDate >= startDate
    })

    // Calculate order statuses
    const activeOrders = filteredOrders.filter(
      (order: any) => order.status === 'pending' || order.status === 'accepted' || order.status === 'in_progress'
    ).length

    const completedOrders = filteredOrders.filter(
      (order: any) => order.status === 'completed' || order.status === 'delivered'
    ).length

    const cancelledOrders = filteredOrders.filter(
      (order: any) => order.status === 'cancelled' || order.status === 'refunded'
    ).length

    const totalOrders = filteredOrders.length

    // Calculate revenue from orders
    const totalRevenue = filteredOrders.reduce((sum: number, order: any) => {
      return sum + (order.pricing?.total || 0)
    }, 0)

    // Try to get Stripe payment data for additional insights
    let stripeMetrics = {
      stripeCharges: 0,
      stripeRevenue: 0,
      stripeRefunds: 0,
      stripeFailedCharges: 0,
    }

    try {
      // Fetch Stripe charges for the date range
      const startTimestamp = Math.floor(startDate.getTime() / 1000)
      const endTimestamp = Math.floor(now.getTime() / 1000)

      const charges = await stripe.charges.list({
        limit: 100,
        created: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
      })

      stripeMetrics.stripeCharges = charges.data.length
      stripeMetrics.stripeRevenue = charges.data
        .filter((charge) => charge.paid)
        .reduce((sum, charge) => sum + charge.amount / 100, 0)
      stripeMetrics.stripeRefunds = charges.data
        .filter((charge) => charge.refunded)
        .reduce((sum, charge) => sum + (charge.amount_refunded / 100 || 0), 0)
      stripeMetrics.stripeFailedCharges = charges.data.filter((charge) => !charge.paid).length
    } catch (stripeError: any) {
      console.error('Error fetching Stripe data:', stripeError.message)
    }

    // Calculate metrics
    const activeOrdersPercentage = totalOrders > 0 ? Math.round((activeOrders / totalOrders) * 100) : 0
    const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0
    const cancellationRate = totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 100) : 0

    // Get customer and employee counts
    const customersRef = collection(db, 'customers')
    const employeesRef = collection(db, 'employees')
    const customersSnapshot = await getDocs(customersRef)
    const employeesSnapshot = await getDocs(employeesRef)

    const analytics = {
      orders: {
        total: totalOrders,
        active: activeOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        activePercentage: activeOrdersPercentage,
        completionRate,
        cancellationRate,
      },
      revenue: {
        total: Math.round(totalRevenue * 100) / 100,
        average: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
        stripeVerified: Math.round(stripeMetrics.stripeRevenue * 100) / 100,
        refunds: Math.round(stripeMetrics.stripeRefunds * 100) / 100,
      },
      users: {
        totalCustomers: customersSnapshot.size,
        totalEmployees: employeesSnapshot.size,
      },
      stripe: stripeMetrics,
      dateRange,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      analytics,
    })
  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/stripe-analytics
 * Allows setting a specific date range for analytics
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dateRange = '30days', startDate, endDate } = body

    // Use query params by forwarding to GET with dateRange
    const url = new URL(request.url)
    url.searchParams.set('dateRange', dateRange)

    const getRequest = new NextRequest(url, { method: 'GET' })
    return GET(getRequest)
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
