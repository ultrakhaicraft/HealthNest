import apiClient, { ApiResponseWrapper, PageinationParams, PaginatedResponse } from '../ApiClient';

export interface IncidentRecordView {
  id: string;
  studentId: string;
  studentName?: string;
  handleBy: string;
  handleByName?: string;
  incidentType: string;
  description: string;
  dateOccurred: string;
  status: string;
}

export interface IncidentRecordCreate {
  studentId: string;
  handleBy: string;
  incidentType: string;
  description: string;
  dateOccurred: string;
  status: string;
}

export interface IncidentRecordUpdate extends IncidentRecordCreate {
}

export interface IncidentRecordQueryParams extends PageinationParams {
  Status?: string;
  StudentId?: string;
  DateFrom?: string;
  DateTo?: string;
  SortByLatest?: boolean;
}



export const IncidentRecordService = {
  getAll: async (params: IncidentRecordQueryParams): Promise<PaginatedResponse<IncidentRecordView>> => {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<IncidentRecordView>>>('/incident-record', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<IncidentRecordView> => {
    const response = await apiClient.get<ApiResponseWrapper<IncidentRecordView>>(`/incident-record/${id}`);
    return response.data.data;
  },

  create: async (data: IncidentRecordCreate): Promise<IncidentRecordView> => {
    const response = await apiClient.post<ApiResponseWrapper<IncidentRecordView>>('/incident-record', data);
    return response.data.data;
  },

  update: async (id: string, data: IncidentRecordUpdate): Promise<IncidentRecordView> => {
    const response = await apiClient.put<ApiResponseWrapper<IncidentRecordView>>(`/incident-record/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponseWrapper<boolean>>(`/incident-record/${id}`);
    return response.data.data;
  },
};