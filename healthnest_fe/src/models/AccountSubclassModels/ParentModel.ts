import { AccountDetailModel, AccountCreateRequest, AccountUpdateRequest } from "../AccountModel";

// --- Parent Models ---
export interface ParentDetailModel extends AccountDetailModel {
  relationshipStatus?: string;
  incomeLevel?: string;
}

export interface CreateParentModel extends AccountCreateRequest {
  relationshipStatus: string;
  incomeLevel: string;
}

export interface UpdateParentModel extends AccountUpdateRequest {
  relationshipStatus: string;
  incomeLevel: string;
}