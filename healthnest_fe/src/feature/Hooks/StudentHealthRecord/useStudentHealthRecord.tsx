import { useState, useCallback, useEffect } from "react";
import { StudentHealthRecordCreateModel, StudentHealthRecordDetailModel, StudentHealthRecordQuery, StudentHealthRecordUpdateModel, StudentHealthRecordViewModel } from "../../../models/StudentHealthRecordModel";
import { StudentHealthRecordService } from "../../API/StudentHealthRecordService";

export function useStudentHealthRecord(filters: StudentHealthRecordQuery) {
    const [data, setData] = useState<StudentHealthRecordViewModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [error, setError] = useState<string | null>(null);


    const refetch = useCallback(() => {
        setLoading(true);
        setError(null);
        const request = StudentHealthRecordService.getAll(filters)
        console.log("request return: ", request);


        return request
            .then((res) => {
                console.log("request used: ", res.data);

                setData(res.data);
                setTotalPages(res.totalPages);
                setTotalItems(res.totalCount);
            })
            .catch(() => setError('Failed to load student health record.'))
            .finally(() => setLoading(false));
    }, [filters]);

    useEffect(() => {
        refetch();
    }, [refetch]);



    const getById = useCallback((id: string): Promise<StudentHealthRecordDetailModel> => {
        const medicineRequest = StudentHealthRecordService.getDetailById(id);
        console.log('Fetched medicine request details:', medicineRequest);
        return medicineRequest;
    }, []);

    const create = useCallback(
        async (payload: StudentHealthRecordCreateModel) => {
            await StudentHealthRecordService.create(payload);
            await refetch();
        },
        [refetch]
    );

    const update = useCallback(
        async (id: string, payload: StudentHealthRecordUpdateModel) => {
            await StudentHealthRecordService.update(id, payload);
            await refetch();
        },
        [refetch]
    );

    const remove = useCallback(
        async (id: string) => {
            await StudentHealthRecordService.remove(id);
            await refetch();
        },
        [refetch]
    );

    return { data, loading, error, totalPages, totalItems, refetch, getById, create, update, remove };

}
