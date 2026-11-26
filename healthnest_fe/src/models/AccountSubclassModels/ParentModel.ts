import { UserRole } from "../../feature/Constant";
import { AccountDetailModel, AccountCreateRequest, AccountUpdateRequest, RegisterRequest } from "../AccountModel";

// --- Parent Models ---
export interface ParentDetailModel extends AccountDetailModel {
  role: UserRole.Parent;
  relationshipStatus?: string;
  incomeLevel?: string;
}

export interface CreateParentModel extends RegisterRequest {
  relationshipStatus: string;
  incomeLevel: string;
}

export interface UpdateParentModel extends AccountUpdateRequest {
  relationshipStatus: string;
  incomeLevel: string;
}