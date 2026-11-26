import { ApiResponseWrapper, PaginatedResponse } from "../../models/ApiClientModel";
import { ViewVaccineEventDTO, VaccineEventQueryParams, VaccineEventDetailDTO, VaccineEventCreateDTO, VaccineEventUpdateDTO } from "../../models/VaccineEventModel";
import apiClient from "../ApiClient";




export const VaccineCheckupEventService = {
    //Get vaccine checkups events for dashboard with custom query params
    getTop5VaccineCheckupEvents: async (): Promise<ViewVaccineEventDTO[]> => {
        const dashboardQueryParams: VaccineEventQueryParams = {
            pageIndex: 1,
            pageSize: 5,
            sortByLatestDateOccured: true,
            Status: 'Upcoming'
        }
        const response =await apiClient.get<ApiResponseWrapper<PaginatedResponse<ViewVaccineEventDTO>>>('/vaccine-event',
            { params: dashboardQueryParams }
        );
        return response.data.data.data;
    },

    //Get all vaccine checkup events for dashboard with custom query params
    getAllVaccineCheckupEvents: async (dashboardQueryParams: VaccineEventQueryParams): Promise<PaginatedResponse<ViewVaccineEventDTO>> => {
        
        const response =await apiClient.get<ApiResponseWrapper<PaginatedResponse<ViewVaccineEventDTO>>>('/vaccine-event',
            { params: dashboardQueryParams }
        );
        return response.data.data;
    },

    getById: async (id: string): Promise<VaccineEventDetailDTO> => {
        const response = await apiClient.get<ApiResponseWrapper<VaccineEventDetailDTO>>
            (`/vaccine-event/${id}`);
        return response.data.data;
    },


    create: async (data: VaccineEventCreateDTO): Promise<String> => {
        const response = await apiClient.post<ApiResponseWrapper<String>>
            ('/vaccine-event', data);
        return response.data.data;
    },

    delete: async (id: string): Promise<boolean> => {
        const response = await apiClient.delete<ApiResponseWrapper<boolean>>(`/vaccine-event/${id}`);
        return response.data.data;
    },

    cancel: async (id: string): Promise<boolean> => {
        const response = await apiClient.patch<ApiResponseWrapper<boolean>>(`/vaccine-event/cancel/${id}`);
        return response.data.data;
    },
    
    update: async (id: string, data: VaccineEventUpdateDTO): Promise<String> => {
        const response = await apiClient.put<ApiResponseWrapper<String>>
            (`/vaccine-event/${id}`, data);
        return response.data.data;
    }
}