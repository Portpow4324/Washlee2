'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Link from 'next/link'
import { Shield, Heart, Check, AlertCircle, Zap, Award } from 'lucide-react'

export default function DamageProtectionPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-mint to-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Heart size={60} className="text-primary" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-dark mb-6">We Care for Your Clothes Like They're Ours</h1>
            <p className="text-xl text-gray max-w-2xl mx-auto">
              Our industry-leading damage protection guarantee means you can trust us completely. If anything happens, we make it right.
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { number: '99.2%', label: 'Items Delivered Perfect' },
              { number: '$0', label: 'Damage Claims Denied' },
              { number: '100%', label: 'Replacement Guarantee' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-5xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-lg text-gray">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Covered */}
      <section className="section bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Complete Coverage</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <Zap className="text-primary" size={32} />,
                title: 'Accidental Damage',
                items: ['Tears or rips', 'Snags', 'Holes', 'Seam separation'],
              },
              {
                icon: <AlertCircle className="text-primary" size={32} />,
                title: 'Color Issues',
                items: ['Fading', 'Bleeding', 'Color transfer', 'Discoloration'],
              },
              {
                icon: <Shield className="text-primary" size={32} />,
                title: 'Shrinkage & Sizing',
                items: ['Unexpected shrinkage', 'Sizing changes', 'Elastic failure', 'Waistband stretch'],
              },
              {
                icon: <Check className="text-primary" size={32} />,
                title: 'Hardware & Details',
                items: ['Lost buttons', 'Broken zippers', 'Snaps', 'Decorative damage'],
              },
            ].map((category, i) => (
              <Card key={i} hoverable>
                <div className="flex items-center gap-4 mb-6">
                  {category.icon}
                  <h3 className="text-2xl font-bold text-dark">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray">
                      <Check size={18} className="text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-mint rounded-lg p-8 border-2 border-primary/20">
            <p className="text-lg text-dark">
              <span className="font-bold">Good news:</span> Even if damage occurs, it's covered. We don't have exclusions, loopholes, or fine print. If you use Washlee and something goes wrong, we make it right with a full replacement, no questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">The Process</h2>
          
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'You Notice Damage',
                description: 'Spotted something wrong with your delivery? Report it right in the app with photos.',
                time: '0 days',
              },
              {
                step: '2',
                title: 'We Verify & Approve',
                description: 'Our damage specialists review photos and your claim. Approval typically happens within 24 hours.',
                time: 'Within 1 day',
              },
              {
                step: '3',
                title: 'Replacement Shipped',
                description: 'Once approved, we ship you a brand new item of equal or greater value via express delivery.',
                time: 'Within 3 days',
              },
              {
                step: '4',
                title: 'Return Damaged Item',
                description: 'We provide a prepaid return label. Send back the damaged item (optional, we often say keep it).',
                time: 'Within 30 days',
              },
            ].map((item, i) => (
              <Card key={i} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white font-bold text-lg">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-dark text-lg mb-2">{item.title}</h3>
                      <p className="text-gray">{item.description}</p>
                    </div>
                  </div>
                  <p className="text-primary font-semibold text-sm mt-3">{item.time}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-gray">
              Average claim resolution: <span className="font-bold text-dark">36 hours</span>
            </p>
          </div>
        </div>
      </section>

      {/* What We Do to Prevent Damage */}
      <section className="section bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">How We Prevent Damage</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-dark">During Handling</h3>
              {[
                '🧤 Trained staff use gentle handling techniques',
                '📸 Every item photographed upon pickup',
                '🔍 Inspected for existing damage (documented)',
                '📋 Condition baseline established for each order',
              ].map((item, i) => (
                <p key={i} className="flex items-start gap-3 text-gray">
                  {item}
                </p>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-dark">During Washing</h3>
              {[
                '🌡️ Temperature and cycle carefully controlled',
                '🧵 Fabrics sorted by care requirements',
                '💧 Premium detergent formulas used',
                '✓ Quality checkpoints throughout process',
              ].map((item, i) => (
                <p key={i} className="flex items-start gap-3 text-gray">
                  {item}
                </p>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-dark">Before Delivery</h3>
              {[
                '👀 Final quality inspection by expert eye',
                '📸 Post-wash photos for verification',
                '📦 Professional protective packaging',
                '🚚 Insured delivery to your door',
              ].map((item, i) => (
                <p key={i} className="flex items-start gap-3 text-gray">
                  {item}
                </p>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-dark">After Delivery</h3>
              {[
                '30-day inspection window',
                'No damage assessment fees',
                'No claim denials (ever)',
                '100% replacement guarantee',
              ].map((item, i) => (
                <p key={i} className="flex items-start gap-3 text-gray">
                  <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section bg-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">How Washlee Compares</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="text-left py-4 px-4 font-bold text-dark">Feature</th>
                  <th className="text-center py-4 px-4 font-bold text-dark">Washlee</th>
                  <th className="text-center py-4 px-4 font-bold text-dark">Traditional Dry Cleaning</th>
                  <th className="text-center py-4 px-4 font-bold text-dark">Hand Washing At Home</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Damage Coverage', washlee: '✅ 100%', traditional: '⚠️ Limited', home: '❌ No' },
                  { feature: 'Claims Process', washlee: '✅ Easy', traditional: '⚠️ Difficult', home: '❌ N/A' },
                  { feature: 'No Fine Print', washlee: '✅ Yes', traditional: '❌ No', home: '❌ No' },
                  { feature: 'Replacement Guarantee', washlee: '✅ Full Value', traditional: '⚠️ Partial', home: '❌ No' },
                  { feature: 'Expert Care', washlee: '✅ Always', traditional: '✅ Sometimes', home: '❌ Hit or Miss' },
                  { feature: 'Documentation', washlee: '✅ Photos', traditional: '❌ No', home: '❌ No' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray/5'}>
                    <td className="py-4 px-4 font-semibold text-dark border-b border-gray/10">{row.feature}</td>
                    <td className="py-4 px-4 text-center border-b border-gray/10">{row.washlee}</td>
                    <td className="py-4 px-4 text-center border-b border-gray/10">{row.traditional}</td>
                    <td className="py-4 px-4 text-center border-b border-gray/10">{row.home}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Real Customer Stories */}
      <section className="section bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Real Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah M.',
                story: 'Had a small stain appear after washing a designer blouse. Reported it, and within 48 hours Washlee shipped me a brand new one.',
                rating: '⭐⭐⭐⭐⭐',
              },
              {
                name: 'James D.',
                story: 'A sweater accidentally shrank more than expected. No questions asked—they replaced it with an identical new sweater.',
                rating: '⭐⭐⭐⭐⭐',
              },
              {
                name: 'Lisa T.',
                story: 'I was nervous sending expensive work clothes. The peace of mind from their guarantee was worth it alone. Never had an issue though!',
                rating: '⭐⭐⭐⭐⭐',
              },
            ].map((customer, i) => (
              <Card key={i} hoverable className="flex flex-col">
                <p className="text-lg mb-4">{customer.story}</p>
                <div className="mt-auto">
                  <p className="font-bold text-dark mb-1">{customer.name}</p>
                  <p className="text-primary">{customer.rating}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Damage Protection FAQ</h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Is there a deductible or copay?',
                a: 'No. Zero dollars. We cover the entire replacement cost with our guarantee.',
              },
              {
                q: 'How long do I have to report damage?',
                a: 'You have 30 days from delivery to report damage. Just tap "Report Issue" in the app.',
              },
              {
                q: 'Do you ever deny claims?',
                a: 'Never. We replace any item with damage from our process. No asterisks or exceptions.',
              },
              {
                q: 'What if I damage it myself after?',
                a: 'That\'s covered by your home insurance or normal wear. We only cover damage from our washing process.',
              },
              {
                q: 'Do I have to send the damaged item back?',
                a: 'You have 30 days to return it with a prepaid label. Sometimes we tell customers to keep it if return shipping costs more.',
              },
              {
                q: 'Can I request a cash refund instead?',
                a: 'We prefer replacements to ensure you get equal value, but we\'ll discuss options if replacement isn\'t possible.',
              },
            ].map((item, i) => (
              <Card key={i}>
                <h3 className="font-bold text-dark mb-2">{item.q}</h3>
                <p className="text-gray">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-primary/10 to-mint text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Award size={60} className="text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-dark mb-6">Trust Your Clothes to Washlee</h2>
          <p className="text-lg text-gray mb-8 max-w-2xl mx-auto">
            With our 100% damage protection guarantee, you never have to worry about your clothes again.
          </p>
          <div className="flex justify-center">
            <Link href="/booking">
              <Button size="lg">Get Started Now</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
