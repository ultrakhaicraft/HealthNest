import { AccountDetailModel, AccountCreateRequest, AccountUpdateRequest } from "../AccountModel";

// --- Admin Models ---
export interface AdminDetailModel extends AccountDetailModel {
  description?: string;
}

export interface CreateAdminModel extends AccountCreateRequest {
  description: string;
}

export interface UpdateAdminModel extends AccountUpdateRequest {
  description: string;
}