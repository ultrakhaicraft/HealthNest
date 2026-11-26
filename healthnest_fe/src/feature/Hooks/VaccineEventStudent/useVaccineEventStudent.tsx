import { useCallback, useEffect, useState } from "react";
import { CompleteVaccinationRequest, CreateVaccineEventStudentModel, UpdateNoteRequest, VaccineEventStudentQuery, ViewVaccineEventStudentDetailModel, ViewVaccineEventStudentModel } from "../../../models/VaccineEventStudentModel";
import { VaccineEventStudentService } from "../../API/VaccineEventStudentService";

export function useVaccineEventStudent(
    filters: VaccineEventStudentQuery, mode: 'parent' | 'student' | 'event', studentId?: string, eventId?: string) {
    const [data, setData] = useState<ViewVaccineEventStudentModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(() => {
        setLoading(true);
        setError(null);
        switch (mode) {
            case 'parent':
                return VaccineEventStudentService.GetSignUpsByParent(filters) //Backend will get the parentId from the token, so no need to pass it here
                    .then((res) => {
                        setData(res.data);
                        setTotalPages(res.totalPages);
                        setTotalItems(res.totalCount);
                    })
                    .catch(() => setError('Failed to load vaccine events.'))
                    .finally(() => setLoading(false));
            case 'student':
                return VaccineEventStudentService.GetSignUpsByStudentId(studentId ?? "", filters)
                    .then((res) => {
                        setData(res.data);
                        setTotalPages(res.totalPages);
                        setTotalItems(res.totalCount);
                    })
                    .catch(() => setError('Failed to load vaccine events.'))
                    .finally(() => setLoading(false));
            case 'event':
                return VaccineEventStudentService.GetStudentsByEventId(eventId ?? "", filters)
                    .then((res) => {
                        setData(res.data);
                        setTotalPages(res.totalPages);
                        setTotalItems(res.totalCount);
                    })
                    .catch(() => setError('Failed to load vaccine events.'))
                    .finally(() => setLoading(false));
        }
    }, [filters, mode, studentId, eventId]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const getById = useCallback((eventId: string, studentId: string): Promise<ViewVaccineEventStudentDetailModel> => {
        const vaccineEvent = VaccineEventStudentService.getVaccineEventStudentDetailById(eventId, studentId);
        console.log('Fetched vaccine event details:', vaccineEvent);
        return vaccineEvent;
    }, []);

    const signUpStudentToEvent = useCallback(
        async (payload: CreateVaccineEventStudentModel, IsSignUpAgain: boolean) => {
            await VaccineEventStudentService.SignUpStudent(payload,IsSignUpAgain);
            await refetch();
        },
        [refetch]
    );

    const rejectStudentFromEvent = useCallback(
        async (eventId: string, studentId: string) => {
            await VaccineEventStudentService.RejectStudent(eventId, studentId);
            await refetch();
        },
        [refetch]
    );

    const approveStudentForEvent = useCallback(
        async (eventId: string, studentId: string) => {
            await VaccineEventStudentService.ApproveStudent(eventId, studentId);
            await refetch();
        },
        [refetch]
    );

    const cancelSignup = useCallback(
        async (eventId: string, studentId: string) => {
            await VaccineEventStudentService.CancelSignUp(eventId, studentId);
            await refetch();
        },
        [refetch]
    );

    const CompleteStudentVaccineEvent = useCallback(
        async (eventId: string, studentId: string, payload: CompleteVaccinationRequest) => {
            await VaccineEventStudentService.CompleteStudentVaccination(eventId, studentId, payload);
            await refetch();
        },
        [refetch]
    );

    const UpdateNote = useCallback(
        async (eventId: string, studentId: string, payload: UpdateNoteRequest) => {
            await VaccineEventStudentService.UpdateNote(eventId, studentId, payload);
            await refetch();
        },
        [refetch]
    );



    return { data, loading, error, totalPages, totalItems, refetch, getById, signUpStudentToEvent, rejectStudentFromEvent, approveStudentForEvent, cancelSignup, CompleteStudentVaccineEvent, UpdateNote };
}