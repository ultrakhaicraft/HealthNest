import { useState, useCallback, useEffect, useRef } from 'react';
import { StudentLinkRequestQuery, StudentLinkRequestViewModel, LinkRequestCreateModel } from '../../../models/StudentLinkRequestModel';
import { StudentLinkRequestService, getLinkRequestErrorMessage } from '../../API/StudentLinkRequestService';


const FOCUS_REFETCH_MIN_INTERVAL_MS = 10_000;

interface UseMyLinkRequestsOptions {
  /** Refetch when the tab becomes visible again (a nurse may have reviewed while the parent was away) */
  refetchOnFocus?: boolean;
}

// Data fetching and mutations for the parent's own link requests
export function useMyLinkRequests(
  filters: StudentLinkRequestQuery = {},
  { refetchOnFocus = true }: UseMyLinkRequestsOptions = {}
) {
  const [data, setData] = useState<StudentLinkRequestViewModel[]>([]);
  const [loading, setLoading] = useState(true);          // starts true: the first fetch begins on mount
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const latestRequestId = useRef(0);
  const lastFetchedAt = useRef(0);

  // Depend on the serialized filters, not the object itself. A caller passing an inline
  // `{ ... }` creates a new object every render, which would refetch in an endless loop.
  const filtersKey = JSON.stringify(filters);

  const refetch = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(null);
    try {
      const res = await StudentLinkRequestService.getMyRequests(JSON.parse(filtersKey));
      if (requestId !== latestRequestId.current) return;   // a newer request superseded this one
      setData(res.data);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalCount);
      lastFetchedAt.current = Date.now();
    } catch (err) {
      if (requestId !== latestRequestId.current) return;
      setError(getLinkRequestErrorMessage(err, 'Failed to load link requests.'));
    } finally {
      if (requestId === latestRequestId.current) setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    refetch();
    // Invalidate anything still in flight when filters change or the component unmounts
    return () => { latestRequestId.current++; };
  }, [refetch]);

  useEffect(() => {
    if (!refetchOnFocus) return;
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastFetchedAt.current < FOCUS_REFETCH_MIN_INTERVAL_MS) return;
      refetch();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refetch, refetchOnFocus]);

  // Mutations don't catch: the page decides how to show failures
  // (try/catch + toast with getLinkRequestErrorMessage).
  const submit = useCallback(
    async (payload: LinkRequestCreateModel) => {
      await StudentLinkRequestService.submit(payload);
      await refetch();
    },
    [refetch]
  );

  const cancel = useCallback(
    async (id: string) => {
      try {
        await StudentLinkRequestService.cancel(id);
      } finally {
        // Refetch even on failure: the usual reason is "a nurse just reviewed it",
        // so the list on screen is stale and should show the real status.
        await refetch();
      }
    },
    [refetch]
  );

  return { data, loading, error, totalPages, totalItems, refetch, submit, cancel };
}