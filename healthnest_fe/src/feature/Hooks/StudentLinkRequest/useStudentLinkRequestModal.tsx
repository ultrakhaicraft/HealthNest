import { useReducer, useCallback } from "react";
import { StudentLinkRequestViewModel } from "../../../models/StudentLinkRequestModel";
import { StudentDetailModel } from "../../../models/AccountSubclassModels/StudentModel";

//Reselected student on request again
export interface PreselectedStudent {
  studentId: string;
  displayName?: string;
}

type SudentLinkRequestModalState =
  | { type: 'closed' }
  | { type: 'view'; studentLinkRequest: StudentLinkRequestViewModel }

  | { type: 'create'; preselectedStudent?: PreselectedStudent }
  | { type: 'edit'; studentLinkRequest: StudentLinkRequestViewModel }
  | { type: 'unlink'; student: StudentDetailModel };

type Action =
  | { type: 'OPEN_VIEW'; studentLinkRequest: StudentLinkRequestViewModel }
  | { type: 'OPEN_CREATE'; preselectedStudent?: PreselectedStudent }
  | { type: 'OPEN_EDIT'; studentLinkRequest: StudentLinkRequestViewModel }
  | { type: 'OPEN_UNLINK'; student: StudentDetailModel }
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
    case 'CLOSE':
      return { type: 'closed' };
  }
}

export function useStudentLinkRequestModal() {
  const [state, dispatch] = useReducer(modalReducer, { type: 'closed' });

  return {
    state,
    openView: useCallback((studentLinkRequest: StudentLinkRequestViewModel) => dispatch({ type: 'OPEN_VIEW', studentLinkRequest }), []),
    openCreate: useCallback((preselectedStudent?: PreselectedStudent) => dispatch({ type: 'OPEN_CREATE', preselectedStudent }), []),
    openEdit: useCallback((studentLinkRequest: StudentLinkRequestViewModel) => dispatch({ type: 'OPEN_EDIT', studentLinkRequest }), []),
    openDelete: useCallback((student: StudentDetailModel) => dispatch({ type: 'OPEN_UNLINK', student }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE' }), []),
  };
}