import { useState, useCallback, useEffect } from 'react';
import {
  MedicineService,
  MedicineQueryParams,
  MedicineViewModel,
  MedicineDetailsViewModel,
  MedicineCreateModel,
  MedicineUpdateModel,
} from '../../API/MedicineService';

//Data fetching and data management hooks for MedicineCRUDPage
export function useMedicines(filters: MedicineQueryParams) {
  const [data, setData] = useState<MedicineViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    return MedicineService.getAll(filters)
      .then((res) => {
        setData(res.data);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalCount);
      })
      .catch(() => setError('Failed to load medicines.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getById = useCallback((id: string): Promise<MedicineDetailsViewModel> => {
    return MedicineService.getById(id);
  }, []);

  const create = useCallback(
    async (payload: MedicineCreateModel) => {
      await MedicineService.create(payload);
      await refetch();
    },
    [refetch]
  );

  const update = useCallback(
    async (id: string, payload: MedicineUpdateModel) => {
      await MedicineService.update(id, payload);
      await refetch();
    },
    [refetch]
  );

  const remove = useCallback(
    async (id: string) => {
      await MedicineService.delete(id);
      await refetch();
    },
    [refetch]
  );

  return { data, loading, error, totalPages, totalItems, refetch, getById, create, update, remove };
}