import { useState, useCallback, useEffect } from "react";
import { VaccineEventCreateDTO, VaccineEventDetailDTO, VaccineEventQueryParams, VaccineEventUpdateDTO, ViewVaccineEventDTO } from "../../../models/VaccineEventModel";
import { VaccineCheckupEventService } from "../../API/VaccineCheckupEventService";

export function useVaccineEvent(filters: VaccineEventQueryParams) {
  const [data, setData] = useState<ViewVaccineEventDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    return VaccineCheckupEventService.getAllVaccineCheckupEvents(filters)
      .then((res) => {
        setData(res.data);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalCount);
      })
      .catch(() => setError('Failed to load vaccine events.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getById = useCallback((id: string): Promise<VaccineEventDetailDTO> => {
    const vaccineEvent = VaccineCheckupEventService.getById(id);
    console.log('Fetched vaccine event details:', vaccineEvent);
    return vaccineEvent;
  }, []);

  const create = useCallback(
    async (payload: VaccineEventCreateDTO) => {
      await VaccineCheckupEventService.create(payload);
      await refetch();
    },
    [refetch]
  );

  const update = useCallback(
    async (id: string, payload: VaccineEventUpdateDTO) => {
      await VaccineCheckupEventService.update(id, payload);
      await refetch();
    },
    [refetch]
  );

  const remove = useCallback(
    async (id: string) => {
      await VaccineCheckupEventService.delete(id);
      await refetch();
    },
    [refetch]
  );

   const cancelEvent = useCallback(
    async (id: string) => {
      await VaccineCheckupEventService.cancel(id);
      await refetch();
    },
    [refetch]
  );

  return { data, loading, error, totalPages, totalItems, refetch, getById, create, update, remove,cancelEvent };
}