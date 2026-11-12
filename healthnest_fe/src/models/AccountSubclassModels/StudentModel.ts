import { UserRole } from "../../feature/Constant";
import { AccountDetailModel, AccountCreateRequest, AccountUpdateRequest, AccountViewModel, RegisterRequest } from "../AccountModel";

// --- Student Models ---
export interface StudentDetailModel extends AccountDetailModel {
  role: UserRole.Student;
  parentId?: string;
  class?: string;
  currentHealthStatus?: string;
}

export interface CreateStudentModel extends RegisterRequest {
  parentId?: string;
  class: string;
}

export interface UpdateStudentModel extends AccountUpdateRequest {
  parentId: string;
  class: string;
  currentHealthStatus: string;
}

export interface StudentViewModel extends AccountViewModel {
  class: string;
  currentHealthStatus: string;
}