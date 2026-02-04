'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Card from '@/components/Card'
import { Check, AlertCircle, Droplets, Wind, Zap, Shirt } from 'lucide-react'

export default function CareGuidePage() {
  return (
    <>
      <Header />

      {/* Hero */}  
      <section className="bg-gradient-to-br from-mint to-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shirt size={60} className="text-primary mx-auto mb-6" />
          <h1 className="text-5xl sm:text-6xl font-bold text-dark mb-6">How Washlee Cares for Your Clothes</h1>
          <p className="text-xl text-gray max-w-2xl mx-auto">
            Every fabric is different. That's why we treat every garment with specialized care tailored to its needs.
          </p>
        </div>
      </section>

      {/* Care Standards */}
      <section className="section bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Our Care Standards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Droplets size={32} className="text-primary" />,
                title: 'Temperature Control',
                desc: 'Water temperature precisely matched to fabric requirements (cold, warm, hot)',
              },
              {
                icon: <Wind size={32} className="text-primary" />,
                title: 'Cycle Selection',
                desc: 'Gentle, normal, or heavy cycles based on fabric type and soil level',
              },
              {
                icon: <Zap size={32} className="text-primary" />,
                title: 'Detergent Choice',
                desc: 'pH-neutral, dye-safe detergents that preserve color and fabric integrity',
              },
              {
                icon: <Check size={32} className="text-primary" />,
                title: 'Drying Methods',
                desc: 'Air dry, low tumble, or specialized techniques depending on material',
              },
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-sm text-gray">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fabric Guide */}
      <section className="section bg-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Fabric-Specific Care</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                fabric: 'Cotton',
                description: 'The most versatile fabric we handle',
                care: [
                  '• Machine wash: warm water, normal cycle',
                  '• Detergent: standard, any brand',
                  '• Drying: tumble dry medium heat',
                  '• Iron: medium heat if needed',
                  '• Note: May shrink slightly (1-2%)',
                ],
                icon: '🧵',
              },
              {
                fabric: 'Polyester',
                description: 'Durable synthetic that holds color well',
                care: [
                  '• Machine wash: warm water, gentle cycle',
                  '• Detergent: any type',
                  '• Drying: tumble dry low heat',
                  '• Iron: low heat if needed',
                  '• Note: Resistant to shrinking and fading',
                ],
                icon: '✨',
              },
              {
                fabric: 'Silk',
                description: 'Delicate, requires special handling',
                care: [
                  '• Hand wash or delicate cycle recommended',
                  '• Cold water with silk-specific detergent',
                  '• Never wring or twist',
                  '• Air dry only (never tumble dry)',
                  '• Iron: very low heat or steam',
                ],
                icon: '👑',
              },
              {
                fabric: 'Wool',
                description: 'Natural fiber that can felt if mistreated',
                care: [
                  '• Wool cycle: cold water, gentle detergent',
                  '• Avoid hot water (causes shrinking)',
                  '• Air dry lying flat',
                  '• Never wring or machine spin dry',
                  '• Note: May feel itchy until washed',
                ],
                icon: '🧶',
              },
              {
                fabric: 'Linen',
                description: 'Strong fiber that softens with washing',
                care: [
                  '• Machine wash: warm water, normal cycle',
                  '• Gentle detergent (avoid bleach)',
                  '• Tumble dry low to medium heat',
                  '• Iron: medium-high heat',
                  '• Note: Wrinkles easily (use promptly)',
                ],
                icon: '🌾',
              },
              {
                fabric: 'Delicates',
                description: 'Lace, netting, thin materials',
                care: [
                  '• Hand wash or delicate cycle',
                  '• Cold water, gentle detergent',
                  '• Use mesh wash bag in machine',
                  '• Air dry only',
                  '• Iron: very low heat or none',
                ],
                icon: '💎',
              },
              {
                fabric: 'Denim',
                description: 'Heavy-duty cotton blend',
                care: [
                  '• Machine wash: cold water, normal cycle',
                  '• Turn inside-out to preserve color',
                  '• Tumble dry medium heat',
                  '• Can be air dried to reduce fading',
                  '• Note: May bleed dye initially',
                ],
                icon: '👖',
              },
              {
                fabric: 'Synthetics',
                description: 'Blends and technical fabrics',
                care: [
                  '• Check care label for specific instructions',
                  '• Usually warm water, gentle cycle',
                  '• Tumble dry low heat',
                  '• Avoid high temperatures',
                  '• Note: Wrinkle-resistant (minimal ironing)',
                ],
                icon: '🏃',
              },
            ].map((item, i) => (
              <Card key={i} hoverable>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{item.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-dark">{item.fabric}</h3>
                    <p className="text-sm text-gray">{item.description}</p>
                  </div>
                </div>
                <ul className="space-y-1 text-sm text-gray">
                  {item.care.map((line, j) => (
                    <li key={j}>{line}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stain Treatment */}
      <section className="section bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Stain Treatment Process</h2>
          
          <Card className="mb-8 bg-mint border-2 border-primary/20">
            <p className="text-lg text-dark">
              <span className="font-bold">Pre-treatment:</span> Our team inspects and pre-treats visible stains with specialized solutions before washing. Different stains require different treatments.
            </p>
          </Card>

          <div className="space-y-6">
            {[
              {
                stain: 'Oil & Grease',
                symptoms: 'Shiny spots that won\'t wash out with water',
                treatment: 'Apply degreaser, let sit 30min, then wash in warm water with detergent',
                difficulty: '⭐ Easy',
              },
              {
                stain: 'Wine, Juice & Berries',
                symptoms: 'Red/purple discoloration',
                treatment: 'Rinse with cold water, apply oxygen-based cleaner, let sit, then wash',
                difficulty: '⭐⭐ Medium',
              },
              {
                stain: 'Blood',
                symptoms: 'Brown or dark spots (visible when dry)',
                treatment: 'Rinse with cold water (never hot!), apply enzyme cleaner, wash in cold',
                difficulty: '⭐⭐ Medium',
              },
              {
                stain: 'Chocolate & Mud',
                symptoms: 'Brown stains, may be waxy',
                treatment: 'Let dry completely, brush off, then treat with enzyme cleaner',
                difficulty: '⭐ Easy',
              },
              {
                stain: 'Coffee & Tea',
                symptoms: 'Brown discoloration',
                treatment: 'Rinse with cold water, apply oxygen bleach, let sit 30min, wash warm',
                difficulty: '⭐ Easy',
              },
              {
                stain: 'Ink & Pen',
                symptoms: 'Blue, black, or colored marks',
                treatment: 'Dab with rubbing alcohol, rinse, then wash. May need professional treatment',
                difficulty: '⭐⭐⭐ Difficult',
              },
              {
                stain: 'Grass',
                symptoms: 'Green or tan marks',
                treatment: 'Apply enzyme cleaner or rubbing alcohol, let sit 30min, wash warm',
                difficulty: '⭐⭐ Medium',
              },
              {
                stain: 'Make-up',
                symptoms: 'Colored residue, usually red/brown',
                treatment: 'Apply makeup remover or rubbing alcohol, gently dab, rinse, wash cold',
                difficulty: '⭐⭐ Medium',
              },
            ].map((item, i) => (
              <Card key={i}>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-dark mb-2">{item.stain}</h3>
                    <p className="text-sm text-gray mb-2"><span className="font-semibold">Looks like:</span> {item.symptoms}</p>
                    <p className="text-sm text-gray mb-3"><span className="font-semibold">Treatment:</span> {item.treatment}</p>
                  </div>
                  <div className="text-right text-lg font-semibold text-primary whitespace-nowrap">
                    {item.difficulty}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-light border-2 border-gray/20">
            <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
              <AlertCircle size={20} className="text-primary" />
              Pro Tips
            </h3>
            <ul className="space-y-2 text-gray">
              <li>• <span className="font-semibold">Fresh stains are easier:</span> Report immediately for best results</li>
              <li>• <span className="font-semibold">Cold water first:</span> Hot water can set many stains permanently</li>
              <li>• <span className="font-semibold">Blot, don't rub:</span> Rubbing pushes stain deeper into fibers</li>
              <li>• <span className="font-semibold">Test treatments first:</span> Check colorfastness on hidden area</li>
              <li>• <span className="font-semibold">Never iron a stain:</span> Heat sets the stain permanently</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Special Services */}
      <section className="section bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Specialty Care Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                service: 'Hand Washing',
                description: 'Gentle hand-washing for delicate items like lingerie, swimwear, and hand-knits',
                best_for: 'Silk, cashmere, lace, vintage items',
                price: '+$2.00/item',
              },
              {
                service: 'Delicate Cycle',
                description: 'Specialized washing with reduced agitation and cool water',
                best_for: 'Silks, wools, blended delicates',
                price: '+$1.00/item',
              },
              {
                service: 'Dry Clean Only Care',
                description: 'Professional dry cleaning for items marked "dry clean only"',
                best_for: 'Structured jackets, wool coats, formal wear',
                price: '+$4.00/item',
              },
              {
                service: 'Air Dry Only',
                description: 'No machine drying - items air-dried on racks',
                best_for: 'Elastic items, knits, stretch fabrics',
                price: '+$1.50/order',
              },
              {
                service: 'Iron & Press',
                description: 'Professional pressing with steam or dry iron as appropriate',
                best_for: 'Dress shirts, linens, professional clothing',
                price: '+$2.50/item',
              },
              {
                service: 'Stain Pre-Treatment',
                description: 'Priority stain treatment before washing',
                best_for: 'Visible stains, delicate fabrics with spots',
                price: '+$3.00/item',
              },
            ].map((item, i) => (
              <Card key={i} hoverable>
                <h3 className="text-xl font-bold text-dark mb-2">{item.service}</h3>
                <p className="text-gray text-sm mb-3">{item.description}</p>
                <div className="flex justify-between items-end border-t border-gray/10 pt-3">
                  <div>
                    <p className="text-xs text-gray">Best for:</p>
                    <p className="text-sm font-semibold text-dark">{item.best_for}</p>
                  </div>
                  <p className="text-primary font-bold text-lg">{item.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What Not To Send */}
      <section className="section bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Items We Don't Handle</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-red-200 bg-red-50">
              <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-red-500" />
                We Can't Accept
              </h3>
              <ul className="space-y-2 text-gray">
                <li>❌ Items with hazardous materials or contents</li>
                <li>❌ Flammable materials or garments</li>
                <li>❌ Items with metal buckles or hardware (risk of damage)</li>
                <li>❌ Leatherwear or suede garments</li>
                <li>❌ Fur coats or fur-trimmed items</li>
                <li>❌ Items visibly damaged or falling apart</li>
              </ul>
            </Card>

            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-yellow-600" />
                Special Handling Items
              </h3>
              <ul className="space-y-2 text-gray">
                <li>⚠️ Embellished items (sequins, beads) - possible extra charge</li>
                <li>⚠️ Swimwear & lingerie - hand wash available</li>
                <li>⚠️ Activewear - special moisture-wicking care</li>
                <li>⚠️ Vintage pieces - we recommend contacting us first</li>
                <li>⚠️ Items with stains - pre-treatment may be needed</li>
              </ul>
            </Card>
          </div>

          <Card className="mt-8 bg-mint border-2 border-primary/20">
            <h3 className="font-bold text-dark mb-3">Always Check Labels</h3>
            <p className="text-gray">
              Before sending items, always check the care label. If it says "dry clean only," we can handle it with our specialty dry cleaning service. If it says "hand wash only," we can hand wash it. When in doubt, include a note in your order with special instructions.
            </p>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Care & Handling FAQ</h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Will my dark jeans fade?',
                a: 'Some fading is normal with denim, but we minimize it by using cold water and turning items inside-out. We use color-safe detergent to preserve your investment.',
              },
              {
                q: 'Why do socks sometimes disappear?',
                a: 'We have a system to prevent this! Socks are collected in a mesh bag during washing. But with millions of loads, occasionally one escapes. Report it and we\'ll replace it.',
              },
              {
                q: 'Can you handle wool without shrinking it?',
                a: 'Yes! We use wool-specific detergent, cold water, and gentle agitation. Professional wool washing is actually gentler than home washing.',
              },
              {
                q: 'What happens to lint?',
                a: 'We use lint traps and professional-grade dryers. Your clothes come back lint-free. If lint transfer occurs, our guarantee covers it.',
              },
              {
                q: 'Do you use fabric softener?',
                a: 'We use premium liquid softener (not sheets) for most items. We can skip it if requested—just note in your order.',
              },
              {
                q: 'How do you handle wrinkles?',
                a: 'We remove items promptly from the dryer to minimize wrinkles. Professional pressing is available for an additional fee.',
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

      <Footer />
    </>
  )
}
