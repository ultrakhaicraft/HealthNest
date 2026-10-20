import { PaginatedResponse, ApiResponseWrapper } from "../../models/ApiClientModel";
import { TreatmentRecordCreateModel, TreatmentRecordQuery, TreatmentRecordUpdateModal, TreatmentRecordViewModel } from "../../models/TreatmentRecordModel";
import apiClient from "../ApiClient";

export const TreatmentRecordService = {


  getAll: async (params: TreatmentRecordQuery): Promise<PaginatedResponse<TreatmentRecordViewModel>> => {
    
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<TreatmentRecordViewModel>>>('/treatment-record', {
      params: params,
    });
    
    // The actual data we need is nested inside the `data` property
    console.log(response.data);
    return response.data.data;
  },

 
  getDetailById: async (treatmentRecordId: string): Promise<TreatmentRecordViewModel> => {
    const response = await apiClient.get<ApiResponseWrapper<TreatmentRecordViewModel>>
    (`/treatment-record/${treatmentRecordId}`);

    return response.data.data;
  },

  

  addRange: async (treatmentRecordData: TreatmentRecordCreateModel[],studentHealthRecordId: string): Promise<string> => {

    const response = await apiClient.post<ApiResponseWrapper<string>>(`/treatment-record/${studentHealthRecordId}`,treatmentRecordData);

    return response.data.data;
  },

  
  update: async (treatmentRecordId: string, updateData: TreatmentRecordUpdateModal): Promise<string> => {
    // We use PUT here, but PATCH is also common for partial updates.
    const response = await apiClient.put<ApiResponseWrapper<string>>(`/treatment-record/${treatmentRecordId}`,
     updateData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    return response.data.data;
  },
 
  remove: async (treatmentRecordId: string): Promise<string> => {
    const response = await apiClient.delete<ApiResponseWrapper<string>>(`/treatment-record/${treatmentRecordId}`);

    return response.data.data;
  },
};