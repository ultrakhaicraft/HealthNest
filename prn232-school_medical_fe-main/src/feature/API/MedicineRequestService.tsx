import apiClient, { PaginatedResponse, ApiResponseWrapper, PageinationParams } from "../ApiClient";



export interface MedicineRequestQueryParams extends PageinationParams {
    requestByName?: string; //Parent Name
    forStudentName?: string; //Student Name
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    sortByLatestDate?: boolean;
   
}

export interface MedicineRequestCreateModel {
    requestBy: string;
    forStudent: string;
    description: string;
}

export interface MedicineRequestUpdateModel extends MedicineRequestCreateModel {
    status?: string;
}

export interface MedicineRequestViewModel {
    id: string;
    requestByName: string;
    forStudentName: string;
    dateSent: string;
    status: string;
}

export interface MedicineRequestDetailsModel extends MedicineRequestViewModel {
    requestBy: string;
    forStudent: string;
    description: string;
}



export const MedicineRequestService = {
    getAll: async (params: MedicineRequestQueryParams): Promise<PaginatedResponse<MedicineRequestViewModel>> => {
        const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<MedicineRequestViewModel>>>
            ('/medical-request', { params });
        return response.data.data;
    },

    getById: async (id: string): Promise<MedicineRequestDetailsModel> => {
        const response = await apiClient.get<ApiResponseWrapper<MedicineRequestDetailsModel>>
            (`/medical-request/${id}`);
        return response.data.data;
    },

    getByRequesterId: async (requesterId: string): Promise<PaginatedResponse<MedicineRequestViewModel>> => {
        const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<MedicineRequestViewModel>>>
            (`/medical-request/requester/${requesterId}`);
        return response.data.data;
    },

    create: async (data: MedicineRequestCreateModel): Promise<MedicineRequestDetailsModel> => {
        const response = await apiClient.post<ApiResponseWrapper<MedicineRequestDetailsModel>>
            ('/medical-request', data);
        return response.data.data;
    },

    delete: async (id: string): Promise<boolean> => {
        const response = await apiClient.delete<ApiResponseWrapper<boolean>>(`/medical-request/${id}`);
        return response.data.data;
    },
    
    update: async (id: string, data: MedicineRequestUpdateModel): Promise<MedicineRequestDetailsModel> => {
        const response = await apiClient.put<ApiResponseWrapper<MedicineRequestDetailsModel>>
            (`/medical-request/${id}`, data);
        return response.data.data;
    }
};