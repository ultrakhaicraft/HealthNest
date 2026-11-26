import { UserRole } from "../../feature/Constant";
import { AccountDetailModel, AccountCreateRequest, AccountUpdateRequest, RegisterRequest } from "../AccountModel";

// --- Nurse Models ---
export interface NurseDetailModel extends AccountDetailModel {
  role: UserRole.Nurse;
  description?: string;
}

export interface CreateNurseModel extends RegisterRequest {
  description: string;
}

export interface UpdateNurseModel extends AccountUpdateRequest {
  description: string;
}