export interface AuthUser {
  id: string;
  role: string;
  fullName: string;
}

export interface AccountQuery {
  email?: string;
  fullName?: string;
  role?: string;
  status?: string;
  pageNumber: number;
  pageSize: number;
}


export interface AccountViewModel {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  role: string;
  status: string;
}



export interface AccountDetailModel {
  id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  address?: string;
  status?: string;
  gender?: string;
  avatarUrl?: string;
  dateOfBirth: string; // ISO date string or Date object depending on API parsing
  accountCreationDateTime: string;

  // Frontend properties (kept optional to support existing UI mappings like student/parent links)
  studentId?: string;
  studentName?: string;
  parentId?: string;
  parentName?: string;
}



export interface AccountCreateRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  address: string;
  gender: string;
  dateOfBirth: string; // or Date
}



export interface AccountUpdateRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  address: string;
  gender: string;
  avatarUrl: string;
  dateOfBirth: string; // or Date
}


