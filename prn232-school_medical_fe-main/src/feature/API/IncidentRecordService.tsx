import apiClient from '../ApiClient';

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

export interface IncidentRecordUpdate {
  studentId: string;
  handleBy: string;
  incidentType: string;
  description: string;
  dateOccurred: string;
  status: string;
}

export interface IncidentRecordQueryParams {
  IncidentType?: string;
  Status?: string;
  StudentId?: string;
  PageIndex?: number;
  PageSize?: number;
  IsDescending?: boolean;
}

export interface PaginatedResponse<T> {
  pageIndex: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  data: T[];
}

interface RawApiResponse<T> {
  statusCode: string;
  message: string;
  data: T;
}

export const IncidentRecordService = {
  getAll: async (params: IncidentRecordQueryParams = {}): Promise<IncidentRecordView[]> => {
    const response = await apiClient.get<RawApiResponse<IncidentRecordView[]>>('/incident-record', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<IncidentRecordView> => {
    const response = await apiClient.get<RawApiResponse<IncidentRecordView>>(`/incident-record/${id}`);
    return response.data.data;
  },

  create: async (data: IncidentRecordCreate): Promise<IncidentRecordView> => {
    const response = await apiClient.post<RawApiResponse<IncidentRecordView>>('/incident-record', data);
    return response.data.data;
  },

  update: async (id: string, data: IncidentRecordUpdate): Promise<IncidentRecordView> => {
    const response = await apiClient.put<RawApiResponse<IncidentRecordView>>(`/incident-record/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<RawApiResponse<boolean>>(`/incident-record/${id}`);
    return response.data.data;
  },
};