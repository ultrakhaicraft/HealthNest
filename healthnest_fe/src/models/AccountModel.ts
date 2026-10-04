export interface AuthUser {
  id: string;
  role: string;
  fullName: string;
}

export interface GetAllAccountsParams {
  FullName?: string;
  Email?: string;
  Role?: string;
  Status?: string;
  PageNumber: number;
  PageSize: number;
}

export interface AccountView {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string | null;
}

export interface AccountDetail extends AccountView {
  phoneNumber: string;
  address: string;
  studentId: string; //String but can be null or empty depend on the response
  studentName: string;
  parentId: string;
  parentName: string;
}


export interface AccountCreationData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'Student' | 'Parent' | 'SchoolNurse' | 'Manager' | 'Admin' | '';
  address: string;
  parentId: string;
}




export interface AccountUpdateData {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'Student' | 'Parent' | 'SchoolNurse' | 'Manager' | 'Admin' | '';
  address: string;
  parentId: string;
}