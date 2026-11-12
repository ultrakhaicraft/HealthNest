import { UserRole } from "../../feature/Constant";
import { AccountDetailModel, AccountCreateRequest, AccountUpdateRequest, RegisterRequest } from "../AccountModel";

// --- Admin Models ---
export interface AdminDetailModel extends AccountDetailModel {
  role: UserRole.Admin;
  description?: string;
}

export interface CreateAdminModel extends RegisterRequest {
  description: string;
}

export interface UpdateAdminModel extends AccountUpdateRequest {
  description: string;
}