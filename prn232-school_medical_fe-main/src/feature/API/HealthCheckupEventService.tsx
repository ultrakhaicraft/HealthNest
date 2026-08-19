import apiClient, { PaginatedResponse, ApiResponseWrapper } from '../ApiClient';


export interface ViewHealthCheckupEventDTO {
    id: string;
    title: string;
    dateOccurred: string;       // ISO date string from JSON, parse with `new Date(...)` when needed
    dateSignupStart?: string | null;
    dateSignupEnd?: string | null;
    status?: string | null;
}

export interface HealthCheckUpEventQueryParams{
    pageIndex: number;
    pageSize: number;
    sortByLatestDateOccured?: boolean;
    Status?: string | null;
}

export interface HealthCheckupEventDetailDTO extends ViewHealthCheckupEventDTO{

}


export const HealthCheckupEventService = {

    //Get health checkups events for dashboard with custom query params
    getTop5HealthCheckupEvents: async (): Promise<ViewHealthCheckupEventDTO[]> => {
        const dashboardQueryParams: HealthCheckUpEventQueryParams = {
            pageIndex: 1,
            pageSize: 5,
            sortByLatestDateOccured: true,
            Status: 'Upcoming'
        }
        const response =await apiClient.get<ApiResponseWrapper<PaginatedResponse<ViewHealthCheckupEventDTO>>>('/health-checkup',
            { params: dashboardQueryParams }
        );
        return response.data.data.data;
    },

    //Get all health checkup events for dashboard with custom query params
    getAllHealthCheckupEvents: async (dashboardQueryParams: HealthCheckUpEventQueryParams): Promise<ViewHealthCheckupEventDTO[]> => {
        
        const response =await apiClient.get<ApiResponseWrapper<PaginatedResponse<ViewHealthCheckupEventDTO>>>('/health-checkup',
            { params: dashboardQueryParams }
        );
        return response.data.data.data;
    }

}