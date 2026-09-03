import apiClient, { PaginatedResponse, ApiResponseWrapper, PageinationParams } from '../ApiClient';

export interface MedicineViewModel {
  id: string;
  name: string;
  amount: number;
  isAvailable: boolean;
  createdByName: string;
}

export interface MedicineDetailsViewModel extends MedicineViewModel {
  description: string;
  createdBy: string; //Id of nurse who created the medicine record
  isDeleted: boolean;
}

export interface MedicineCreateModel {
  name: string;
  amount: number;
  createdBy: string;
  description: string;
}

export interface MedicineUpdateModel extends MedicineCreateModel {
  isAvailable: boolean;
}

export interface MedicineQueryParams extends PageinationParams {
  Id?: string;
  Name?: string;
  IsAvailable?: boolean;
  SortNameByDescending?: boolean;
}



export const MedicineService = {
  getAll: async (params: MedicineQueryParams = {}): Promise<PaginatedResponse<MedicineViewModel>> => {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<MedicineViewModel>>>('/medicine', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<MedicineDetailsViewModel> => {
    const response = await apiClient.get<ApiResponseWrapper<MedicineDetailsViewModel>>(`/medicine/${id}`);
    return response.data.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponseWrapper<boolean>>(`/medicine/${id}`);
    return response.data.data;
  },

  create: async (data: MedicineCreateModel): Promise<MedicineDetailsViewModel> => {
    const response = await apiClient.post<ApiResponseWrapper<MedicineDetailsViewModel>>('/medicine', data);
    return response.data.data;
  },

  update: async (id: string, data: MedicineUpdateModel): Promise<MedicineDetailsViewModel> => {
    const response = await apiClient.put<ApiResponseWrapper<MedicineDetailsViewModel>>(`/medicine/${id}`, data);
    return response.data.data;
  },
}; 

