import { useState, useCallback, useEffect } from "react";
import { MedicalSupplyCreateModel, MedicalSupplyDetailsViewModel, MedicalSupplyQuery, MedicalSupplyService, MedicalSupplyUpdateModel, MedicalSupplyViewModel } from "../../API/MedicalSupplyService";

//Data fetching and data management hooks for MedicalSupplyCRUDPage
export function useMedicalSupplies(filters: MedicalSupplyQuery) {
  const [data, setData] = useState<MedicalSupplyViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    return MedicalSupplyService.getAll(filters)
      .then((res) => {
        setData(res.data);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalCount);
      })
      .catch(() => setError('Failed to load medical supplies.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getById = useCallback((id: string): Promise<MedicalSupplyDetailsViewModel> => {
    const medicalSupply = MedicalSupplyService.getById(id);
    console.log('Fetched medical supply details:', medicalSupply);
    return medicalSupply;
  }, []);

  const create = useCallback(
    async (payload: MedicalSupplyCreateModel) => {
      await MedicalSupplyService.create(payload);
      await refetch();
    },
    [refetch]
  );

  const update = useCallback(
    async (id: string, payload: MedicalSupplyUpdateModel) => {
      await MedicalSupplyService.update(id, payload);
      await refetch();
    },
    [refetch]
  );

  const remove = useCallback(
    async (id: string) => {
      await MedicalSupplyService.delete(id);
      await refetch();
    },
    [refetch]
  );

  return { data, loading, error, totalPages, totalItems, refetch, getById, create, update, remove };
}