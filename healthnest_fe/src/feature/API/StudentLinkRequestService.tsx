// --- API Service Object ---

import axios from "axios";
import { PaginatedResponse, ApiResponseWrapper } from "../../models/ApiClientModel";
import { StudentLinkRequestQuery, StudentLinkRequestDetailModel, LinkRequestCreateModel, LinkRequestRejectModel, StudentLinkRequestViewModel } from "../../models/StudentLinkRequestModel";
import apiClient from "../ApiClient";

const BASE_URL = '/student-link-request';

export const StudentLinkRequestService = {

  // Nurse queue
  getAll: async (params: StudentLinkRequestQuery = {}): Promise<PaginatedResponse<StudentLinkRequestViewModel>> => {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<StudentLinkRequestViewModel>>>(
      BASE_URL, { params });
    return response.data.data;
  },

  // Parent: own requests only (identity comes from the token)
  getMyRequests: async (params: StudentLinkRequestQuery = {}): Promise<PaginatedResponse<StudentLinkRequestViewModel>> => {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<StudentLinkRequestViewModel>>>(
      `${BASE_URL}/my-requests`, { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<StudentLinkRequestDetailModel> => {
    const response = await apiClient.get<ApiResponseWrapper<StudentLinkRequestDetailModel>>(`${BASE_URL}/${id}`);
    return response.data.data;
  },

  // Parent: submit one request per student in `studentIds`
  submit: async (data: LinkRequestCreateModel): Promise<void> => {
    await apiClient.post<ApiResponseWrapper<string>>(`${BASE_URL}/submit`, data);
  },

  // Parent: cancel own pending request
  cancel: async (id: string): Promise<void> => {
    await apiClient.patch<ApiResponseWrapper<string>>(`${BASE_URL}/cancel/${id}`);
  },

  // Nurse
  approve: async (id: string): Promise<void> => {
    await apiClient.patch<ApiResponseWrapper<string>>(`${BASE_URL}/approve/${id}`);
  },

  // Nurse
  reject: async (id: string, data: LinkRequestRejectModel): Promise<void> => {
    await apiClient.patch<ApiResponseWrapper<string>>(`${BASE_URL}/reject/${id}`, data);
  },

  // Parent: remove the link to one of their own children
  unlink: async (studentId: string): Promise<void> => {
    await apiClient.delete<ApiResponseWrapper<string>>(`${BASE_URL}/unlink/${studentId}`);
  },

 
};

// One place to turn failures into UI text. The rate limiter's 429 is a plain response
// with no ApiResponseWrapper body, so it has to be handled by status code.
export const getLinkRequestErrorMessage = (
  err: unknown,
  fallback = 'Something went wrong. Please try again.'
): string => {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 429) {
      return 'Too many attempts. Please wait a few minutes and try again.';
    }
    return err.response?.data?.message ?? fallback;
  }
  return fallback;
};