import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, ArrowLeft } from 'lucide-react'

const QUESTIONS = [
  {
    id: 'room',
    q: 'Which room are you flooring?',
    hint: 'This helps us determine waterproofing and slip rating requirements.',
    options: [
      { label: 'Bathroom or Laundry', val: 'wet', detail: 'Requires 100% waterproof flooring' },
      { label: 'Kitchen', val: 'kitchen', detail: 'Needs to handle spills and heavy traffic' },
      { label: 'Living or Dining Room', val: 'living', detail: 'Focus on comfort and aesthetics' },
      { label: 'Bedroom', val: 'bedroom', detail: 'Warmth and quiet underfoot' },
      { label: 'Outdoor or Alfresco', val: 'outdoor', detail: 'P4/P5 slip rating required' },
      { label: 'Commercial or Office', val: 'commercial', detail: 'Heavy foot traffic durability' },
    ],
  },
  {
    id: 'lifestyle',
    q: 'Which best describes your household?',
    hint: 'This helps us recommend the right durability level.',
    options: [
      { label: 'Family with young kids', val: 'kids', detail: 'Needs scratch and dent resistance' },
      { label: 'Family with pets', val: 'pets', detail: 'Pet-friendly, scratch-resistant surface' },
      { label: 'Couple or singles', val: 'couple', detail: 'Moderate traffic, more style options' },
      { label: 'Investment or rental property', val: 'rental', detail: 'Cost-effective and durable' },
      { label: 'Commercial use', val: 'commercial', detail: 'Maximum durability required' },
    ],
  },
  {
    id: 'look',
    q: 'What look are you going for?',
    hint: 'Your style preference guides our product recommendation.',
    options: [
      { label: 'Natural timber warmth', val: 'timber', detail: 'Oak, walnut, or Australian hardwood tones' },
      { label: 'Stone or tile aesthetic', val: 'stone', detail: 'Marble, slate, or travertine looks' },
      { label: 'Modern grey or cool tones', val: 'modern', detail: 'Contemporary, clean, and minimal' },
      { label: 'Classic warm and earthy', val: 'warm', detail: 'Honey, caramel, and terracotta tones' },
      { label: 'Bold or pattern feature', val: 'feature', detail: 'Herringbone, chevron, or statement tiles' },
    ],
  },
  {
    id: 'budget',
    q: 'What is your approximate budget per m²?',
    hint: 'This helps us find the best value option in your range.',
    options: [
      { label: 'Under $35/m²', val: 'low', detail: 'Great options in laminate and vinyl' },
      { label: '$35 – $55/m²', val: 'mid', detail: 'Wide range of hybrid and vinyl plank' },
      { label: '$55 – $80/m²', val: 'high', detail: 'Premium hybrid and engineered timber' },
      { label: '$80+/m²', val: 'premium', detail: 'Solid timber, premium stone, and designer tiles' },
    ],
  },
  {
    id: 'install',
    q: 'How are you planning to install?',
    hint: 'Some products are better suited to professional installation.',
    options: [
      { label: 'DIY — doing it myself', val: 'diy', detail: 'Click-float products are easiest for DIY' },
      { label: 'Hiring a professional', val: 'pro', detail: 'Opens up all product types including glue-down' },
      { label: 'Would like Avenue Surface to install', val: 'avenue', detail: 'We can arrange a certified installer across Victoria' },
      { label: "Not sure yet", val: 'unsure', detail: "We'll guide you on the best approach" },
    ],
  },
]

const RECOMMENDATIONS: Record<string, { cat: string; slug: string; emoji: string; why: string }[]> = {
  wet:        [{ cat: 'Hybrid Flooring',    slug: 'hybrid',  emoji: '🌊', why: '100% waterproof SPC core — the only flooring suitable for bathrooms and laundries without restriction.' }],
  kitchen:    [{ cat: 'Hybrid Flooring',    slug: 'hybrid',  emoji: '🌊', why: 'Waterproof, scratch-resistant, and handles kitchen spills with ease.' }, { cat: 'Tiles',  slug: 'tiles', emoji: '🪨', why: 'Timeless, easy to clean, and extremely durable under heavy kitchen use.' }],
  living:     [{ cat: 'Engineered Timber',  slug: 'timber',  emoji: '🪵', why: 'Adds warmth and real value to living areas — the premium choice for main living spaces.' }, { cat: 'Hybrid Flooring', slug: 'hybrid', emoji: '🌊', why: 'Realistic timber look with the practical benefits of a waterproof, floating floor.' }],
  bedroom:    [{ cat: 'Engineered Timber',  slug: 'timber',  emoji: '🪵', why: 'Warm underfoot and visually stunning in bedrooms.' }, { cat: 'Laminate', slug: 'laminate', emoji: '📋', why: 'Budget-friendly with excellent timber looks and quiet underfoot.' }, { cat: 'Carpet Tiles', slug: 'carpet', emoji: '🧶', why: 'Soft, warm, and sound-absorbing — ideal for bedrooms.' }],
  outdoor:    [{ cat: 'Outdoor Tiles (P4/P5)', slug: 'tiles', emoji: '🪨', why: 'P4/P5 slip-rated outdoor porcelain — safe, durable, and all-weather. Required by Australian Standards.' }],
  commercial: [{ cat: 'Carpet Tiles',       slug: 'carpet',  emoji: '🧶', why: 'Commercial-grade, easy to replace individual tiles, and excellent sound absorption.' }, { cat: 'Vinyl Plank', slug: 'vinyl', emoji: '🌿', why: 'Durable, waterproof, low maintenance, and cost-effective for commercial spaces.' }],
}

