//The goal is to call CRUD operations on the user API
import { AccountQuery, AccountViewModel, AccountDetailModel, AccountCreateRequest, AccountUpdateRequest } from '../../models/AccountModel';
import { PaginatedResponse, ApiResponseWrapper } from '../../models/ApiClientModel';
import apiClient from '../ApiClient';

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
   * @returns {Promise<AccountDetailModel>} A promise that resolves to the account data.
   * No Pagination
   */
  getDetailById: async (userId: string): Promise<AccountDetailModel> => {
    const response = await apiClient.get<ApiResponseWrapper<AccountDetailModel>>(`/account/${userId}`);
    console.log("userId: ",userId);
    console.log("Detail logged: ", response.data.data);
    return response.data.data;
  },

  /* 
  Fetch all student account that contain Parent Id
  Useful to check what student belong to which parent
  */
  getStudentFromParentId: async (parentId: string, params: AccountQuery): Promise<PaginatedResponse<AccountViewModel>> => {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<AccountViewModel>>>(`/account/${parentId}/student`,
      {params: params}
    );
    return response.data.data;
  },


  /**
   * Fetches all student accounts (for dropdowns, etc.)
   * @returns {Promise<AccountViewModel[]>} A promise that resolves to the list of student accounts.
   */
  getAllStudents: async (): Promise<AccountViewModel[]> => {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<AccountViewModel>>>('/account', {
      params: {
        Role: 'Student',
        PageNumber: 1,
        PageSize: 1000,
      },
    });
    return response.data.data.data;
  },

  /**
   * Fetches all parent accounts (for dropdowns, etc.)
   * @returns {Promise<AccountViewModel[]>} A promise that resolves to the list of parent accounts.
   */
  getAllParents: async (): Promise<AccountViewModel[]> => {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedResponse<AccountViewModel>>>('/account', {
      params: {
        Role: 'Parent',
        PageNumber: 1,
        PageSize: 1000,
      },
    });
    return response.data.data.data;
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

