import { PaginatedResponse, ApiResponseWrapper } from "../../models/ApiClientModel";
import { VaccineRecordCreateModel, VaccineRecordQuery, VaccineRecordUpdateModal, VaccineRecordViewModel } from "../../models/VaccineRecordModel";
import apiClient from "../ApiClient";

export const VaccineRecordService = {


  getAll: async (params: VaccineRecordQuery): Promise<PaginatedResponse<VaccineRecordViewModel>> => {
    
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<VaccineRecordViewModel>>>('/vaccine-record', {
      params: params,
    });
    
    // The actual data we need is nested inside the `data` property
    return response.data.data;
  },

 
  getDetailById: async (vaccineRecordId: string): Promise<VaccineRecordViewModel> => {
    const response = await apiClient.get<ApiResponseWrapper<VaccineRecordViewModel>>
    (`/vaccine-record/${vaccineRecordId}`);

    return response.data.data;
  },

  

  addRange: async (vaccineData: VaccineRecordCreateModel[],studentHealthRecordId: string): Promise<string> => {

    const response = await apiClient.post<ApiResponseWrapper<string>>(`/vaccine-record/${studentHealthRecordId}`,vaccineData);

    return response.data.data;
  },

  
  update: async (vaccineId: string, updateData: VaccineRecordUpdateModal): Promise<string> => {
    // We use PUT here, but PATCH is also common for partial updates.
    const response = await apiClient.put<ApiResponseWrapper<string>>(`/vaccine-record/${vaccineId}`,
     updateData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    return response.data.data;
  },
 
  remove: async (vaccineId: string): Promise<string> => {
    const response = await apiClient.delete<ApiResponseWrapper<string>>(`/vaccine-record/${vaccineId}`);

    return response.data.data;
  },
};