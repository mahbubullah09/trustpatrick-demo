'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { hydrateSearch } from '@/store/slices/searchSlice';

interface Props {
  regionCode: string;
  regionName: string;
  citySlug: string;
  cityName: string;
  serviceSlug: string;
}

/**
 * Invisible component — just dispatches hydrateSearch() on mount.
 * Placed in RSC landing pages so the SearchWidget sidebar reflects
 * the current page's location & service without prop-drilling.
 */
export default function SearchHydrator(props: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateSearch(props));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.regionCode, props.citySlug, props.serviceSlug]);

  return null;
}
