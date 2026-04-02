import ExpertsGrid from '@/components/experts/ExpertsGrid';
import LocationMap from '@/components/location/LocationMap';
import NearbyContractors from '@/components/location/NearbyContractors';
import NearbyProjects from '@/components/location/NearbyProjects';
import type { ServiceTemplateProps } from './index';

const SERVICE_NAME = 'Gravel Driveway';

export default function GravelTemplate({
  city,
  region,
  regionCode,
  initialExperts,
  zipCodes,
  serviceCategoryCodes,
  ctaText,
  cacheKey,
}: ServiceTemplateProps) {
  return (
    <div className="space-y-8">


      <ExpertsGrid
        initialExperts={initialExperts}
        zipCodes={zipCodes}
        serviceCategoryCodes={serviceCategoryCodes}
        cityName={city}
        regionName={region}
        regionCode={regionCode}
        ctaText={ctaText}
        cacheKey={cacheKey}
      />

      {/* Intro */}
      <section className="card p-6">
        <h2 className=" font-bold text-brand-navy text-xl mb-3">
          Concrete Driveway Contractors in {city}, {region}
        </h2>
        <p className="text-brand-gray leading-relaxed mb-3">
          Concrete driveways are the premium, long-lasting choice for homeowners in {city} who want
          a surface that stands the test of time. Unlike asphalt, concrete doesn't need regular
          sealing, can be stamped or colored to match your home's aesthetic, and typically lasts
          30–50 years with minimal maintenance. The trade-off? It costs more upfront and requires
          an experienced contractor who knows how to properly mix, pour, and finish concrete for
          {region}'s climate conditions.
        </p>
        <p className="text-brand-gray leading-relaxed">
          Every contractor on this page serves {city} and has been vetted for licensing, insurance,
          and quality of work. Compare them side by side to find the right fit for your project.
        </p>
      </section>
      <LocationMap city={city} regionCode={regionCode} />

          {/* Companies near location */}
           <NearbyContractors
             city={city}
             serviceName={SERVICE_NAME}
             zipCodes={zipCodes}
             serviceCategoryCodes={serviceCategoryCodes}
           />

      <NearbyProjects
        city={city}
        serviceName={SERVICE_NAME}
        zipCodes={zipCodes}
        serviceCategoryCodes={serviceCategoryCodes}
      />

    </div>
  );
}
