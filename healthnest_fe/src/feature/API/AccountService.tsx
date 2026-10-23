//The goal is to call CRUD operations on the user API
import { AccountQuery, AccountViewModel, AccountDetailModel, AccountCreateRequest, AccountUpdateRequest } from '../../models/AccountModel';
import { AdminDetailModel } from '../../models/AccountSubclassModels/AdminModel';
import { NurseDetailModel } from '../../models/AccountSubclassModels/NurseModel';
import { ParentDetailModel } from '../../models/AccountSubclassModels/ParentModel';
import { StudentDetailModel } from '../../models/AccountSubclassModels/StudentModel';
import { PaginatedResponse, ApiResponseWrapper } from '../../models/ApiClientModel';
import apiClient from '../ApiClient';


export type AccountDetailBaseModel =
  | ParentDetailModel
  | StudentDetailModel
  | NurseDetailModel
  | AdminDetailModel;

// --- API Service Object ---
export const accountService = {
  /**
   * Fetches a paginated and filtered list of accounts. Can also be used to search for students.
   * @param {AccountQuery} params - The filtering and pagination options.
   * @returns {Promise<PaginatedResponse<AccountViewModel>>} A promise that resolves to the paginated data.
   */

  getAll: async (params: AccountQuery): Promise<PaginatedResponse<AccountViewModel>> => {

    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<AccountViewModel>>>('/account', {
      params: params,
    });

    // The actual data we need is nested inside the `data` property
    return response.data.data;
  },

  /**
   * Fetches a single account detail by its ID.
   * @param {string} id - The ID of the account to fetch.
   * @returns {Promise<AccountDetailBaseModel>} A promise that resolves to the account data.
   * No Pagination
   */
  getDetailById: async (userId: string): Promise<AccountDetailBaseModel> => {
    const response = await apiClient.get<ApiResponseWrapper<AccountDetailBaseModel>>(`/account/${userId}`);
    console.log("userId: ",userId);
    console.log("Detail logged: ", response.data.data);
    return response.data.data;
  },

  /* 
  Fetch all student account that contain Parent Id
  Useful to check what student belong to which parent
  */
  getStudentFromParentId: async (parentId: string): Promise<StudentDetailModel[]> => {
    const response = await apiClient.get<ApiResponseWrapper<StudentDetailModel[]>>(`/account/${parentId}/student`);
    return response.data.data;
  },


  /**
   * Creates a new account.
   * @param {AccountCreateRequest} accountData - The data for the new account.
   * @returns {Promise<string>} A promise that resolves to the newly created account data.
   */
  create: async (accountData: AccountCreateRequest): Promise<string> => {
    const response = await apiClient.post<ApiResponseWrapper<string>>('/account', accountData);
    return response.data.data;
  },

  /**
   * Updates an existing account.
   * @param {string} id - The ID of the account to update.
   * @param {AccountUpdateRequest} updateData - The fields to update.
   * @returns {Promise<string>} A promise that resolves to the updated account data.
   */
  update: async (id: string, updateData: AccountUpdateRequest): Promise<string> => {
    const response = await apiClient.put<ApiResponseWrapper<string>>(`/account/${id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  },

  /**
   * Deletes an account by its ID.
   * @param {string} userId - The ID of the account to delete.
   * @returns {Promise<string>} A promise that resolves when the deletion is successful.
   */
  remove: async (userId: string): Promise<string> => {
    const response = await apiClient.delete<ApiResponseWrapper<string>>('/account', {
      params: { userId },
    });

    return response.data.data;
  },

  link: async (parentId: string, studentId: string): Promise<string> => {
    console.log(`Calling API`);
    const response = await apiClient.patch<ApiResponseWrapper<string>>(
      `/account/assign-student?studentId=${studentId}&parentId=${parentId}`
    );
    return response.data.data;
  }
};

