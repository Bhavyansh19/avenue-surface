export default function AnnouncementBar() {
  const msgs = [
    '🏠 Free Delivery on Orders Over $500',
    '📦 3 Samples for $25 — Refunded on First Order',
    '⭐ 4.9/5 from 2,400+ Verified Reviews',
    '🎉 Autumn Sale — Up to 40% OFF',
    '✅ All Products Meet Australian Standards AS 1884',
    '🌿 FSC Certified Timber Available',
    '🔨 200+ Certified Installers Australia-Wide',
  ]
  return (
    <div className="bg-stone-800 text-stone-100 py-2 overflow-hidden">
      <div className="animate-ticker whitespace-nowrap inline-block text-xs tracking-wide">
        {[...msgs, ...msgs].map((m, i) => <span key={i} className="mx-10">{m}</span>)}
      </div>
    </div>
  )
}
