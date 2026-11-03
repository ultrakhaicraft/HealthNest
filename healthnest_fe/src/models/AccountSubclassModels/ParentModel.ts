import { UserRole } from "../../feature/Constant";
import { AccountDetailModel, AccountCreateRequest, AccountUpdateRequest } from "../AccountModel";

// --- Parent Models ---
export interface ParentDetailModel extends AccountDetailModel {
  role: UserRole.Parent;
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