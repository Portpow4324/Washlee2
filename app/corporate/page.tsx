'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Link from 'next/link'
import { Briefcase, Users, TrendingUp, Clock, DollarSign, CheckCircle } from 'lucide-react'

export default function CorporateServicesPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-mint to-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Briefcase size={60} className="text-primary mx-auto mb-6" />
            <h1 className="text-5xl sm:text-6xl font-bold text-dark mb-6">Corporate Laundry Services</h1>
            <p className="text-xl text-gray max-w-2xl mx-auto">
              Give your team the gift of time. Boost morale, improve wellness, and show employees you care with Washlee corporate services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {[
              { number: '500+', label: 'Companies Trust Us' },
              { number: '95%', label: 'Employee Satisfaction' },
              { number: '10+', label: 'Years Experience' },
              { number: '$0', label: 'Setup Fees' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-bold text-primary mb-1">{stat.number}</p>
                <p className="text-gray">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="section bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Solutions for Every Business</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Users size={40} className="text-primary" />,
                title: 'Employee Benefits',
                description: 'Add Washlee as a wellness benefit. Employees get discounted or subsidized laundry service.',
                features: ['Flexible monthly stipends', 'Employee portal', 'Usage analytics', 'Zero admin burden'],
              },
              {
                icon: <DollarSign size={40} className="text-primary" />,
                title: 'Corporate Gifting',
                description: 'Employee retention gift cards, client appreciation packages, or team rewards.',
                features: ['Volume discounts', 'Custom branding', 'Bulk ordering', 'Flexible delivery'],
              },
              {
                icon: <TrendingUp size={40} className="text-primary" />,
                title: 'Uniform Services',
                description: 'Professional laundry & dry cleaning for corporate uniforms and workwear.',
                features: ['Bulk discounts', 'Scheduled pickups', 'Quality guarantee', 'Tracking system'],
              },
              {
                icon: <Clock size={40} className="text-primary" />,
                title: 'Executive Service',
                description: 'Premium white-glove laundry service for senior executives and VIP clients.',
                features: ['Same-day service', 'Personal pickup', 'Premium packaging', '24/7 availability'],
              },
              {
                icon: <CheckCircle size={40} className="text-primary" />,
                title: 'Hotel & Hospitality',
                description: 'Guest laundry service option or staff laundry solutions for hospitality businesses.',
                features: ['Bulk rates', 'Express service', 'Quality control', 'Concierge integration'],
              },
              {
                icon: <Briefcase size={40} className="text-primary" />,
                title: 'On-Site Laundry',
                description: 'Washlee can operate on-site laundry facilities at your business location.',
                features: ['Full installation', 'Staff management', 'Maintenance included', 'Revenue share'],
              },
            ].map((solution, i) => (
              <Card key={i} hoverable className="flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  {solution.icon}
                  <h3 className="text-2xl font-bold text-dark">{solution.title}</h3>
                </div>
                <p className="text-gray mb-6">{solution.description}</p>
                <ul className="space-y-2 text-sm text-gray">
                  {solution.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Employee Benefits */}
      <section className="section bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Employee Benefits Program</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card hoverable>
              <h3 className="text-2xl font-bold text-primary mb-4">For Employees</h3>
              <ul className="space-y-3">
                {[
                  '✓ Save 30-50% off regular prices',
                  '✓ Free pickup and delivery',
                  '✓ Special care for delicate items',
                  '✓ Convenient app scheduling',
                  '✓ Real-time order tracking',
                  '✓ 24/7 customer support',
                ].map((item, i) => (
                  <li key={i} className="text-gray">{item}</li>
                ))}
              </ul>
            </Card>

            <Card hoverable>
              <h3 className="text-2xl font-bold text-primary mb-4">For Companies</h3>
              <ul className="space-y-3">
                {[
                  '✓ Boost employee morale & retention',
                  '✓ Show you care about wellness',
                  '✓ Zero administrative overhead',
                  '✓ Flexible budget options',
                  '✓ Full usage analytics',
                  '✓ Dedicated account manager',
                ].map((item, i) => (
                  <li key={i} className="text-gray">{item}</li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="bg-mint border-2 border-primary/20">
            <h3 className="font-bold text-dark mb-3">How It Works</h3>
            <ol className="space-y-3 text-gray">
              <li><span className="font-semibold text-dark">1. Setup:</span> You choose monthly budget per employee ($20-$100)</li>
              <li><span className="font-semibold text-dark">2. Enrollment:</span> Employees register and get their account</li>
              <li><span className="font-semibold text-dark">3. Usage:</span> They book laundry anytime, balance renews monthly</li>
              <li><span className="font-semibold text-dark">4. Billing:</span> Company billed monthly, simple invoice</li>
            </ol>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section className="section bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Corporate Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                plan: 'Small',
                size: '1-50 employees',
                discount: '10% discount',
                pricing: 'per load',
                details: ['Dedicated support', 'Usage analytics', 'Flexible scheduling'],
              },
              {
                plan: 'Medium',
                size: '51-200 employees',
                discount: '20% discount',
                pricing: 'per load',
                details: ['Premium support', 'Advanced analytics', 'Custom service options'],
                featured: true,
              },
              {
                plan: 'Enterprise',
                size: '200+ employees',
                discount: 'Custom pricing',
                pricing: 'contact sales',
                details: ['Dedicated account manager', 'Custom integrations', 'White-label options'],
              },
            ].map((plan, i) => (
              <Card
                key={i}
                hoverable
                className={plan.featured ? 'ring-2 ring-primary scale-105' : ''}
              >
                {plan.featured && <p className="text-center mb-4"><span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">MOST POPULAR</span></p>}
                <h3 className="text-2xl font-bold text-dark mb-2">{plan.plan}</h3>
                <p className="text-gray text-sm mb-4">{plan.size}</p>
                <p className="text-primary font-bold text-xl mb-1">{plan.discount}</p>
                <p className="text-sm text-gray mb-6">{plan.pricing}</p>
                <ul className="space-y-2 mb-6">
                  {plan.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray">
                      <CheckCircle size={16} className="text-primary flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="sm">
                  Get Started
                </Button>
              </Card>
            ))}
          </div>

          <Card className="bg-light border-2 border-gray/20">
            <h3 className="font-bold text-dark mb-3">+ Bulk Gifting Discounts</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              {[
                { qty: '10-49', disc: '5% off' },
                { qty: '50-99', disc: '10% off' },
                { qty: '100-249', disc: '15% off' },
                { qty: '250+', disc: 'Custom' },
              ].map((item, i) => (
                <div key={i}>
                  <p className="font-semibold text-dark">{item.qty} cards</p>
                  <p className="text-primary font-bold">{item.disc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Case Studies */}
      <section className="section bg-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Why Companies Choose Washlee</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                company: 'TechCorp Inc.',
                industry: 'Software/Tech',
                testimonial: 'Washlee became our #1 requested employee benefit. Retention improved by 12% after launch.',
                result: 'Employee morale ↑ 35%',
              },
              {
                company: 'Urban Consulting',
                industry: 'Professional Services',
                testimonial: 'Our busy consultants no longer stress about laundry. It\'s been a game-changer for work-life balance.',
                result: 'Absenteeism ↓ 18%',
              },
              {
                company: 'Premier Hotels',
                industry: 'Hospitality',
                testimonial: 'Guest laundry service differentiates us from competitors. Guests love the convenience.',
                result: 'Guest satisfaction ↑ 28%',
              },
            ].map((study, i) => (
              <Card key={i} hoverable>
                <h3 className="text-xl font-bold text-dark mb-1">{study.company}</h3>
                <p className="text-xs text-gray mb-4 font-semibold">{study.industry}</p>
                <p className="text-gray mb-6 italic">"{study.testimonial}"</p>
                <p className="text-primary font-bold text-lg">{study.result}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="section bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Simple Implementation</h2>
          
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Schedule a Consultation',
                description: 'Talk with our corporate team about your needs, budget, and goals.',
              },
              {
                step: '2',
                title: 'Custom Proposal',
                description: 'We create a tailored solution with pricing and implementation timeline.',
              },
              {
                step: '3',
                title: 'Setup & Integration',
                description: 'We handle all technical setup, employee enrollment, and training.',
              },
              {
                step: '4',
                title: 'Launch & Support',
                description: 'Roll out to employees with dedicated account manager support.',
              },
              {
                step: '5',
                title: 'Optimize & Scale',
                description: 'Monitor usage, gather feedback, and adjust program as needed.',
              },
            ].map((item, i) => (
              <Card key={i} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-dark mb-1">{item.title}</h3>
                  <p className="text-gray">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Enterprise Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📊', title: 'Advanced Analytics', desc: 'Usage reports, ROI tracking, employee insights' },
              { icon: '🔒', title: 'Security & Privacy', desc: 'Enterprise-grade data protection and compliance' },
              { icon: '🤝', title: 'API Integration', desc: 'Connect to your HRIS, benefits platform, or payroll' },
              { icon: '👤', title: 'Account Manager', desc: 'Dedicated support for your company\'s needs' },
              { icon: '🌍', title: 'Multi-Location', desc: 'Support for offices across multiple cities' },
              { icon: '⚙️', title: 'Custom Workflows', desc: 'Flexible policies, approval processes, budgets' },
            ].map((feature, i) => (
              <Card key={i} className="text-center">
                <p className="text-4xl mb-3">{feature.icon}</p>
                <h3 className="font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-sm text-gray">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Corporate FAQ</h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'What\'s the minimum company size?',
                a: 'We work with companies of any size, from 1-person startups to Fortune 500 companies. Pricing scales appropriately.',
              },
              {
                q: 'Can we customize the program?',
                a: 'Absolutely. We offer flexible budgets, opt-in vs. automatic enrollment, service level tiers, and more.',
              },
              {
                q: 'Do you handle payroll deduction?',
                a: 'Yes, for companies that want to offer it as a benefit. We can integrate with most payroll systems.',
              },
              {
                q: 'What cities do you serve?',
                a: 'Washlee operates in 50+ major cities. If you have offices in different locations, we can set up service accordingly.',
              },
              {
                q: 'How is billing handled?',
                a: 'Simple. We send one monthly invoice for the entire program. You can pay however you prefer (ACH, card, check).',
              },
              {
                q: 'Can employees use Washlee outside of work?',
                a: 'Yes! Once enrolled, they can use Washlee anytime, anywhere Washlee operates. It\'s their benefit.',
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
          <Briefcase size={60} className="text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-dark mb-6">Ready to Invest in Your Team?</h2>
          <p className="text-lg text-gray mb-8 max-w-2xl mx-auto">
            Talk with our corporate team about how Washlee can boost morale, improve retention, and show employees you care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="mailto:corporate@washlee.com">
              <Button size="lg">Contact Corporate Sales</Button>
            </Link>
            <Button size="lg" variant="outline">Download PDF Guide</Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
