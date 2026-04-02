import ExpertsGrid from '@/components/experts/ExpertsGrid';
import LocationMap from '@/components/location/LocationMap';
import NearbyContractors from '@/components/location/NearbyContractors';
import NearbyProjects from '@/components/location/NearbyProjects';
import type { ServiceTemplateProps } from './index';

const SERVICE_NAME = 'Asphalt Paving';

export default function AsphaltTemplate({
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
    <div className="space-y-8 prose-sm max-w-none">



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


      <LocationMap city={city} regionCode={regionCode} />


      {/* Companies near location */}
      <NearbyContractors
        city={city}
        serviceName={SERVICE_NAME}
        zipCodes={zipCodes}
        serviceCategoryCodes={serviceCategoryCodes}
      />

      {/* Other projects in location */}
      <NearbyProjects
        city={city}
        serviceName={SERVICE_NAME}
        zipCodes={zipCodes}
        serviceCategoryCodes={serviceCategoryCodes}
      />



    </div>
  );
}
