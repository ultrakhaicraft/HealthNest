import { useState, useCallback, useEffect } from "react";
import { TreatmentRecordCreateModel, TreatmentRecordQuery, TreatmentRecordUpdateModal, TreatmentRecordViewModel } from "../../../models/TreatmentRecordModel";
import { TreatmentRecordService } from "../../API/TreatmentRecordService";

export function useTreatmentRecord(filters: TreatmentRecordQuery) {
    const [data, setData] = useState<TreatmentRecordViewModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [error, setError] = useState<string | null>(null);


    const refetch = useCallback(() => {
        setLoading(true);
        setError(null);
        console.log(filters);
        const request = TreatmentRecordService.getAll(filters)


        return request
            .then((res) => {
                console.log("request used: ", res.data);

                setData(res.data);
                setTotalPages(res.totalPages);
                setTotalItems(res.totalCount);
            })
            .catch(() => setError('Failed to load treatment record.'))
            .finally(() => setLoading(false));
    }, [filters]);

    useEffect(() => {
        refetch();
    }, [refetch]);



    const getById = useCallback((id: string): Promise<TreatmentRecordViewModel> => {
        const treatmentRecord = TreatmentRecordService.getDetailById(id);
        console.log('Fetched Treatment Record details:', treatmentRecord);
        return treatmentRecord;
    }, []);

    const addRange = useCallback(
        async (payload: TreatmentRecordCreateModel[], studentHealthRecordId: string) => {
            await TreatmentRecordService.addRange(payload,studentHealthRecordId);
            await refetch();
        },
        [refetch]
    );

    const update = useCallback(
        async (id: string, payload: TreatmentRecordUpdateModal) => {
            await TreatmentRecordService.update(id, payload);
            await refetch();
        },
        [refetch]
    );

    const remove = useCallback(
        async (id: string) => {
            await TreatmentRecordService.remove(id);
            await refetch();
        },
        [refetch]
    );

    return { data, loading, error, totalPages, totalItems, refetch, getById, addRange, update, remove };

}