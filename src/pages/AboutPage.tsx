import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <>
      <Helmet><title>About Us — Avenue Surface</title></Helmet>

      <div className="bg-stone-50 py-16 px-6 text-center border-b border-stone-200">
        <h1 className="font-serif text-5xl font-semibold text-stone-900 mb-4">About Avenue Surface</h1>
        <p className="text-stone-500 max-w-xl mx-auto">Victoria's trusted tiles and flooring specialist. Quality products, honest advice, and service that actually shows up.</p>
      </div>

      {/* Our Story */}
      <div className="max-w-screen-xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="section-label">Our Story</p>
          <h2 className="font-serif text-4xl font-semibold text-stone-900 mb-5">Built on Quality, Integrity & Service</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Avenue Surface was founded with a clear vision: to make premium flooring and tiles accessible to every Victorian home and business, supported by expert guidance you can trust.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            With combined industry experience, our team has delivered solutions across a wide range of projects — from modern residential spaces to large-scale commercial developments throughout Victoria.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Every product we offer is carefully selected for its quality, durability, and performance. We stand behind our range with genuine warranties and ensure that all materials and installations are carried out in line with industry best practices, established guidelines, and professional standards.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            ['1,200+', 'Products Available'],
            ['4.9★',   'Average Rating'],
            ['Victoria', 'Our Service Area'],
            ['Certified', 'Installers'],
          ].map(([v, l]) => (
            <div key={l} className="bg-stone-50 border border-stone-200 rounded-xl p-6 text-center">
              <div className="font-serif text-4xl font-bold text-stone-900 mb-1">{v}</div>
              <p className="text-sm text-stone-500">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Service Area */}
      <div className="bg-stone-50 py-12 px-6 border-y border-stone-200">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-stone-900 mb-2">🇦🇺 Service Area — Victoria Only</h3>
            <p className="text-stone-500">We proudly serve Melbourne Metro and surrounding suburbs. For enquiries outside Victoria, please contact us directly.</p>
          </div>
          <Link to="/book-measure" className="btn-primary flex-shrink-0">Book Free Home Measure</Link>
        </div>
      </div>

      {/* Australian Standards */}
      <div className="bg-stone-800 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-serif text-4xl font-semibold text-white mb-3">Industry Standards We Follow</h2>
          <p className="text-stone-400 mb-10 max-w-2xl">All our installations and products are carried out in line with industry best practices and professional standards.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ['AS 1884', 'Resilient floor coverings — the primary standard for installation and performance of vinyl, hybrid, and laminate flooring.'],
              ['AS 3740', 'Waterproofing of wet areas in domestic and commercial buildings — mandatory for all bathroom and laundry tile installations.'],
              ['AS 3958', 'Ceramic tiles — installation methods, adhesive selection, and substrate preparation standards.'],
              ['AS 4586', 'Slip resistance classification for pedestrian surface materials — covers P3/P4/P5 outdoor tile ratings.'],
              ['AS/NZS 1170', 'Structural loading requirements — relevant for large format tile installation on suspended floors.'],
              ['E0/E1 Emissions', 'Formaldehyde emission limits for timber and engineered wood products — all our timber products comply.'],
            ].map(([std, desc]) => (
              <div key={std} className="bg-stone-700/50 rounded-xl p-5">
                <p className="font-semibold text-white mb-2">{std}</p>
                <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export function ContactPage() {
  return (
    <>
      <Helmet><title>Contact — Avenue Surface</title></Helmet>
      <div className="bg-stone-50 py-16 px-6 text-center border-b border-stone-200">
        <h1 className="font-serif text-5xl font-semibold text-stone-900 mb-4">Get in Touch</h1>
        <p className="text-stone-500 max-w-md mx-auto">Have a question about a product, need a quote, or want to book a free home measure? Our Victorian team is ready to help.</p>
      </div>
      <div className="max-w-screen-xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-stone-900 mb-6">Contact Details</h2>
          <div className="space-y-5 mb-10">
            {[
              ['📞', 'Phone', 'Available on request'],
              ['📧', 'Email', 'info@avenuesurrface.com.au'],
              ['📍', 'Location', 'Victoria, Australia'],
              ['🕐', 'Hours', 'Monday to Friday: 9am – 5pm\nSaturday: By appointment'],
              ['🇦🇺', 'Service Area', 'Victoria only — Melbourne Metro & surrounding suburbs'],
            ].map(([icon, label, val]) => (
              <div key={label} className="flex items-start gap-4">
                <span className="text-2xl">{icon}</span>
                <div><p className="font-medium text-stone-900">{label}</p><p className="text-sm text-stone-500 whitespace-pre-line">{val}</p></div>
              </div>
            ))}
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
            <h3 className="font-semibold text-stone-900 mb-2">Book a Free Home Measure</h3>
            <p className="text-sm text-stone-500 mb-3">Our specialist comes to you with samples, measures your space, and guides you through every option — completely free.</p>
            <Link to="/book-measure" className="btn-primary text-sm inline-block">Book Now →</Link>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl font-semibold text-stone-900 mb-6">Send a Message</h2>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Message sent! (Connect a real email service — see README.)') }}>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">First name</label><input required className="input-field" placeholder="Jane" /></div>
              <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Last name</label><input required className="input-field" placeholder="Smith" /></div>
            </div>
            <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Email</label><input type="email" required className="input-field" placeholder="jane@example.com.au" /></div>
            <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Phone</label><input className="input-field" placeholder="04XX XXX XXX" /></div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Enquiry type</label>
              <select className="input-field">
                <option>Book Free Home Measure</option>
                <option>Get a Quote</option>
                <option>Product Question</option>
                <option>Order Enquiry</option>
                <option>Other</option>
              </select>
            </div>
            <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Message</label><textarea required rows={5} className="input-field resize-none" placeholder="Tell us about your project…" /></div>
            <button type="submit" className="btn-primary w-full">Send Message</button>
            <p className="text-xs text-stone-400 text-center">We'll respond within 1 business day.</p>
          </form>
        </div>
      </div>
    </>
  )
}

export default AboutPage
