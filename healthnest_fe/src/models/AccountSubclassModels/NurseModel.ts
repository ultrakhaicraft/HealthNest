import { AccountDetailModel, AccountCreateRequest, AccountUpdateRequest } from "../AccountModel";

// --- Nurse Models ---
export interface NurseDetailModel extends AccountDetailModel {
  description?: string;
}

export interface CreateNurseModel extends AccountCreateRequest {
  description: string;
}

export interface UpdateNurseModel extends AccountUpdateRequest {
  description: string;
}