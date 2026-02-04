'use client'

import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { Briefcase, DollarSign, Clock, TrendingUp, LogOut, Star, FileText, Settings, MapPin, AlertCircle, CheckCircle, Calendar, Eye, EyeOff, Bell, Award, Zap, Target } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function ProDashboard() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('jobs')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedJob, setExpandedJob] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#48C9B0] to-[#7FE3D3] rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray font-semibold">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Setting up your earnings and jobs</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Sample job data
  const allJobs = [
    {
      id: 'JOB-501',
      customer: 'Sarah Mitchell',
      weight: '6 kg',
      rate: '$18.00',
      pickupTime: 'Today 4:00 PM',
      distance: '2.3 km',
      status: 'available',
      location: '123 Main St',
      serviceType: 'Standard Wash',
    },
    {
      id: 'JOB-502',
      customer: 'John Davis',
      weight: '8 kg',
      rate: '$24.00',
      pickupTime: 'Tomorrow 2:00 PM',
      distance: '1.8 km',
      status: 'available',
      location: '456 Oak Ave',
      serviceType: 'Delicate Care',
    },
    {
      id: 'JOB-503',
      customer: 'Emma Johnson',
      weight: '4 kg',
      rate: '$12.00',
      pickupTime: 'Tomorrow 10:00 AM',
      distance: '3.1 km',
      status: 'accepted',
      location: '789 Pine Rd',
      serviceType: 'Express Service',
    },
  ]

  const filteredJobs = allJobs.filter(job => {
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus
    const matchesSearch = job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-bold text-[#1f2d2b] mb-2">
                Welcome back, {userData?.firstName || userData?.name || 'Pro'}!
              </h1>
              <p className="text-gray text-lg">Manage your jobs and track your earnings in real-time</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold hover:shadow-md"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>

          {/* Premium Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This Week Earnings */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-lg p-8 border border-emerald-200 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-emerald-700 font-bold text-sm uppercase tracking-wide">This Week</p>
                <DollarSign className="text-emerald-600" size={28} />
              </div>
              <p className="text-4xl font-bold text-emerald-900 mb-2">$487.50</p>
              <p className="text-sm text-emerald-700">↑ 12% from last week</p>
            </div>

            {/* Rating */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg p-8 border border-yellow-200 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-yellow-700 font-bold text-sm uppercase tracking-wide">Rating</p>
                <Star className="text-yellow-600" size={28} />
              </div>
              <p className="text-4xl font-bold text-yellow-900 mb-2">4.98/5.00</p>
              <p className="text-sm text-yellow-700">Based on 234 reviews</p>
            </div>

            {/* Jobs Completed */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 border border-blue-200 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-blue-700 font-bold text-sm uppercase tracking-wide">Completed</p>
                <CheckCircle className="text-blue-600" size={28} />
              </div>
              <p className="text-4xl font-bold text-blue-900 mb-2">234</p>
              <p className="text-sm text-blue-700">100% on-time delivery</p>
            </div>

            {/* Growth */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-8 border border-purple-200 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-purple-700 font-bold text-sm uppercase tracking-wide">Growth</p>
                <TrendingUp className="text-purple-600" size={28} />
              </div>
              <p className="text-4xl font-bold text-purple-900 mb-2">+12%</p>
              <p className="text-sm text-purple-700">Month over month</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            {[
              { id: 'jobs', label: 'Available Jobs', icon: Briefcase, badge: 2 },
              { id: 'active', label: 'Active Jobs', icon: Clock, badge: 1 },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'account', label: 'Account', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-3 relative group ${
                  activeTab === id
                    ? 'text-[#48C9B0] border-b-4 border-[#48C9B0] bg-white'
                    : 'text-gray hover:text-[#1f2d2b] hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{label}</span>
                {badge && (
                  <span className="ml-1 px-2 py-1 bg-[#48C9B0] text-white text-xs rounded-full font-bold">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div>
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-[#1f2d2b] mb-1">Available Jobs</h2>
                    <p className="text-gray">Find and accept new laundry jobs near you</p>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Zap size={18} />
                    Refresh Jobs
                  </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 mb-6 flex-wrap">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by customer or job ID..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48C9B0]"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48C9B0]"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="accepted">Accepted</option>
                  </select>
                </div>

                {filteredJobs.length === 0 ? (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-12 text-center">
                    <Briefcase size={48} className="mx-auto text-blue-300 mb-4" />
                    <p className="text-gray font-semibold mb-2">No jobs available right now</p>
                    <p className="text-sm text-gray">Check back in a few minutes for new job opportunities</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.filter(j => j.status === 'available').map((job) => (
                      <div
                        key={job.id}
                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                        className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-[#48C9B0] hover:shadow-lg transition cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-bold text-[#1f2d2b] text-lg">{job.id}</p>
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">AVAILABLE</span>
                            </div>
                            <p className="text-gray text-sm">{job.customer}</p>
                          </div>
                          <span className="px-4 py-2 bg-[#E8FFFB] text-[#48C9B0] text-lg font-bold rounded-xl">{job.rate}</span>
                        </div>

                        <div className="flex gap-4 mb-4 text-sm text-gray flex-wrap">
                          <span className="flex items-center gap-1">📦 {job.weight}</span>
                          <span className="flex items-center gap-1">📍 {job.distance} away</span>
                          <span className="flex items-center gap-1">🕐 {job.pickupTime}</span>
                        </div>

                        {expandedJob === job.id && (
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <p className="text-sm text-gray mb-4"><strong>Service:</strong> {job.serviceType}</p>
                            <p className="text-sm text-gray mb-4"><strong>Location:</strong> {job.location}</p>
                            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Accept Job Now</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Active Jobs Tab */}
            {activeTab === 'active' && (
              <div>
                <h2 className="text-3xl font-bold text-[#1f2d2b] mb-6">Active Jobs</h2>
                {filteredJobs.filter(j => j.status === 'accepted').length === 0 ? (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-12 text-center">
                    <Clock size={48} className="mx-auto text-blue-300 mb-4" />
                    <p className="text-gray font-semibold mb-2">No active jobs</p>
                    <p className="text-sm text-gray">Accept a job from the Available Jobs tab to start earning</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.filter(j => j.status === 'accepted').map((job) => (
                      <Card key={job.id} hoverable className="p-6 border-2 border-blue-200 bg-blue-50">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-bold text-[#1f2d2b] text-lg">{job.id}</p>
                            <p className="text-gray text-sm">{job.customer}</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">IN PROGRESS</span>
                        </div>
                        <div className="flex gap-4 text-sm text-gray mb-4">
                          <span>📦 {job.weight}</span>
                          <span>📍 {job.location}</span>
                          <span>🕐 Pickup: {job.pickupTime}</span>
                        </div>
                        <Button className="w-full">View Details</Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div>
                <h2 className="text-3xl font-bold text-[#1f2d2b] mb-6">Earnings & Payouts</h2>
                
                {/* Earnings Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-[#48C9B0] to-[#3aad9a] rounded-2xl shadow-lg p-8 text-white">
                    <p className="text-white text-opacity-90 text-sm font-semibold mb-2">THIS WEEK</p>
                    <p className="text-5xl font-bold mb-2">$487.50</p>
                    <p className="text-sm text-white text-opacity-75">From 12 completed jobs</p>
                  </div>
                  <Card hoverable className="p-8">
                    <p className="text-gray text-sm font-semibold mb-2">TOTAL EARNINGS (ALL TIME)</p>
                    <p className="text-5xl font-bold text-[#1f2d2b] mb-2">$12,348</p>
                    <p className="text-sm text-gray">234 jobs completed</p>
                  </Card>
                  <Card hoverable className="p-8 border-2 border-yellow-200 bg-yellow-50">
                    <p className="text-yellow-700 text-sm font-semibold mb-2">PENDING PAYOUT</p>
                    <p className="text-5xl font-bold text-yellow-900 mb-2">$234.75</p>
                    <p className="text-sm text-yellow-700">Next payout: Jan 22</p>
                  </Card>
                </div>

                {/* Recent Payouts */}
                <h3 className="text-2xl font-bold text-[#1f2d2b] mb-4">Recent Payouts</h3>
                <div className="space-y-3">
                  {[
                    { date: 'Jan 15, 2026', amount: '$487.50', status: 'Completed' },
                    { date: 'Jan 8, 2026', amount: '$562.00', status: 'Completed' },
                    { date: 'Jan 1, 2026', amount: '$445.25', status: 'Completed' },
                  ].map((payout, i) => (
                    <div key={i} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center">
                          <CheckCircle size={24} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1f2d2b]">{payout.date}</p>
                          <p className="text-sm text-gray">{payout.status}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#48C9B0] text-lg">{payout.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-3xl font-bold text-[#1f2d2b] mb-6">Account Information</h2>
                <Card className="p-10 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray uppercase tracking-wide">Full Name</p>
                      <p className="text-2xl font-semibold text-[#1f2d2b]">{userData?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray uppercase tracking-wide">Email</p>
                      <p className="text-2xl font-semibold text-[#1f2d2b]">{userData?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray uppercase tracking-wide">Phone</p>
                      <p className="text-2xl font-semibold text-[#1f2d2b]">{userData?.phone || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray uppercase tracking-wide">Account Type</p>
                      <p className="text-2xl font-semibold text-[#1f2d2b] capitalize">{userData?.userType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray uppercase tracking-wide">Member Since</p>
                      <p className="text-2xl font-semibold text-[#1f2d2b]">
                        {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray uppercase tracking-wide">Status</p>
                      <p className="text-2xl font-semibold"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Active</span></p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-3xl font-bold text-[#1f2d2b] mb-6">Notification Settings</h2>
                <div className="space-y-4">
                  {[
                    { title: 'Job Alerts', desc: 'Get notified about new jobs nearby', default: true },
                    { title: 'Earnings Updates', desc: 'Weekly earnings summaries and insights', default: true },
                    { title: 'Marketing Messages', desc: 'Promotions, tips, and special offers', default: userData?.marketingTexts },
                    { title: 'Account Notifications', desc: 'Important account updates and security alerts', default: userData?.accountTexts },
                  ].map((item, i) => (
                    <Card key={i} className="p-6 border border-gray-200">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>
                          <p className="font-semibold text-[#1f2d2b] text-lg">{item.title}</p>
                          <p className="text-sm text-gray">{item.desc}</p>
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked={item.default}
                          className="w-6 h-6 rounded-lg border-2 border-gray-300 text-[#48C9B0] cursor-pointer"
                        />
                      </label>
                    </Card>
                  ))}
                </div>
                <Button className="mt-8 w-full bg-[#48C9B0] hover:bg-[#3aad9a] text-white py-3 font-semibold">Save Preferences</Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
