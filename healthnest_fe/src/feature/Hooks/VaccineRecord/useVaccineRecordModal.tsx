import { useReducer, useCallback } from "react";
import { VaccineRecordViewModel } from "../../../models/VaccineRecordModel";

type VaccineRecordModalState =
  | { type: 'closed' }
  | { type: 'view'; vaccineRecord: VaccineRecordViewModel }

  | { type: 'create' }
  | { type: 'edit'; vaccineRecord: VaccineRecordViewModel }
  | { type: 'delete'; vaccineRecordId: string };

type Action =
  | { type: 'OPEN_VIEW'; vaccineRecord: VaccineRecordViewModel }
  | { type: 'OPEN_CREATE' }
  | { type: 'OPEN_EDIT'; vaccineRecord: VaccineRecordViewModel }
  | { type: 'OPEN_DELETE'; vaccineRecordId: string }
  | { type: 'CLOSE' };

// Reducer function to manage the state of medicine modals
function modalReducer(_state: VaccineRecordModalState, action: Action): VaccineRecordModalState {
  switch (action.type) {

    case 'OPEN_CREATE':
      return { type: 'create' };
    case 'OPEN_VIEW':
      return { type: 'view', vaccineRecord: action.vaccineRecord };
    case 'OPEN_EDIT':
      return { type: 'edit', vaccineRecord: action.vaccineRecord };
    case 'OPEN_DELETE':
      return { type: 'delete', vaccineRecordId: action.vaccineRecordId };
    case 'CLOSE':
      return { type: 'closed' };
  }
}

export function usevaccineRecordModal() {
  const [state, dispatch] = useReducer(modalReducer, { type: 'closed' });

  return {
    state,
    openView: useCallback((vaccineRecord: VaccineRecordViewModel) => dispatch({ type: 'OPEN_VIEW', vaccineRecord }), []),
    openCreate: useCallback(() => dispatch({ type: 'OPEN_CREATE' }), []),
    openEdit: useCallback((vaccineRecord: VaccineRecordViewModel) => dispatch({ type: 'OPEN_EDIT', vaccineRecord }), []),
    openDelete: useCallback((vaccineRecordId: string) => dispatch({ type: 'OPEN_DELETE', vaccineRecordId }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE' }), []),
  };
}