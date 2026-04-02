'use client';

import { useState } from 'react';
import type { CompanyServiceArea } from '@/lib/api';

const PAGE_SIZE = 30;

export default function ServiceAreasList({ areas }: { areas: CompanyServiceArea[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {areas.slice(0, visible).map((area, i) => (
          <div key={i} className="text-xs bg-brand-light text-brand-navy px-3 py-2 rounded-lg">
            <span className="font-mono font-semibold">{area.zip_code}</span>
            <span className="text-brand-gray ml-1">{area.city}, {area.state}</span>
          </div>
        ))}
      </div>
      {visible < areas.length && (
        <button
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="mt-4 text-sm text-brand-action font-semibold hover:underline"
        >
          Load more ({areas.length - visible} remaining)
        </button>
      )}
    </div>
  );
}
