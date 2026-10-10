import { useReducer, useCallback } from 'react';
import { MedicalSupplyDetailsViewModel } from '../../API/MedicalSupplyService';

type MedicalSupplyModalState =
  | { type: 'closed' }
  | { type: 'view'; medicalSupply: MedicalSupplyDetailsViewModel }
  | { type: 'create' }
  | { type: 'edit'; medicalSupply: MedicalSupplyDetailsViewModel }
  | { type: 'delete'; medicalSupplyId: string };

type Action =
  | { type: 'OPEN_VIEW'; medicalSupply: MedicalSupplyDetailsViewModel }
  | { type: 'OPEN_CREATE' }
  | { type: 'OPEN_EDIT'; medicalSupply: MedicalSupplyDetailsViewModel }
  | { type: 'OPEN_DELETE'; medicalSupplyId: string }
  | { type: 'CLOSE' };

// Reducer function to manage the state of medical supply modals
function modalReducer(_state: MedicalSupplyModalState, action: Action): MedicalSupplyModalState {
  switch (action.type) {
    case 'OPEN_VIEW':
      return { type: 'view', medicalSupply: action.medicalSupply };
    case 'OPEN_CREATE':
      return { type: 'create' };
    case 'OPEN_EDIT':
      return { type: 'edit', medicalSupply: action.medicalSupply };
    case 'OPEN_DELETE':
      return { type: 'delete', medicalSupplyId: action.medicalSupplyId };
    case 'CLOSE':
      return { type: 'closed' };
  }
}

export function useMedicalSupplyModals() {
  const [state, dispatch] = useReducer(modalReducer, { type: 'closed' });

  return {
    state,
    openView: useCallback((medicalSupply: MedicalSupplyDetailsViewModel) => dispatch({ type: 'OPEN_VIEW', medicalSupply }), []),
    openCreate: useCallback(() => dispatch({ type: 'OPEN_CREATE' }), []),
    openEdit: useCallback((medicalSupply: MedicalSupplyDetailsViewModel) => dispatch({ type: 'OPEN_EDIT', medicalSupply }), []),
    openDelete: useCallback((medicalSupplyId: string) => dispatch({ type: 'OPEN_DELETE', medicalSupplyId }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE' }), []),
  };
}