import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

const SECTIONS = ['Terms of Service', 'Privacy Policy', 'Refund Policy']

export function TermsPage() {
  const [active, setActive] = useState('Terms of Service')

  return (
    <>
      <Helmet><title>Terms & Conditions — Avenue Surface</title></Helmet>

      <div className="bg-stone-50 py-12 px-6 border-b border-stone-200 text-center">
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-2">Legal Information</h1>
        <p className="text-stone-500">Terms of Service · Privacy Policy · Refund Policy</p>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Tab nav */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setActive(s)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${active === s ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="max-w-3xl prose prose-stone text-stone-700">

          {active === 'Terms of Service' && (
            <div className="space-y-8">
              <div><p className="text-xs text-stone-400 mb-6">This website is operated by AVENUE SURFACE. Throughout the site, the terms "we", "us" and "our" refer to AVENUE SURFACE. By accessing this website or engaging our products and services, you agree to be bound by these Terms.</p></div>

              <Section title="Overview">
                <p>If you do not agree to these Terms, you must not use this website or our services.</p>
              </Section>

              <Section title="1. Use of Website">
                <p>You agree to use this website lawfully and not engage in any activity that may harm, disrupt, or interfere with the website or its users.</p>
              </Section>

              <Section title="2. Products & Services">
                <p>We specialise in flooring and tiling solutions for residential and commercial projects across Victoria.</p>
                <ul>
                  <li>All products are selected for quality and durability</li>
                  <li>Availability is subject to change</li>
                  <li>We reserve the right to limit quantities or refuse supply</li>
                </ul>
                <p className="text-sm bg-stone-50 border border-stone-200 rounded-lg p-3 not-prose text-stone-500 mt-3"><strong>Disclaimer:</strong> All images, renders, and photographs displayed on this website are for illustrative purposes only. Actual products may vary in colour, texture, finish, and appearance.</p>
              </Section>

              <Section title="3. Quotations & Variations">
                <ul>
                  <li>All quotes are valid for a limited time unless otherwise stated</li>
                  <li>Quotes are based on information available at the time</li>
                  <li>Any changes in scope, materials, or site conditions may result in variations and additional costs</li>
                  <li>Variations will be communicated and approved before proceeding</li>
                </ul>
              </Section>

              <Section title="4. Installation & Site Conditions">
                <p>Where installation services are provided:</p>
                <ul>
                  <li>Works are carried out in accordance with professional practices, manufacturer recommendations, and established guidelines</li>
                  <li>The client is responsible for ensuring site readiness prior to installation</li>
                  <li>Subfloor preparation, levelling, moisture treatment, or rectification works may incur additional charges</li>
                  <li>Delays caused by site conditions, weather, or third parties are not the responsibility of AVENUE SURFACE</li>
                </ul>
              </Section>

              <Section title="5. Pricing & Payments">
                <ul>
                  <li>Prices are subject to change without notice unless confirmed in writing</li>
                  <li>Deposits may be required prior to order confirmation</li>
                  <li>Progress payments may apply for larger projects</li>
                  <li>Final payment must be completed prior to handover unless agreed otherwise</li>
                </ul>
              </Section>

              <Section title="6. Warranties">
                <p>Products are covered by manufacturer warranties where applicable. Installation is carried out with due care and professional skill.</p>
                <p>Exclusions include: natural material variation, wear and tear, improper use or maintenance, and damage caused by third parties.</p>
              </Section>

              <Section title="7. Returns & Refunds">
                <p>Refer to our Refund Policy. Custom orders and installed products are generally non-refundable unless required by Australian Consumer Law.</p>
              </Section>

              <Section title="8. Limitation of Liability">
                <p>To the maximum extent permitted by law, AVENUE SURFACE shall not be liable for indirect or consequential losses, delays outside reasonable control, or loss of profits, revenue, or business opportunities.</p>
              </Section>

              <Section title="9. Intellectual Property">
                <p>All content on this website remains the property of AVENUE SURFACE and may not be used without written permission.</p>
              </Section>

              <Section title="10. Governing Law">
                <p>These Terms are governed by the laws of Australia.</p>
              </Section>

              <Section title="11. Contact">
                <p>For enquiries: <a href="mailto:info@avenuesurrface.com.au" className="text-terra">info@avenuesurrface.com.au</a></p>
              </Section>

              <div className="border-t border-stone-200 pt-8">
                <h3 className="font-semibold text-stone-900 mb-4">Additional Industry Clauses — Flooring & Tiling</h3>
                <div className="space-y-4 text-sm text-stone-600">
                  <div><strong>Material Variation:</strong> Tiles, timber, vinyl, and stone products may vary in shade, grain, and finish. This is a natural characteristic and not considered a defect.</div>
                  <div><strong>Site Preparation:</strong> Clients must ensure clear site access, removal of furniture and obstructions, and suitable subfloor conditions. Additional preparation work will be charged if required.</div>
                  <div><strong>Moisture & Structural Conditions:</strong> We are not responsible for subfloor moisture issues, structural movement, or pre-existing defects. Such conditions may impact installation and performance.</div>
                  <div><strong>Maintenance:</strong> Proper care and maintenance are required to preserve product performance and warranty validity.</div>
                  <div><strong>Timelines:</strong> All project timelines are estimates and subject to change based on site conditions, supply, and external factors.</div>
                </div>
              </div>
            </div>
          )}

          {active === 'Privacy Policy' && (
            <div className="space-y-6">
              <p className="text-sm text-stone-400">Last updated: February 1, 2026</p>
              <p>This Privacy Policy describes how AVENUE SURFACE ("we", "us", or "our") collects, uses, and discloses your personal information when you visit avenuesurrface.com.au or otherwise communicate with us.</p>
              <p>By accessing or using our Services, you agree to the collection, use, and disclosure of your information as outlined in this Privacy Policy.</p>

              <Section title="Changes to This Policy">
                <p>We may update this Privacy Policy from time to time. Any updates will be posted on this page with a revised "Last updated" date.</p>
              </Section>

              <Section title="Information We Collect">
                <p><strong>Information You Provide:</strong> Name, address, phone, email, billing/shipping details, payment confirmation, and account information.</p>
                <p><strong>Usage Data (Automatically Collected):</strong> IP address, device and browser type, pages visited and time spent, collected via cookies and similar technologies.</p>
                <p><strong>From Third Parties:</strong> Service providers, payment processors, and marketing/analytics partners.</p>
              </Section>

              <Section title="How We Use Your Information">
                <ul>
                  <li>Processing orders and payments</li>
                  <li>Managing accounts and arranging deliveries</li>
                  <li>Providing customer support</li>
                  <li>Sending promotional communications (you may opt out at any time)</li>
                  <li>Improving our website and services</li>
                  <li>Monitoring and preventing suspicious activity</li>
                </ul>
              </Section>

              <Section title="Cookies & Tracking">
                <p>We use cookies to improve website functionality, remember preferences, and analyse traffic. You may disable cookies via your browser settings; however, this may affect website functionality.</p>
              </Section>

              <Section title="How We Disclose Your Information">
                <p>We may share your information with service providers (IT, payments, logistics, analytics), marketing partners, and authorities where required by law. We only share information where necessary.</p>
              </Section>

              <Section title="Third-Party Links">
                <p>Our website may contain links to third-party platforms. We are not responsible for their privacy practices. You should review their policies before engaging with them.</p>
              </Section>

              <Section title="Children's Privacy">
                <p>Our Services are not intended for individuals under 16 years of age. We do not knowingly collect personal information from children.</p>
              </Section>

              <Section title="Data Security & Retention">
                <p>We take reasonable steps to protect your personal information. We retain it only as long as necessary to provide services, meet legal obligations, and resolve disputes.</p>
              </Section>

              <Section title="Your Rights">
                <p>You may have rights including: access to your data, correction of inaccurate information, deletion, restriction of processing, data portability, and withdrawal of consent. Contact us to exercise these rights.</p>
              </Section>

              <Section title="Contact">
                <p>For privacy-related enquiries: <a href="mailto:info@avenuesurrface.com.au" className="text-terra">info@avenuesurrface.com.au</a></p>
              </Section>
            </div>
          )}

          {active === 'Refund Policy' && (
            <div className="space-y-6">
              <Section title="General Policy">
                <p>We comply with Australian Consumer Law. Refunds, repairs, or replacements are provided where products are faulty or defective, do not match description, or are not fit for intended purpose.</p>
              </Section>

              <Section title="Change of Mind">
                <p>We do not offer refunds for change of mind unless agreed in writing.</p>
              </Section>

              <Section title="Non-Returnable Items">
                <ul>
                  <li>Custom or special-order products</li>
                  <li>Clearance or sale items</li>
                  <li>Installed materials</li>
                </ul>
              </Section>

              <Section title="Return Conditions">
                <ul>
                  <li>Items must be unused and in original condition</li>
                  <li>Proof of purchase is required</li>
                </ul>
              </Section>

              <Section title="Installation Services">
                <p>Refunds are not applicable once installation services have commenced or been completed, except where required by Australian Consumer Law.</p>
              </Section>

              <Section title="Contact">
                <p>For refund-related enquiries: <a href="mailto:info@avenuesurrface.com.au" className="text-terra">info@avenuesurrface.com.au</a></p>
              </Section>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-stone-900 text-lg mb-3 pb-2 border-b border-stone-100">{title}</h3>
      <div className="text-sm text-stone-600 space-y-2 leading-relaxed">{children}</div>
    </div>
  )
}

export default TermsPage
