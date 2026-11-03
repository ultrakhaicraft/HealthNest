import { useState, useCallback, useEffect, useRef } from "react";
import { LinkRequestRejectModel, StudentLinkRequestDetailModel, StudentLinkRequestQuery, StudentLinkRequestViewModel } from "../../../models/StudentLinkRequestModel";
import { getLinkRequestErrorMessage, StudentLinkRequestService } from "../../API/StudentLinkRequestService";

const FOCUS_REFETCH_MIN_INTERVAL_MS = 10_000;

export function useStudentLinkRequestNurse(
    filters: StudentLinkRequestQuery,
    { refetchOnFocus = true }: { refetchOnFocus?: boolean } = {}
) {
    const [data, setData] = useState<StudentLinkRequestViewModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const latestRequestId = useRef(0);
    const lastFetchedAt = useRef(0);

    const filtersKey = JSON.stringify(filters);

    const refetch = useCallback(async () => {
        const requestId = ++latestRequestId.current;
        setLoading(true);
        setError(null);
        try {
            const res = await StudentLinkRequestService.getAll(JSON.parse(filtersKey));
            if (requestId !== latestRequestId.current) return;     // a newer request superseded this one
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
        return () => { latestRequestId.current++; };               // invalidate in-flight on change/unmount
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

    const getById = useCallback(
        (id: string): Promise<StudentLinkRequestDetailModel> => StudentLinkRequestService.getById(id),
        []
    );

    // Mutations don't catch: the page shows the toast. Refetch even on failure, because the usual
    // cause is that the request changed under the nurse (cancelled, reviewed by someone else).
    const runThenRefetch = useCallback(
        async (action: () => Promise<void>) => {
            try {
                await action();
            } finally {
                await refetch();                                    // never throws
            }
        },
        [refetch]
    );

    //Only refetch after success call, not failure call
    const approve = useCallback(
        (id: string) => runThenRefetch(() => StudentLinkRequestService.approve(id)),
        [runThenRefetch]
    );

    //Only refetch after success call, not failure call
    const reject = useCallback(
        (id: string, rejectReason: string) =>
            runThenRefetch(() => StudentLinkRequestService.reject(id, rejectReason)),
        [runThenRefetch]
    );

    return { data, loading, error, totalPages, totalItems, refetch, getById, approve, reject };
}