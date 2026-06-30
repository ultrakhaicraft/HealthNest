import apiClient, { PaginatedResponse, RawApiResponse } from '../ApiClient';

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
    const response = await apiClient.get<RawApiResponse<PaginatedResponse<Medicine>>>('/medicine', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Medicine> => {
    const response = await apiClient.get<RawApiResponse<Medicine>>(`/medicine/${id}`);
    return response.data.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<RawApiResponse<boolean>>(`/medicine/${id}`);
    return response.data.data;
  },

  create: async (data: { name: string; description: string; amount: number; isAvailable: boolean }): Promise<Medicine> => {
    const response = await apiClient.post<RawApiResponse<Medicine>>('/medicine', data);
    return response.data.data;
  },

  update: async (id: string, data: { name: string; description: string; amount: number; isAvailable: boolean }): Promise<Medicine> => {
    const response = await apiClient.put<RawApiResponse<Medicine>>(`/medicine/${id}`, data);
    return response.data.data;
  },
}; 

