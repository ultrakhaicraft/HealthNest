import { useState, useCallback, useEffect } from "react";
import { MedicineRequestCreateModel, MedicineRequestDetailsModel, MedicineRequestQueryParams, MedicineRequestService, MedicineRequestUpdateModel, MedicineRequestViewModel } from "../../API/MedicineRequestService";

//Data fetching and data management hooks for MedicalSupplyCRUDPage
//RequesterId is optional for nurse, but mandatory for parent
export function useMedicineRequests(filters: MedicineRequestQueryParams, requesterId: string) {
  const [data, setData] = useState<MedicineRequestViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    return MedicineRequestService.getAll(filters)
      .then((res) => {
        setData(res.data);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalCount);
      })
      .catch(() => setError('Failed to load medicine requests.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  //Fetch medicine request owned by specific parent
  const refetchByParent = useCallback(() => {
    setLoading(true);
    setError(null);
    return MedicineRequestService.getAllByRequesterId(requesterId,filters)
      .then((res) => {
        setData(res.data);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalCount);
      })
      .catch(() => setError('Failed to load medicine requests.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    refetchByParent();
  }, [refetchByParent]);

  const getById = useCallback((id: string): Promise<MedicineRequestDetailsModel> => {
    const medicineRequest = MedicineRequestService.getById(id);
    console.log('Fetched medicine request details:', medicineRequest);
    return medicineRequest;
  }, []);

  const create = useCallback(
    async (payload: MedicineRequestCreateModel) => {
      await MedicineRequestService.create(payload);
      await refetch();
    },
    [refetch]
  );

  const update = useCallback(
    async (id: string, payload: MedicineRequestUpdateModel) => {
      await MedicineRequestService.update(id, payload);
      await refetch();
    },
    [refetch]
  );

  const remove = useCallback(
    async (id: string) => {
      await MedicineRequestService.delete(id);
      await refetch();
    },
    [refetch]
  );

  return { data, loading, error, totalPages, totalItems, refetch, getById, create, update, remove };
}