import apiClient, { PaginatedResponse, ApiResponseWrapper, PageinationParams } from '../ApiClient';

export interface MedicalSupplyViewModel {
  id: string;
  name: string;
  amount: number;
  isAvailable: boolean;
  createdByName: string;
}

export interface MedicalSupplyDetailsViewModel extends MedicalSupplyViewModel {
  description: string;
  createdBy: string; //Id of nurse who created the medicine record
  isDeleted: boolean;
}

export interface MedicalSupplyCreateModel {
  name: string;
  amount: number;
  createdBy: string;
  description: string;
}

export interface MedicalSupplyUpdateModel extends MedicalSupplyCreateModel {
  isAvailable: boolean;
}

export interface MedicalSupplyQuery extends PageinationParams {
  Name?: string;
  IsAvailable?: boolean;
  SortByNameByDescending?: boolean;
}



export const MedicalSupplyService = {
  getAll: async (params: MedicalSupplyQuery = {}): Promise<PaginatedResponse<MedicalSupplyViewModel>> => {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<MedicalSupplyViewModel>>>('/medical-supply', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<MedicalSupplyDetailsViewModel> => {
    const response = await apiClient.get<ApiResponseWrapper<MedicalSupplyDetailsViewModel>>(`/medical-supply/${id}`);
    return response.data.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponseWrapper<boolean>>(`/medical-supply/${id}`);
    return response.data.data;
  },

  create: async (data: MedicalSupplyCreateModel): Promise<MedicalSupplyDetailsViewModel> => {
    const response = await apiClient.post<ApiResponseWrapper<MedicalSupplyDetailsViewModel>>('/medical-supply', data);
    return response.data.data;
  },

  update: async (id: string, data: MedicalSupplyUpdateModel): Promise<MedicalSupplyDetailsViewModel> => {
    const response = await apiClient.put<ApiResponseWrapper<MedicalSupplyDetailsViewModel>>(`/medical-supply/${id}`, data);
    return response.data.data;
  },
}; 

