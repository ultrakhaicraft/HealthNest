import { useReducer, useCallback } from 'react';
import { MedicineDetailsViewModel } from '../../API/MedicineService';

type MedicineModalState =
  | { type: 'closed' }
  | { type: 'view'; medicine: MedicineDetailsViewModel }
  | { type: 'create' }
  | { type: 'edit'; medicine: MedicineDetailsViewModel }
  | { type: 'delete'; medicineId: string };

type Action =
  | { type: 'OPEN_VIEW'; medicine: MedicineDetailsViewModel }
  | { type: 'OPEN_CREATE' }
  | { type: 'OPEN_EDIT'; medicine: MedicineDetailsViewModel }
  | { type: 'OPEN_DELETE'; medicineId: string }
  | { type: 'CLOSE' };

// Reducer function to manage the state of medicine modals
function modalReducer(_state: MedicineModalState, action: Action): MedicineModalState {
  switch (action.type) {
    case 'OPEN_VIEW':
      return { type: 'view', medicine: action.medicine };
    case 'OPEN_CREATE':
      return { type: 'create' };
    case 'OPEN_EDIT':
      return { type: 'edit', medicine: action.medicine };
    case 'OPEN_DELETE':
      return { type: 'delete', medicineId: action.medicineId };
    case 'CLOSE':
      return { type: 'closed' };
  }
}

export function useMedicineModals() {
  const [state, dispatch] = useReducer(modalReducer, { type: 'closed' });

  return {
    state,
    openView: useCallback((medicine: MedicineDetailsViewModel) => dispatch({ type: 'OPEN_VIEW', medicine }), []),
    openCreate: useCallback(() => dispatch({ type: 'OPEN_CREATE' }), []),
    openEdit: useCallback((medicine: MedicineDetailsViewModel) => dispatch({ type: 'OPEN_EDIT', medicine }), []),
    openDelete: useCallback((medicineId: string) => dispatch({ type: 'OPEN_DELETE', medicineId }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE' }), []),
  };
}