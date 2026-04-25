import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Check } from 'lucide-react'

export default function BookMeasurePage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', suburb: '', postcode: '',
    interestedIn: [] as string[],
    propertyType: '',
    preferredTime: '',
    hearAboutUs: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  const toggleInterest = (val: string) => {
    setForm(f => ({
      ...f,
      interestedIn: f.interestedIn.includes(val)
        ? f.interestedIn.filter(i => i !== val)
        : [...f.interestedIn, val],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ⚠️ CONNECT TO EMAIL SERVICE: Send form data to info@avenuesurrface.com.au
    // Use Nodemailer or Resend on the backend — see README for instructions
    console.log('Booking form submitted:', form)
    setSubmitted(true)
  }

  if (submitted) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Check size={32} className="text-green-600" />
      </div>
      <h2 className="font-serif text-4xl font-semibold text-stone-900 mb-3">Booking Request Received!</h2>
      <p className="text-stone-500 max-w-md mb-2">Thank you, <strong>{form.firstName}</strong>. Our team will be in touch within 1 business day to confirm your preferred time.</p>
      <p className="text-stone-400 text-sm">We'll contact you at <strong>{form.email}</strong> or <strong>{form.phone}</strong>.</p>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>Book Free Home Measure — Avenue Surface</title>
        <meta name="description" content="Book your free home measure and shop experience with Avenue Surface. We come to you with flooring and tile samples across Victoria." />
      </Helmet>

      {/* Hero */}
      <div className="bg-stone-800 py-16 px-6">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-3">Complimentary Service — Victoria Only</p>
            <h1 className="font-serif text-5xl font-semibold text-white mb-4">Book Your Free Home Measure</h1>
            <p className="text-stone-400 leading-relaxed text-lg">No guesswork. No showroom pressure. We bring curated flooring and tile samples directly to your home — in your lighting, with your furniture, tailored to your space.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['🎨', 'We Bring the Showroom to You', 'See real samples in your actual lighting and space'],
              ['📏', 'Precise Measurements', 'We measure every room accurately, including angles and transitions'],
              ['💡', 'Expert Guidance', 'Tailored advice for your interior style and practical needs'],
              ['💰', 'Transparent Quote', 'Clear pricing with no hidden costs, confirmed in writing'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="bg-stone-700/50 rounded-xl p-4">
                <div className="text-2xl mb-2">{icon}</div>
                <p className="font-medium text-white text-sm mb-1">{title}</p>
                <p className="text-stone-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Avenue Surface */}
      <div className="bg-stone-50 py-12 px-6 border-b border-stone-200">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-stone-900 mb-8 text-center">Why Shop at Home?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              ['See It In Your Lighting', 'What looks perfect in a showroom doesn\'t always work in your home. Our free home visit lets you see real samples in day and night lighting.'],
              ['Match Your Existing Décor', 'Hold samples against your walls, furniture, and existing finishes. Make a confident decision — without pressure.'],
              ['Expert First, Flooring First, Then Tiles', 'Our experienced team helps you select the right flooring first, then tiles, ensuring a seamless and cohesive finish throughout your home.'],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white rounded-xl border border-stone-200 p-6">
                <h3 className="font-semibold text-stone-900 mb-2">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-12 px-6 border-b border-stone-200">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-stone-900 mb-8 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              ['01', 'Book Your Free Measure', 'Fill in your details and choose your preferred time.'],
              ['02', 'We Visit Your Home', 'Our team arrives with curated flooring and tile samples suited to your space.'],
              ['03', 'Get Expert Advice', 'We guide you through materials, colours, and finishes to match your vision.'],
              ['04', 'Receive Your Quote', 'Clear, transparent pricing with no hidden surprises.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="text-center relative">
                <div className="font-serif text-7xl font-bold text-stone-100 absolute -top-3 left-1/2 -translate-x-1/2 select-none">{num}</div>
                <div className="relative z-10 pt-6">
                  <h3 className="font-semibold text-stone-900 mb-1 text-sm">{title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-4xl font-semibold text-stone-900 mb-3">Book Your Free Measure</h2>
            <p className="text-stone-500">All fields required unless marked optional. We'll confirm within 1 business day.</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800">
              ⚠️ Limited bookings available each week — book now to secure your time
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-8 space-y-6 shadow-sm">

            {/* Personal Details */}
            <div>
              <h3 className="font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100">Your Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">First Name *</label><input required value={form.firstName} onChange={set('firstName')} className="input-field" placeholder="Jane" /></div>
                  <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Last Name *</label><input required value={form.lastName} onChange={set('lastName')} className="input-field" placeholder="Smith" /></div>
                </div>
                <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Email *</label><input type="email" required value={form.email} onChange={set('email')} className="input-field" placeholder="jane@example.com.au" /></div>
                <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Phone *</label><input required value={form.phone} onChange={set('phone')} className="input-field" placeholder="04XX XXX XXX" /></div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100">Property Address</h3>
              <div className="space-y-3">
                <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Street Address *</label><input required value={form.address} onChange={set('address')} className="input-field" placeholder="123 Example Street" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Suburb *</label><input required value={form.suburb} onChange={set('suburb')} className="input-field" placeholder="Suburb" /></div>
                  <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Postcode *</label><input required value={form.postcode} onChange={set('postcode')} className="input-field" placeholder="3000" /></div>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-500">
                  🇦🇺 State: Victoria only — Melbourne Metro & surrounding suburbs
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className="font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100">Project Details</h3>
              <div className="space-y-4">

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">I'm Interested In *</label>
                  <div className="flex flex-wrap gap-2">
                    {['Flooring', 'Tiles', 'Both'].map(opt => (
                      <button key={opt} type="button" onClick={() => toggleInterest(opt)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${form.interestedIn.includes(opt) ? 'bg-terra text-white border-terra' : 'bg-white border-stone-300 text-stone-600 hover:border-stone-400'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Property Type *</label>
                  <div className="flex flex-wrap gap-2">
                    {['New Build', 'Renovation', 'Investment Property'].map(opt => (
                      <button key={opt} type="button" onClick={() => setForm(f => ({ ...f, propertyType: opt }))}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${form.propertyType === opt ? 'bg-stone-800 text-white border-stone-800' : 'bg-white border-stone-300 text-stone-600 hover:border-stone-400'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Preferred Time *</label>
                  <div className="flex gap-2">
                    {['Weekday', 'Weekend', 'Either'].map(opt => (
                      <button key={opt} type="button" onClick={() => setForm(f => ({ ...f, preferredTime: opt }))}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${form.preferredTime === opt ? 'bg-stone-800 text-white border-stone-800' : 'bg-white border-stone-300 text-stone-600 hover:border-stone-400'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">How did you hear about us?</label>
                  <select value={form.hearAboutUs} onChange={set('hearAboutUs')} className="input-field">
                    <option value="">Select…</option>
                    <option>Google Search</option>
                    <option>Social Media</option>
                    <option>Friend / Family Referral</option>
                    <option>Builder / Architect Referral</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">Message (optional)</label>
                  <textarea value={form.message} onChange={set('message')} rows={4} className="input-field resize-none" placeholder="Tell us more about your project — rooms, approximate area, style preferences…" />
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-500 leading-relaxed">
              <strong className="text-stone-700">Important Note:</strong> All images, samples, and product visuals are for illustrative purposes only. Actual products may vary in colour, tone, texture, and finish. We recommend viewing physical samples in your space before making a final decision.
            </div>

            <button type="submit" className="btn-primary w-full py-4 text-base">
              Submit Booking Request →
            </button>

            <p className="text-xs text-stone-400 text-center">
              By submitting this form you agree to our{' '}
              <a href="/terms" className="underline hover:text-terra">Terms & Conditions</a> and{' '}
              <a href="/privacy" className="underline hover:text-terra">Privacy Policy</a>.
              We'll never share your details with third parties.
            </p>
          </form>
        </div>
      </div>

      {/* What We Offer */}
      <div className="bg-stone-50 border-t border-stone-200 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-stone-900 mb-10 text-center">What We Offer</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2"><span className="text-xl">🪵</span>Flooring Solutions</h3>
              <ul className="space-y-2">
                {['Hybrid Flooring', 'Timber Flooring', 'Laminate Flooring', 'Vinyl Flooring', 'Bamboo Flooring', 'Carpet Tiles'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-stone-600"><span className="w-1.5 h-1.5 bg-terra rounded-full flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2"><span className="text-xl">🪨</span>Tile Solutions</h3>
              <ul className="space-y-2">
                {['Floor Tiles', 'Wall Tiles', 'Bathroom & Wet Area Tiles', 'Outdoor Tiles', 'Feature & Designer Tiles', 'Mosaic Tiles'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-stone-600"><span className="w-1.5 h-1.5 bg-terra rounded-full flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 bg-stone-800 rounded-xl p-5 text-center">
            <p className="text-white font-medium mb-1">🇦🇺 Service Area — Victoria Only</p>
            <p className="text-stone-400 text-sm">Melbourne Metro and surrounding suburbs. Contact us for enquiries outside these areas.</p>
          </div>
        </div>
      </div>
    </>
  )
}
