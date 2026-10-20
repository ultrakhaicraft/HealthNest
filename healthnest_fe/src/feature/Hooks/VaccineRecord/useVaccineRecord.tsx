import { useState, useCallback, useEffect } from "react";
import { VaccineRecordQuery, VaccineRecordViewModel, VaccineRecordCreateModel, VaccineRecordUpdateModal } from "../../../models/VaccineRecordModel";
import { VaccineRecordService } from "../../API/VaccineRecordService";

export function useVaccineRecord(filters: VaccineRecordQuery) {
    const [data, setData] = useState<VaccineRecordViewModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [error, setError] = useState<string | null>(null);


    const refetch = useCallback(() => {
        setLoading(true);
        setError(null);
        console.log(filters);
        const request = VaccineRecordService.getAll(filters)


        return request
            .then((res) => {
                console.log("request used: ", res.data);

                setData(res.data);
                setTotalPages(res.totalPages);
                setTotalItems(res.totalCount);
            })
            .catch(() => setError('Failed to load vaccine record.'))
            .finally(() => setLoading(false));
    }, [filters]);

    useEffect(() => {
        refetch();
    }, [refetch]);



    const getById = useCallback((id: string): Promise<VaccineRecordViewModel> => {
        const VaccineRecord = VaccineRecordService.getDetailById(id);
        console.log('Fetched vaccine Record details:', VaccineRecord);
        return VaccineRecord;
    }, []);

    const addRange = useCallback(
        async (payload: VaccineRecordCreateModel[], studentHealthRecordId: string) => {
            await VaccineRecordService.addRange(payload,studentHealthRecordId);
            await refetch();
        },
        [refetch]
    );

    const update = useCallback(
        async (id: string, payload: VaccineRecordUpdateModal) => {
            await VaccineRecordService.update(id, payload);
            await refetch();
        },
        [refetch]
    );

    const remove = useCallback(
        async (id: string) => {
            await VaccineRecordService.remove(id);
            await refetch();
        },
        [refetch]
    );

    return { data, loading, error, totalPages, totalItems, refetch, getById, addRange, update, remove };

}