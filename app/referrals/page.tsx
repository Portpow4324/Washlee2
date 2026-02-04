'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Copy, Share2, Gift, Users, TrendingUp, CheckCircle } from 'lucide-react'
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface ReferralData {
  code: string
  referralCount: number
  earnedRewards: number
  pendingRewards: number
  referrals: Array<{
    id: string
    name: string
    email: string
    status: 'pending' | 'completed'
    reward: number
    createdAt: Date
  }>
}

export default function ReferralProgram() {
  const router = useRouter()
  const { user, userData, loading: authLoading } = useAuth()
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals'>('overview')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchReferralData()
    }
  }, [user])

  const fetchReferralData = async () => {
    try {
      setLoading(true)
      const userDocRef = doc(db, 'users', user!.uid)
      const userDoc = await getDoc(userDocRef)
      const userData = userDoc.data()

      // Generate referral code if not exists
      let referralCode = userData?.referralCode
      if (!referralCode) {
        referralCode = generateReferralCode()
        await updateDoc(userDocRef, { referralCode })
      }

      // Fetch referrals
      const referralsRef = collection(db, 'referrals')
      const q = query(referralsRef, where('referrerId', '==', user!.uid))
      const snapshot = await getDocs(q)
      const referrals = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.refereeName || 'Unknown',
          email: data.refereeEmail || '',
          status: data.status || 'pending',
          reward: data.reward || 0,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        }
      })

      const completedReferrals = referrals.filter((r) => r.status === 'completed')
      const earnedRewards = completedReferrals.reduce((sum, r) => sum + r.reward, 0)
      const pendingRewards = referrals.filter((r) => r.status === 'pending').length * 10

      setReferralData({
        code: referralCode,
        referralCount: referrals.length,
        earnedRewards,
        pendingRewards,
        referrals: referrals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching referral data:', error)
      setLoading(false)
    }
  }

  const generateReferralCode = () => {
    return `WASH${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  const copyToClipboard = () => {
    if (referralData) {
      navigator.clipboard.writeText(referralData.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getReferralLink = () => {
    if (referralData) {
      return `${window.location.origin}?ref=${referralData.code}`
    }
    return ''
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray">Loading referral program...</p>
      </div>
    )
  }

  if (!referralData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray">Error loading referral data</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">Referral Program</h1>
          <p className="text-gray">Earn rewards by inviting friends to Washlee</p>
        </div>

        {/* How It Works */}
        <Card className="bg-gradient-to-r from-primary to-accent p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">1</div>
                <h3 className="font-semibold">Share Your Code</h3>
              </div>
              <p className="text-white/90 text-sm">Give your unique referral code to friends</p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">2</div>
                <h3 className="font-semibold">They Sign Up</h3>
              </div>
              <p className="text-white/90 text-sm">Your friend creates an account using your code</p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">3</div>
                <h3 className="font-semibold">Earn Rewards</h3>
              </div>
              <p className="text-white/90 text-sm">Get $10 credit when they complete their first order</p>
            </div>
          </div>
        </Card>

        {/* Referral Code Section */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark mb-6">Your Referral Code</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray mb-2">Your Unique Code</p>
              <div className="flex items-center gap-2 bg-gray/5 p-4 rounded-lg border-2 border-primary/20">
                <code className="flex-1 text-2xl font-bold text-primary">{referralData.code}</code>
                <button
                  onClick={copyToClipboard}
                  className={`p-2 rounded-lg transition ${
                    copied ? 'bg-green-100 text-green-600' : 'bg-gray/10 text-gray hover:bg-gray/20'
                  }`}
                  title="Copy code"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray mb-2">Or Share Your Referral Link</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={getReferralLink()}
                  readOnly
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray/20 bg-white text-sm text-gray"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    navigator.share?.({
                      title: 'Join Washlee',
                      text: 'Get $10 credit on your first order',
                      url: getReferralLink(),
                    }) ||
                      alert('Share link: ' + getReferralLink())
                  }}
                  className="flex items-center gap-2"
                >
                  <Share2 size={18} />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray text-sm mb-1">Total Referrals</p>
                <p className="text-3xl font-bold text-dark">{referralData.referralCount}</p>
              </div>
              <Users size={32} className="text-primary/20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray text-sm mb-1">Earned Rewards</p>
                <p className="text-3xl font-bold text-dark">${referralData.earnedRewards.toFixed(2)}</p>
              </div>
              <Gift size={32} className="text-primary/20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray text-sm mb-1">Pending Rewards</p>
                <p className="text-3xl font-bold text-dark">${referralData.pendingRewards.toFixed(2)}</p>
              </div>
              <TrendingUp size={32} className="text-primary/20" />
            </div>
          </Card>
        </div>

        {/* Referrals List */}
        <Card className="p-6 mb-8">
          <div className="flex gap-4 mb-6 border-b-2 border-gray/20">
            {(['overview', 'referrals'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-semibold transition ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray hover:text-dark'
                }`}
              >
                {tab === 'overview' ? 'Overview' : 'Referrals List'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="font-bold text-dark">Referral Tiers</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray/5 rounded-lg">
                  <div>
                    <p className="font-semibold text-dark">Bronze</p>
                    <p className="text-sm text-gray">1-5 successful referrals</p>
                  </div>
                  <p className="text-lg font-bold text-primary">$10 per referral</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray/5 rounded-lg">
                  <div>
                    <p className="font-semibold text-dark">Silver</p>
                    <p className="text-sm text-gray">6-15 successful referrals</p>
                  </div>
                  <p className="text-lg font-bold text-primary">$15 per referral</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary">
                  <div>
                    <p className="font-semibold text-dark">Gold</p>
                    <p className="text-sm text-gray">16+ successful referrals</p>
                  </div>
                  <p className="text-lg font-bold text-primary">$20 per referral</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-mint rounded-lg">
                <p className="text-sm text-dark">
                  <strong>Pro Tip:</strong> Rewards are automatically credited to your account once your referral completes their first order. Use them for discounts or withdraw them to your bank account!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div>
              {referralData.referrals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray/20">
                        <th className="text-left py-3 px-4 font-semibold text-dark">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-dark">Email</th>
                        <th className="text-center py-3 px-4 font-semibold text-dark">Status</th>
                        <th className="text-right py-3 px-4 font-semibold text-dark">Reward</th>
                        <th className="text-right py-3 px-4 font-semibold text-dark">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralData.referrals.map((referral) => (
                        <tr key={referral.id} className="border-b border-gray/10 hover:bg-gray/5 transition">
                          <td className="py-3 px-4 text-dark font-semibold">{referral.name}</td>
                          <td className="py-3 px-4 text-gray text-sm">{referral.email}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                                referral.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {referral.status === 'completed' && <CheckCircle size={14} />}
                              {referral.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-primary font-bold">${referral.reward.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-gray text-sm">
                            {referral.createdAt.toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-gray/30 mb-2" />
                  <p className="text-gray">No referrals yet. Share your code to get started!</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  )
}
