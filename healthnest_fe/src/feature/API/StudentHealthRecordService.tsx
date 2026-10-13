






// --- API Service Object ---

import { PaginatedResponse, ApiResponseWrapper } from "../../models/ApiClientModel";
import { StudentHealthRecordQuery, StudentHealthRecordViewModel, StudentHealthRecordDetailModel, StudentHealthRecordCreateModel, StudentHealthRecordUpdateModel } from "../../models/StudentHealthRecordModel";
import apiClient from "../ApiClient";


export const StudentHealthRecordService = {


  getAll: async (params: StudentHealthRecordQuery): Promise<PaginatedResponse<StudentHealthRecordViewModel>> => {
    
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<StudentHealthRecordViewModel>>>('/student-health-record', {
      params: params,
    });
    
    // The actual data we need is nested inside the `data` property
    return response.data.data;
  },

 
  getDetailById: async (studentHealthRecordId: string): Promise<StudentHealthRecordDetailModel> => {
    const response = await apiClient.get<ApiResponseWrapper<StudentHealthRecordDetailModel>>
    (`/student-health-record/${studentHealthRecordId}`);

    return response.data.data;
  },

  

  create: async (accountData: StudentHealthRecordCreateModel): Promise<string> => {

    const response = await apiClient.post<ApiResponseWrapper<string>>('/student-health-record',accountData);

    return response.data.data;
  },

  
  update: async (studentHealthRecordId: string, updateData: StudentHealthRecordUpdateModel): Promise<string> => {
    // We use PUT here, but PATCH is also common for partial updates.
    const response = await apiClient.put<ApiResponseWrapper<string>>(`/student-health-record/${studentHealthRecordId}`,
     updateData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    return response.data.data;
  },

  updateStatus: async (studentHealthRecordId: string, newStatus: string): Promise<string> => {
    const response = await apiClient.patch<ApiResponseWrapper<string>>(`/student-health-record/${studentHealthRecordId}/status`,
      { status: newStatus }
    );
    return response.data.data;
  },

 
  remove: async (studentHealthRecordId: string): Promise<string> => {
    const response = await apiClient.delete<ApiResponseWrapper<string>>('/student-health-record',{
      params: { studentHealthRecordId },
    });

    return response.data.data;
  },
};