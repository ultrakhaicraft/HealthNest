import apiClient, { PaginatedResponse, ApiResponseWrapper } from '../ApiClient';

export interface Medicine {
  id: string;
  name: string;
  description: string;
  amount: number;
  isAvailable: boolean;
  createdBy: string;
  createdByName: string;
}

export interface MedicineQueryParams {
  Name?: string;
  IsAvailable?: boolean;
  PageIndex?: number;
  PageSize?: number;
  IsDescending?: boolean;
}



export const MedicineService = {
  getAll: async (params: MedicineQueryParams = {}): Promise<PaginatedResponse<Medicine>> => {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<Medicine>>>('/medicine', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Medicine> => {
    const response = await apiClient.get<ApiResponseWrapper<Medicine>>(`/medicine/${id}`);
    return response.data.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponseWrapper<boolean>>(`/medicine/${id}`);
    return response.data.data;
  },

  create: async (data: { name: string; description: string; amount: number; isAvailable: boolean }): Promise<Medicine> => {
    const response = await apiClient.post<ApiResponseWrapper<Medicine>>('/medicine', data);
    return response.data.data;
  },

  update: async (id: string, data: { name: string; description: string; amount: number; isAvailable: boolean }): Promise<Medicine> => {
    const response = await apiClient.put<ApiResponseWrapper<Medicine>>(`/medicine/${id}`, data);
    return response.data.data;
  },
}; 

