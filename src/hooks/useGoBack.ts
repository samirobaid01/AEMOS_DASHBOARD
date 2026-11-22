import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Returns a handler that navigates back to the previous in-app page when there
 * is history to go back to, and otherwise falls back to a safe route.
 *
 * React Router stores a history index on `window.history.state.idx`; when it is
 * greater than 0 there is a prior entry within this app session, so `navigate(-1)`
 * stays inside the app. On a direct/deep link (idx 0 or missing) we go to the
 * provided fallback instead of leaving the site.
 */
export function useGoBack(fallback = '/') {
  const navigate = useNavigate();
  return useCallback(() => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }, [navigate, fallback]);
}

export default useGoBack;
