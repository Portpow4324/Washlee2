'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Card from '@/components/Card'
import { Package, Smartphone, Cloud, Zap, Shield, Globe } from 'lucide-react'

export default function AppInfo() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-light">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary to-accent text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">App Information</h1>
            <p className="text-xl opacity-90">Everything you need to know about Washlee</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* App Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card hoverable>
              <div className="flex items-start gap-4">
                <Package className="text-primary mt-2" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Application Name</h3>
                  <p className="text-gray text-lg font-semibold">Washlee</p>
                </div>
              </div>
            </Card>

            <Card hoverable>
              <div className="flex items-start gap-4">
                <Zap className="text-primary mt-2" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Current Version</h3>
                  <p className="text-gray text-lg font-semibold">v1.0.0 (Production Ready)</p>
                </div>
              </div>
            </Card>

            <Card hoverable>
              <div className="flex items-start gap-4">
                <Smartphone className="text-primary mt-2" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Platform</h3>
                  <p className="text-gray text-lg font-semibold">Web-based (Responsive Mobile)</p>
                </div>
              </div>
            </Card>

            <Card hoverable>
              <div className="flex items-start gap-4">
                <Globe className="text-primary mt-2" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Type</h3>
                  <p className="text-gray text-lg font-semibold">Full-Stack Service Marketplace</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tech Stack */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-dark mb-8">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <h4 className="font-bold text-dark mb-4">Frontend</h4>
                <ul className="space-y-2 text-gray text-sm">
                  <li>✓ Next.js 16.1.3</li>
                  <li>✓ React 18</li>
                  <li>✓ TypeScript</li>
                  <li>✓ Tailwind CSS</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-bold text-dark mb-4">Backend & Database</h4>
                <ul className="space-y-2 text-gray text-sm">
                  <li>✓ Next.js API Routes</li>
                  <li>✓ Firebase Firestore</li>
                  <li>✓ Firebase Admin SDK</li>
                  <li>✓ Node.js</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-bold text-dark mb-4">Authentication & Auth</h4>
                <ul className="space-y-2 text-gray text-sm">
                  <li>✓ NextAuth.js</li>
                  <li>✓ Firebase Auth</li>
                  <li>✓ Google OAuth</li>
                  <li>✓ Email/Password</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-bold text-dark mb-4">Integrations</h4>
                <ul className="space-y-2 text-gray text-sm">
                  <li>✓ Stripe (Payments)</li>
                  <li>✓ Google Maps (Tracking)</li>
                  <li>✓ Twilio (SMS)</li>
                  <li>✓ SendGrid (Email)</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-bold text-dark mb-4">Real-time Features</h4>
                <ul className="space-y-2 text-gray text-sm">
                  <li>✓ Firebase Cloud Messaging</li>
                  <li>✓ Firestore Listeners</li>
                  <li>✓ Push Notifications</li>
                  <li>✓ Live Order Updates</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-bold text-dark mb-4">Tools & Utilities</h4>
                <ul className="space-y-2 text-gray text-sm">
                  <li>✓ ESLint & Prettier</li>
                  <li>✓ Recharts (Analytics)</li>
                  <li>✓ Lucide Icons</li>
                  <li>✓ TypeScript Strict Mode</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-dark mb-8">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card hoverable>
                <h4 className="font-bold text-dark mb-3">✅ Customer Features</h4>
                <ul className="space-y-2 text-gray text-sm">
                  <li>• Easy booking & scheduling</li>
                  <li>• Real-time order tracking</li>
                  <li>• Payment processing (Stripe)</li>
                  <li>• Damage protection guarantee</li>
                  <li>• Notifications & alerts</li>
                </ul>
              </Card>

              <Card hoverable>
                <h4 className="font-bold text-dark mb-3">✅ Pro Features</h4>
                <ul className="space-y-2 text-gray text-sm">
                  <li>• Job availability alerts</li>
                  <li>• Earnings dashboard</li>
                  <li>• Performance analytics</li>
                  <li>• Customer ratings & reviews</li>
                  <li>• Payout management</li>
                </ul>
              </Card>

              <Card hoverable>
                <h4 className="font-bold text-dark mb-3">✅ Admin Features</h4>
                <ul className="space-y-2 text-gray text-sm">
                  <li>• User management</li>
                  <li>• Order oversight</li>
                  <li>• Revenue analytics</li>
                  <li>• Email campaigns</li>
                  <li>• Dynamic pricing rules</li>
                </ul>
              </Card>

              <Card hoverable>
                <h4 className="font-bold text-dark mb-3">✅ Premium Services</h4>
                <ul className="space-y-2 text-gray text-sm">
                  <li>• Referral rewards program</li>
                  <li>• Loyalty points system</li>
                  <li>• Gift cards</li>
                  <li>• Corporate bulk orders</li>
                  <li>• SMS & email notifications</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Performance */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-dark mb-8">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card hoverable className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">7.4s</div>
                <p className="text-gray font-semibold">Build Time</p>
              </Card>

              <Card hoverable className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">0</div>
                <p className="text-gray font-semibold">TypeScript Errors</p>
              </Card>

              <Card hoverable className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">28</div>
                <p className="text-gray font-semibold">Pages</p>
              </Card>

              <Card hoverable className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="text-gray font-semibold">Responsive</p>
              </Card>
            </div>
          </div>

          {/* Pages Overview */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-dark mb-8">Website Pages (28 Total)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <h4 className="font-bold text-dark mb-3">🏠 Public Pages (10)</h4>
                <ul className="space-y-1 text-gray text-sm">
                  <li>• Homepage</li>
                  <li>• Services</li>
                  <li>• How It Works</li>
                  <li>• Pricing</li>
                  <li>• About Us</li>
                  <li>• Careers</li>
                  <li>• Loyalty Program</li>
                  <li>• Referrals</li>
                  <li>• Gift Cards</li>
                  <li>• Corporate Services</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-bold text-dark mb-3">🔒 Security Pages (3)</h4>
                <ul className="space-y-1 text-gray text-sm">
                  <li>• Security Center</li>
                  <li>• Damage Protection</li>
                  <li>• Fabric Care Guide</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-bold text-dark mb-3">📋 Legal Pages (7)</h4>
                <ul className="space-y-1 text-gray text-sm">
                  <li>• Help Center</li>
                  <li>• FAQ</li>
                  <li>• Contact Us</li>
                  <li>• Terms of Service</li>
                  <li>• Privacy Policy</li>
                  <li>• Cookie Policy</li>
                  <li>• Pro Support</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-bold text-dark mb-3">👤 Auth Pages (6)</h4>
                <ul className="space-y-1 text-gray text-sm">
                  <li>• Login</li>
                  <li>• Sign Up</li>
                  <li>• Customer Sign Up</li>
                  <li>• Pro Sign Up</li>
                  <li>• Pro Application</li>
                  <li>• Admin Login</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-bold text-dark mb-3">📊 Dashboard Pages (2)</h4>
                <ul className="space-y-1 text-gray text-sm">
                  <li>• Customer Dashboard</li>
                  <li>• Admin Dashboard</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-bold text-dark mb-3">🎯 Functional Pages (Extra)</h4>
                <ul className="space-y-1 text-gray text-sm">
                  <li>• Booking Flow</li>
                  <li>• Order Tracking</li>
                  <li>• Notifications</li>
                  <li>• Checkout</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Security */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-dark mb-8">Security & Compliance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card hoverable>
                <div className="flex items-start gap-4">
                  <Shield className="text-primary mt-2" size={32} />
                  <div>
                    <h4 className="font-bold text-dark mb-3">Security Features</h4>
                    <ul className="space-y-2 text-gray text-sm">
                      <li>✓ SSL/TLS Encryption</li>
                      <li>✓ HTTPS Only</li>
                      <li>✓ Secure Password Hashing</li>
                      <li>✓ XSS Protection</li>
                      <li>✓ CSRF Tokens</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card hoverable>
                <div className="flex items-start gap-4">
                  <Cloud className="text-primary mt-2" size={32} />
                  <div>
                    <h4 className="font-bold text-dark mb-3">Compliance</h4>
                    <ul className="space-y-2 text-gray text-sm">
                      <li>✓ GDPR Compliant</li>
                      <li>✓ PCI DSS Ready</li>
                      <li>✓ Data Privacy Policy</li>
                      <li>✓ Cookie Consent</li>
                      <li>✓ SOC 2 Ready</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Development Info */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary">
            <h3 className="text-2xl font-bold text-dark mb-4">📱 Development Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-bold text-dark mb-2">Phase 1 & 2</p>
                <p className="text-gray">✅ 100% Complete</p>
                <p className="text-xs text-gray mt-1">17 features, 0 errors</p>
              </div>
              <div>
                <p className="font-bold text-dark mb-2">Phase 3</p>
                <p className="text-gray">✅ 100% Complete</p>
                <p className="text-xs text-gray mt-1">7 features, 2,750+ lines</p>
              </div>
              <div>
                <p className="font-bold text-dark mb-2">Phase 4 (Mobile)</p>
                <p className="text-gray">⏳ Coming Soon</p>
                <p className="text-xs text-gray mt-1">React Native + Expo</p>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </>
  )
}
