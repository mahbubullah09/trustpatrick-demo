const badges = [
  { icon: '✓', label: 'Vetted Contractors' },
  { icon: '⭐', label: 'Verified Reviews' },
  { icon: '🔒', label: 'No Spam Guarantee' },
  { icon: '💬', label: 'Free Estimates' },
];

export default function TrustBadges() {
  return (
    <div className="bg-brand-navy py-5">
      <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {badges.map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-white">
            <span className="text-brand-gold text-lg">{icon}</span>
            <span className="text-sm font-semibold tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
