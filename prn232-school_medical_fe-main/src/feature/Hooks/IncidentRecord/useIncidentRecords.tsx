import { useState, useCallback, useEffect } from 'react';
import { IncidentRecordCreate, IncidentRecordQueryParams, IncidentRecordService, IncidentRecordUpdate, IncidentRecordView, IncidentRecordViewDetail } from '../../API/IncidentRecordService';


//Data fetching and data management hooks for MedicineCRUDPage
export function useIncidentRecords(filters: IncidentRecordQueryParams) {
  const [data, setData] = useState<IncidentRecordView[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    return IncidentRecordService.getAll(filters)
      .then((res) => {
        setData(res.data);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalCount);
      })
      .catch(() => setError('Failed to load incident records.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getById = useCallback((id: string): Promise<IncidentRecordViewDetail> => {
    return IncidentRecordService.getById(id);
  }, []);

  const create = useCallback(
    async (payload: IncidentRecordCreate) => {
      await IncidentRecordService.create(payload);
      await refetch();
    },
    [refetch]
  );

  const update = useCallback(
    async (id: string, payload: IncidentRecordUpdate) => {
      await IncidentRecordService.update(id, payload);
      await refetch();
    },
    [refetch]
  );

  const remove = useCallback(
    async (id: string) => {
      await IncidentRecordService.delete(id);
      await refetch();
    },
    [refetch]
  );

  return { data, loading, error, totalPages, totalItems, refetch, getById, create, update, remove };
}