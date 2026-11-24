import { ApiResponseWrapper, PaginatedResponse } from "../../models/ApiClientModel";
import { VaccineEventDetailDTO } from "../../models/VaccineEventModel";
import { CompleteVaccinationRequest, CreateVaccineEventStudentModel, UpdateNoteRequest, VaccineEventStudentQuery, ViewVaccineEventStudentDetailModel, ViewVaccineEventStudentModel } from "../../models/VaccineEventStudentModel";
import apiClient from "../ApiClient";


const baseUrl = '/vaccine-event-participant';

export const VaccineEventStudentService = {


    SignUpStudent: async (request: CreateVaccineEventStudentModel): Promise<String> => {

        const response = await apiClient.post<ApiResponseWrapper<String>>(`${baseUrl}/signups`, request);
        return response.data.data;
    },

    CancelSignUp: async (eventId: string, studentId: string): Promise<String> => {
        const response = await apiClient.patch<ApiResponseWrapper<String>>
            (`${baseUrl}/${eventId}/signups/${studentId}/cancel`);
        return response.data.data;
    },


    GetSignUpsByParent: async (query: VaccineEventStudentQuery): Promise<PaginatedResponse<ViewVaccineEventStudentModel>> => {
        const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<ViewVaccineEventStudentModel>>>
            (`${baseUrl}/parents/me/signups`, {
                params: query
            });
        return response.data.data;
    },



    GetStudentsByEventId: async (eventId: string, query: VaccineEventStudentQuery): Promise<PaginatedResponse<ViewVaccineEventStudentModel>> => {
        const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<ViewVaccineEventStudentModel>>>(`${baseUrl}/${eventId}/students`, {
            params: query
        });
        return response.data.data;
    },

    GetSignUpsByStudentId: async (studentId: string, query: VaccineEventStudentQuery): Promise<PaginatedResponse<ViewVaccineEventStudentModel>> => {
        const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<ViewVaccineEventStudentModel>>>(`${baseUrl}/students/${studentId}/signups`, {
            params: query
        });
        return response.data.data;
    },

    ApproveStudent: async (eventId: string, studentId: string): Promise<String> => {
        const response = await apiClient.patch<ApiResponseWrapper<String>>(`${baseUrl}/${eventId}/students/${studentId}/approve`);
        return response.data.data;
    },

    RejectStudent: async (eventId: string, studentId: string): Promise<String> => {
        const response = await apiClient.patch<ApiResponseWrapper<String>>(`${baseUrl}/${eventId}/students/${studentId}/reject`);
        return response.data.data;
    },

    CompleteStudentVaccination: async (eventId: string, studentId: string, data: CompleteVaccinationRequest): Promise<String> => {
        const response = await apiClient.patch<ApiResponseWrapper<String>>
            (`${baseUrl}/${eventId}/students/${studentId}/complete`, data);
        return response.data.data;
    },

    UpdateNote: async (eventId: string, studentId: string, data: UpdateNoteRequest): Promise<String> => {
        const response = await apiClient.patch<ApiResponseWrapper<String>>
            (`${baseUrl}/${eventId}/students/${studentId}/note`, data);
        return response.data.data;
    },

     getVaccineEventStudentDetailById: async (eventId: string, studentId: string): Promise<ViewVaccineEventStudentDetailModel> => {
        const response = await apiClient.get<ApiResponseWrapper<ViewVaccineEventStudentDetailModel>>
            (`${baseUrl}/${eventId}/students/${studentId}`);
        return response.data.data;
    }
}