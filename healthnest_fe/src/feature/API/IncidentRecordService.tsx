import { PaginatedResponse, ApiResponseWrapper } from '../../models/ApiClientModel';
import { IncidentRecordQueryParams, IncidentRecordView, IncidentRecordViewDetail, IncidentRecordCreate, IncidentRecordUpdate } from '../../models/IncidentRecordModel';
import apiClient from '../ApiClient';


export const IncidentRecordService = {
  getAll: async (params: IncidentRecordQueryParams): Promise<PaginatedResponse<IncidentRecordView>> => {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<IncidentRecordView>>>('/incident-record', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<IncidentRecordViewDetail> => {
    const response = await apiClient.get<ApiResponseWrapper<IncidentRecordViewDetail>>(`/incident-record/${id}`);
    return response.data.data;
  },

  create: async (data: IncidentRecordCreate): Promise<IncidentRecordViewDetail> => {
    const response = await apiClient.post<ApiResponseWrapper<IncidentRecordViewDetail>>('/incident-record', data);
    return response.data.data;
  },

  update: async (id: string, data: IncidentRecordUpdate): Promise<IncidentRecordViewDetail> => {
    const response = await apiClient.put<ApiResponseWrapper<IncidentRecordViewDetail>>(`/incident-record/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<string> => {
    const response = await apiClient.delete<ApiResponseWrapper<string>>(`/incident-record/${id}`);
    return response.data.data;
  },
};