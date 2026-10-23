import { UserRole } from "../../feature/Constant";
import { AccountDetailModel, AccountCreateRequest, AccountUpdateRequest } from "../AccountModel";

// --- Nurse Models ---
export interface NurseDetailModel extends AccountDetailModel {
  role: UserRole.Nurse;
  description?: string;
}

export interface CreateNurseModel extends AccountCreateRequest {
  description: string;
}

export interface UpdateNurseModel extends AccountUpdateRequest {
  description: string;
}