import { useReducer, useCallback } from "react";
import { TreatmentRecordViewModel } from "../../../models/TreatmentRecordModel";

type TreatmentRecordModalState =
  | { type: 'closed' }
  | { type: 'view'; treatmentRecord: TreatmentRecordViewModel }

  | { type: 'create' }
  | { type: 'edit'; treatmentRecord: TreatmentRecordViewModel }
  | { type: 'delete'; treatmentRecordId: string };

type Action =
  | { type: 'OPEN_VIEW'; treatmentRecord: TreatmentRecordViewModel }

  | { type: 'OPEN_CREATE' }
  | { type: 'OPEN_EDIT'; treatmentRecord: TreatmentRecordViewModel }
  | { type: 'OPEN_DELETE'; treatmentRecordId: string }
  | { type: 'CLOSE' };

// Reducer function to manage the state of medicine modals
function modalReducer(_state: TreatmentRecordModalState, action: Action): TreatmentRecordModalState {
  switch (action.type) {
    case 'OPEN_VIEW':
      return { type: 'view', treatmentRecord: action.treatmentRecord };
    case 'OPEN_CREATE':
      return { type: 'create' };
    case 'OPEN_EDIT':
      return { type: 'edit', treatmentRecord: action.treatmentRecord };
    case 'OPEN_DELETE':
      return { type: 'delete', treatmentRecordId: action.treatmentRecordId };
    case 'CLOSE':
      return { type: 'closed' };
  }
}

export function usetreatmentRecordModal() {
  const [state, dispatch] = useReducer(modalReducer, { type: 'closed' });

  return {
    state,
    openView: useCallback((treatmentRecord: TreatmentRecordViewModel) => dispatch({ type: 'OPEN_VIEW', treatmentRecord }), []),

    openCreate: useCallback(() => dispatch({ type: 'OPEN_CREATE' }), []),
    openEdit: useCallback((treatmentRecord: TreatmentRecordViewModel) => dispatch({ type: 'OPEN_EDIT', treatmentRecord }), []),
    openDelete: useCallback((treatmentRecordId: string) => dispatch({ type: 'OPEN_DELETE', treatmentRecordId }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE' }), []),
  };
}