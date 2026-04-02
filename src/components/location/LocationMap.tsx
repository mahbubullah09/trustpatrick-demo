interface Props {
  city: string;
  regionCode: string;
}

export default function LocationMap({ city, regionCode }: Props) {
  const query = encodeURIComponent(`${city}, ${regionCode}, USA`);
  const src = `https://maps.google.com/maps?q=${query}&z=11&output=embed`;

  return (
    <section className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
      <div className="relative">
        {/* City label bar */}
        <div className="bg-brand-navy px-5 py-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-brand-gold flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              stroke="currentColor"
              strokeWidth="2"
              fill="currentColor"
              fillOpacity="0.2"
            />
            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="text-white text-sm font-semibold tracking-wide">
            {city}, {regionCode}
          </span>
        </div>

        {/* Map iframe */}
        <iframe
          title={`Map of ${city}, ${regionCode}`}
          src={src}
          width="100%"
          height="380"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
