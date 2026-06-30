import apiClient, { PaginatedResponse, RawApiResponse } from "../ApiClient";



export interface MedicineRequestQueryParams {
    requestBy?: string;
    forStudent?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    pageIndex?: number;
    pageSize?: number;
    sortBy?: string;
    isDescending?: boolean;
}



export interface MedicineRequestCreation {
    requestBy: string;
    forStudent: string;
    description: string;
}

export interface MedicineUpdateCreation extends MedicineRequestCreation {
    status?: string;
}

export interface MedicineRequestResponseDto {
    id: string;
    requestBy: string;
    requestByName: string;
    forStudent: string;
    forStudentName: string;
    description: string;
    dateSent: string;
    status: string;
}



export const MedicineRequestService = {
    getAll: async (params: MedicineRequestQueryParams): Promise<PaginatedResponse<MedicineRequestResponseDto>> => {
        const response = await apiClient.get<RawApiResponse<PaginatedResponse<MedicineRequestResponseDto>>>
            ('/medical-request', { params });
        return response.data.data;
    },

    getById: async (id: string): Promise<MedicineRequestResponseDto> => {
        const response = await apiClient.get<RawApiResponse<MedicineRequestResponseDto>>
            (`/medical-request/${id}`);
        return response.data.data;
    },

    getByRequesterId: async (requesterId: string): Promise<PaginatedResponse<MedicineRequestResponseDto>> => {
        const response = await apiClient.get<RawApiResponse<PaginatedResponse<MedicineRequestResponseDto>>>
            (`/medical-request/requester/${requesterId}`);
        return response.data.data;
    },

    create: async (data: MedicineRequestCreation): Promise<MedicineRequestResponseDto> => {
        const response = await apiClient.post<RawApiResponse<MedicineRequestResponseDto>>
            ('/medical-request', data);
        return response.data.data;
    },

    delete: async (id: string): Promise<boolean> => {
        const response = await apiClient.delete<RawApiResponse<boolean>>(`/medical-request/${id}`);
        return response.data.data;
    },
    
    update: async (id: string, data: MedicineUpdateCreation): Promise<MedicineRequestResponseDto> => {
        const response = await apiClient.put<RawApiResponse<MedicineRequestResponseDto>>
            (`/medical-request/${id}`, data);
        return response.data.data;
    }
};