export default function FloorFinderPage() {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone]       = useState(false)

  const q        = QUESTIONS[step]
  const progress = (step / QUESTIONS.length) * 100

  const handleAnswer = (val: string) => {
    const next = { ...answers, [q.id]: val }
    setAnswers(next)
    if (step < QUESTIONS.length - 1) setStep(s => s + 1)
    else setDone(true)
  }

  const recs = RECOMMENDATIONS[answers.room] || RECOMMENDATIONS.living

  return (
    <>
      <Helmet>
        <title>Floor Finder — Avenue Surface</title>
        <meta name="description" content="Answer 5 quick questions and find the perfect flooring for your Victorian home. Free expert recommendation tool." />
      </Helmet>

      {/* Hero */}
      <div className="bg-stone-50 border-b border-stone-200 py-12 px-6 text-center">
        <p className="section-label">Find Your Perfect Floor</p>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-3">Floor Finder</h1>
        <p className="text-stone-500 max-w-md mx-auto">Answer {QUESTIONS.length} quick questions and we'll recommend the best flooring for your Victorian home, lifestyle, and budget.</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {!done ? (
          <div>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-stone-400 mb-2">
                <span>Question {step + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-1.5">
                <div className="bg-terra h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Question */}
            <h2 className="font-serif text-3xl font-semibold text-stone-900 mb-2">{q.q}</h2>
            {q.hint && <p className="text-sm text-stone-400 mb-8">{q.hint}</p>}

            <div className="space-y-3">
              {q.options.map(o => (
                <button key={o.val} onClick={() => handleAnswer(o.val)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-white border border-stone-200 rounded-xl text-left hover:border-terra hover:shadow-md transition-all duration-200 group">
                  <div>
                    <span className="font-medium text-stone-800 group-hover:text-terra transition-colors block">{o.label}</span>
                    {o.detail && <span className="text-xs text-stone-400 mt-0.5 block">{o.detail}</span>}
                  </div>
                  <ChevronRight size={16} className="text-stone-300 group-hover:text-terra transition-colors flex-shrink-0 ml-4" />
                </button>
              ))}
            </div>

            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-sm text-stone-500 hover:text-terra mt-6 transition-colors">
                <ArrowLeft size={14} />Back to previous question
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="font-serif text-4xl font-semibold text-stone-900 mb-3">Here Are Your Recommendations</h2>
              <p className="text-stone-500">Based on your answers, here's what we'd recommend for your Victorian home.</p>
            </div>

            <div className="space-y-4 mb-10">
              {recs.map((r, i) => (
                <div key={r.slug} className="bg-white border border-stone-200 rounded-xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 bg-terra/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{r.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif text-stone-300 text-lg font-bold">#{i+1}</span>
                      <h3 className="font-semibold text-stone-900">{r.cat}</h3>
                    </div>
                    <p className="text-sm text-stone-500">{r.why}</p>
                  </div>
                  <Link to={`/shop/${r.slug}`} className="btn-primary text-sm px-4 py-2 flex-shrink-0">Shop Now</Link>
                </div>
              ))}
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 text-center mb-6">
              <p className="font-medium text-stone-900 mb-2">Want to see samples in your home?</p>
              <p className="text-sm text-stone-500 mb-4">Book a free home measure and our team will bring the right samples directly to your Victorian home.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link to="/book-measure" className="btn-primary">Book Free Home Measure</Link>
                <button onClick={() => { setStep(0); setAnswers({}); setDone(false) }} className="btn-outline">Start Over</button>
              </div>
            </div>

            {/* Your answers summary */}
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">Your Answers</p>
              <div className="space-y-1.5">
                {QUESTIONS.map(q => answers[q.id] && (
                  <div key={q.id} className="flex justify-between text-sm">
                    <span className="text-stone-500">{q.q}</span>
                    <span className="font-medium text-stone-800 capitalize">{q.options.find(o => o.val === answers[q.id])?.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
