import { useEffect, useState } from 'react';
import { fetchDashboardSnapshot } from '../services/dashboard.service';
import type { DashboardSnapshot } from '../services/dashboard.service';
import { ENABLE_REALTIME_DASHBOARD } from '../config';

const EMPTY: DashboardSnapshot = { sensors: [], devices: [], available: false };

/**
 * Loads the realtime-dashboard current-value snapshot for an organization.
 *
 * No-ops (returns an empty, unavailable snapshot) when the feature flag is off or
 * no org is selected. The underlying service never throws, so there is no error
 * state to surface — an unavailable snapshot simply means callers fall back to
 * placeholders + live socket updates.
 */
export const useDashboardSnapshot = (organizationId: number | null | undefined) => {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ENABLE_REALTIME_DASHBOARD || !organizationId) {
      setSnapshot(EMPTY);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchDashboardSnapshot(organizationId)
      .then((result) => {
        if (!cancelled) setSnapshot(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  return { snapshot, loading };
};
