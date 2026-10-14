import { useReducer, useCallback } from "react";
import { MedicineDetailsViewModel } from "../../API/MedicineService";
import { StudentHealthRecordDetailModel } from "../../../models/StudentHealthRecordModel";

type StudentHealthRecordModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; studentHealthRecord: StudentHealthRecordDetailModel }
  | { type: 'delete'; studentHealthRecordId: string };

type Action =
  | { type: 'OPEN_CREATE' }
  | { type: 'OPEN_EDIT'; studentHealthRecord: StudentHealthRecordDetailModel }
  | { type: 'OPEN_DELETE'; studentHealthRecordId: string }
  | { type: 'CLOSE' };

// Reducer function to manage the state of medicine modals
function modalReducer(_state: StudentHealthRecordModalState, action: Action): StudentHealthRecordModalState {
  switch (action.type) {
   
    case 'OPEN_CREATE':
      return { type: 'create' };
    case 'OPEN_EDIT':
      return { type: 'edit', studentHealthRecord: action.studentHealthRecord };
    case 'OPEN_DELETE':
      return { type: 'delete', studentHealthRecordId: action.studentHealthRecordId };
    case 'CLOSE':
      return { type: 'closed' };
  }
}

export function useStudentHealthRecordModal() {
  const [state, dispatch] = useReducer(modalReducer, { type: 'closed' });

  return {
    state,
    openCreate: useCallback(() => dispatch({ type: 'OPEN_CREATE' }), []),
    openEdit: useCallback((studentHealthRecord: StudentHealthRecordDetailModel) => dispatch({ type: 'OPEN_EDIT', studentHealthRecord }), []),
    openDelete: useCallback((studentHealthRecordId: string) => dispatch({ type: 'OPEN_DELETE', studentHealthRecordId }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE' }), []),
  };
}