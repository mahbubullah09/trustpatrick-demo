import { fetchProjectsByLocation, type LocationProject } from '@/lib/api';

interface Props {
  city: string;
  serviceName: string;
  zipCodes: string[];
  serviceCategoryCodes: string[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function urgencyColor(timeframe: string) {
  const t = timeframe.toLowerCase();
  if (t.includes('0 to 2') || t.includes('ready')) return 'bg-green-100 text-green-700';
  if (t.includes('2 to 4') || t.includes('planning')) return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-brand-gray';
}

// Inline road/construction icon — no external deps
function ProjectIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l3-10h12l3 10" />
      <path d="M3 17h18" />
      <path d="M10 7V5m4 2V5" />
      <path d="M10 12h4" />
    </svg>
  );
}

function ProjectCard({ title, service_category, city, state, project_date, timeframe, zipcode, project_details }: LocationProject) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">

      {/* Accent strip + header */}
      <div className="flex items-stretch">
        <div className="w-1 bg-brand-action shrink-0" />
        <div className="flex items-center gap-3 px-4 py-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center shrink-0">
            <ProjectIcon />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-brand-navy text-sm leading-snug truncate">{title}</h3>
            <p className="text-xs text-brand-gray mt-0.5 truncate">{service_category}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3 flex-1">
        {/* Meta pills row */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-brand-gray bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
            <svg className="w-3 h-3 text-brand-action shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {city}, {state} · {zipcode}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-brand-gray bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
            <svg className="w-3 h-3 text-brand-action shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="16" y1="2" x2="16" y2="6" />
            </svg>
            {formatDate(project_date)}
          </span>
          <span className={`inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 font-medium ${urgencyColor(timeframe)}`}>
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" strokeLinecap="round" />
            </svg>
            {timeframe}
          </span>
        </div>

        {/* Project details */}
        {project_details && (
          <div className="bg-gray-50 rounded-lg px-3 py-2.5">
            <p className="text-[11px] font-bold text-brand-action uppercase tracking-wide mb-1">Project Details</p>
            <p className="text-xs text-brand-gray leading-relaxed line-clamp-3">{project_details}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function NearbyProjects({ city, serviceName, zipCodes, serviceCategoryCodes }: Props) {
  const projects = await fetchProjectsByLocation(serviceCategoryCodes, zipCodes);
  if (!projects.length) return null;

  return (
    <section className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
      {/* Section header */}
      <div className="bg-brand-navy px-6 py-5">
        <p className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-1">Related Projects</p>
        <h2 className="text-xl font-bold text-white leading-snug">
          Recent <span className="text-brand-gold">{serviceName}</span> Projects Near {city}
        </h2>
      </div>

      {/* Cards grid */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p, i) => (
          <ProjectCard key={i} {...p} />
        ))}
      </div>
    </section>
  );
}
