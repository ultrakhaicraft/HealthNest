import { useReducer, useCallback } from "react";
import { StudentLinkRequestDetailModel, StudentLinkRequestViewModel } from "../../../models/StudentLinkRequestModel";
import { StudentDetailModel } from "../../../models/AccountSubclassModels/StudentModel";

//Reselected student on request again
export interface PreselectedStudent {
  studentId: string;
  displayName?: string;
}

type SudentLinkRequestModalState =
  | { type: 'closed' }
  | { type: 'view'; studentLinkRequest: StudentLinkRequestDetailModel }
  | { type: 'create'; preselectedStudent?: PreselectedStudent }
  | { type: 'edit'; studentLinkRequest: StudentLinkRequestViewModel }
  | { type: 'unlink'; student: StudentDetailModel }
  | { type: 'approve'; linkRequestId: string }
  | { type: 'reject'; studentLinkRequest: StudentLinkRequestDetailModel }

type Action =
  | { type: 'OPEN_VIEW'; studentLinkRequest: StudentLinkRequestDetailModel }
  | { type: 'OPEN_CREATE'; preselectedStudent?: PreselectedStudent }
  | { type: 'OPEN_EDIT'; studentLinkRequest: StudentLinkRequestViewModel }
  | { type: 'OPEN_UNLINK'; student: StudentDetailModel }
  | { type: 'OPEN_APPROVE'; linkRequestId: string }
  | { type: 'OPEN_REJECT'; studentLinkRequest: StudentLinkRequestDetailModel }
  | { type: 'CLOSE' };

// Reducer function to manage the state of medicine modals
function modalReducer(_state: SudentLinkRequestModalState, action: Action): SudentLinkRequestModalState {
  switch (action.type) {

    case 'OPEN_CREATE':
      return { type: 'create', preselectedStudent: action.preselectedStudent };
    case 'OPEN_VIEW':
      return { type: 'view', studentLinkRequest: action.studentLinkRequest };
    case 'OPEN_EDIT':
      return { type: 'edit', studentLinkRequest: action.studentLinkRequest };
    case 'OPEN_UNLINK':
      return { type: 'unlink', student: action.student };
    case 'OPEN_APPROVE':
      return { type: 'approve', linkRequestId: action.linkRequestId };
    case 'OPEN_REJECT':
      return { type: 'reject', studentLinkRequest: action.studentLinkRequest };
    case 'CLOSE':
      return { type: 'closed' };
  }
}

export function useStudentLinkRequestModal() {
  const [state, dispatch] = useReducer(modalReducer, { type: 'closed' });

  return {
    state,
    openView: useCallback((studentLinkRequest: StudentLinkRequestDetailModel) => dispatch({ type: 'OPEN_VIEW', studentLinkRequest }), []),
    openCreate: useCallback((preselectedStudent?: PreselectedStudent) => dispatch({ type: 'OPEN_CREATE', preselectedStudent }), []),
    openEdit: useCallback((studentLinkRequest: StudentLinkRequestViewModel) => dispatch({ type: 'OPEN_EDIT', studentLinkRequest }), []),
    openDelete: useCallback((student: StudentDetailModel) => dispatch({ type: 'OPEN_UNLINK', student }), []),
    openApprove: useCallback((linkRequestId: string) => dispatch({ type: 'OPEN_APPROVE', linkRequestId }), []),
    openReject: useCallback((studentLinkRequest: StudentLinkRequestDetailModel) => dispatch({ type: 'OPEN_REJECT', studentLinkRequest }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE' }), []),
  };
}