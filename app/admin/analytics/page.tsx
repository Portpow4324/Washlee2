'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Card from '@/components/Card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { DollarSign, Users, TrendingUp, ShoppingCart, ArrowUp } from 'lucide-react'
import { collection, query, where, getDocs, orderBy, limit, startAt, endAt } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  completedOrders: number
  totalUsers: number
  averageOrderValue: number
  revenueGrowth: number
}

interface RevenueChartData {
  date: string
  revenue: number
}

export default function AnalyticsDashboard() {
  const router = useRouter()
  const { user, userData, loading: authLoading } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalUsers: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
  })
  const [revenueData, setRevenueData] = useState<RevenueChartData[]>([])
  const [orderStatusData, setOrderStatusData] = useState<any[]>([])
  const [topPros, setTopPros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d')

  const COLORS = ['#48C9B0', '#7FE3D3', '#E8FFFB', '#1f2d2b', '#6b7b78']

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user || !userData?.isAdmin) return
    fetchAnalytics()
  }, [user, userData, dateRange])

  const getDaysInRange = () => {
    return dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
  }

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const days = getDaysInRange()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Fetch orders
      const ordersRef = collection(db, 'orders')
      const ordersQuery = query(
        ordersRef,
        where('createdAt', '>=', startDate),
        orderBy('createdAt', 'desc')
      )
      const ordersSnapshot = await getDocs(ordersQuery)
      const orders = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any))

      // Calculate metrics
      const totalRevenue = orders.reduce((sum, order) => sum + (order.subtotal || 0), 0)
      const totalOrders = orders.length
      const completedOrders = orders.filter((o) => o.status === 'completed').length
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Fetch users
      const usersRef = collection(db, 'users')
      const usersSnapshot = await getDocs(usersRef)
      const totalUsers = usersSnapshot.size

      // Prepare revenue chart data (last 7 days)
      const dailyRevenue: Record<string, number> = {}
      const last7Days = 7
      for (let i = last7Days; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        dailyRevenue[dateStr] = 0
      }

      orders.forEach((order) => {
        const orderDate = order.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        if (orderDate in dailyRevenue) {
          dailyRevenue[orderDate] += order.subtotal || 0
        }
      })

      const revenueChartData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
        date,
        revenue: Math.round(revenue * 100) / 100,
      }))

      // Order status breakdown
      const statusCount: Record<string, number> = {
        pending: 0,
        accepted: 0,
        completed: 0,
        cancelled: 0,
      }
      orders.forEach((order) => {
        const status = order.status || 'pending'
        if (status in statusCount) {
          statusCount[status]++
        }
      })

      const orderStatusChartData = Object.entries(statusCount).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))

      // Top pros by orders
      const proOrderCount: Record<string, { name: string; orders: number; revenue: number }> = {}
      orders.forEach((order) => {
        if (order.assignedPro?.id) {
          const proId = order.assignedPro.id
          if (!proOrderCount[proId]) {
            proOrderCount[proId] = {
              name: order.assignedPro.name || 'Unknown',
              orders: 0,
              revenue: 0,
            }
          }
          proOrderCount[proId].orders++
          proOrderCount[proId].revenue += order.subtotal || 0
        }
      })

      const topProsData = Object.values(proOrderCount)
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5)

      setAnalytics({
        totalRevenue,
        totalOrders,
        completedOrders,
        totalUsers,
        averageOrderValue,
        revenueGrowth: 12.5, // Mock growth percentage
      })
      setRevenueData(revenueChartData)
      setOrderStatusData(orderStatusChartData)
      setTopPros(topProsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  const completionRate = analytics.totalOrders > 0 ? (analytics.completedOrders / analytics.totalOrders * 100).toFixed(1) : 0

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray">Loading analytics...</p>
      </div>
    )
  }

  if (!userData?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray">You don't have access to this page</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-dark mb-2">Analytics Dashboard</h1>
              <p className="text-gray">Business metrics and insights</p>
            </div>
            <div className="flex gap-2">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    dateRange === range
                      ? 'bg-primary text-white'
                      : 'bg-white text-dark border-2 border-gray hover:bg-gray/10'
                  }`}
                >
                  {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-dark">${analytics.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign size={32} className="text-primary/20" />
            </div>
            <div className="flex items-center gap-1 mt-3 text-green-600">
              <ArrowUp size={16} />
              <span className="text-sm font-semibold">{analytics.revenueGrowth}% growth</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-dark">{analytics.totalOrders}</p>
              </div>
              <ShoppingCart size={32} className="text-primary/20" />
            </div>
            <p className="text-sm text-gray mt-3">{completionRate}% completion rate</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray text-sm mb-1">Average Order Value</p>
                <p className="text-3xl font-bold text-dark">${analytics.averageOrderValue.toFixed(2)}</p>
              </div>
              <TrendingUp size={32} className="text-primary/20" />
            </div>
            <p className="text-sm text-gray mt-3">Per transaction</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-dark">{analytics.totalUsers}</p>
              </div>
              <Users size={32} className="text-primary/20" />
            </div>
            <p className="text-sm text-gray mt-3">Registered accounts</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-6">
            <h3 className="font-bold text-dark mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${typeof value === 'number' ? value.toFixed(2) : '0.00'}`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #48C9B0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#48C9B0"
                  strokeWidth={2}
                  dot={{ fill: '#48C9B0', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-dark mb-4">Order Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top Pros */}
        <Card className="p-6">
          <h3 className="font-bold text-dark mb-4">Top Performing Pros</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray/20">
                  <th className="text-left py-3 px-4 font-semibold text-dark">Pro Name</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Orders</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Revenue</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Avg. per Order</th>
                </tr>
              </thead>
              <tbody>
                {topPros.map((pro, index) => (
                  <tr key={index} className="border-b border-gray/10 hover:bg-gray/5 transition">
                    <td className="py-3 px-4 text-dark font-semibold">{pro.name}</td>
                    <td className="py-3 px-4 text-right text-gray">{pro.orders}</td>
                    <td className="py-3 px-4 text-right text-dark font-semibold">${pro.revenue.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-gray">${(pro.revenue / pro.orders).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
