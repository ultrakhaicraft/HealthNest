import apiClient, { ApiResponseWrapper, PaginatedResponse } from "../ApiClient";

export interface ViewVaccineEventDTO {
    id: string;
    title: string;
    dateOccurred: string;       // ISO date string from JSON, parse with `new Date(...)` when needed
    dateSignupStart?: string | null;
    dateSignupEnd?: string | null;
    status?: string | null;
}

export interface VaccineEventDetailDTO extends ViewVaccineEventDTO{

}

export interface VaccineEventQueryParams{
    pageIndex: number;
    pageSize: number;
    sortByLatestDateOccured?: boolean;
    Status?: string | null;
}


export const VaccineCheckupEventService = {
    //Get vaccine checkups events for dashboard with custom query params
    getTop5VaccineCheckupEvents: async (): Promise<ViewVaccineEventDTO[]> => {
        const dashboardQueryParams: VaccineEventQueryParams = {
            pageIndex: 1,
            pageSize: 5,
            sortByLatestDateOccured: true,
            Status: 'Upcoming'
        }
        const response =await apiClient.get<PaginatedResponse<ViewVaccineEventDTO>>('/vaccine-event',
            { params: dashboardQueryParams }
        );
        return response.data.data;
    },

    //Get all vaccine checkup events for dashboard with custom query params
    getAllVaccineCheckupEvents: async (dashboardQueryParams: VaccineEventQueryParams): Promise<ViewVaccineEventDTO[]> => {
        
        const response =await apiClient.get<PaginatedResponse<ViewVaccineEventDTO>>('/vaccine-event',
            { params: dashboardQueryParams }
        );
        return response.data.data;
    }
}