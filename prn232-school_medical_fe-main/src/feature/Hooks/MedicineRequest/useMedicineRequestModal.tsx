import { useReducer, useCallback } from 'react';
import { MedicalSupplyDetailsViewModel } from '../../API/MedicalSupplyService';
import { MedicineRequestDetailsModel } from '../../API/MedicineRequestService';

type MedicineRequestModalState =
  | { type: 'closed' }
  | { type: 'view'; medicineRequest: MedicineRequestDetailsModel }
  | { type: 'create' }
  | { type: 'edit'; medicineRequest: MedicineRequestDetailsModel }
  | { type: 'delete'; medicineRequestId: string };

type Action =
  | { type: 'OPEN_VIEW'; medicineRequest: MedicineRequestDetailsModel }
  | { type: 'OPEN_CREATE' }
  | { type: 'OPEN_EDIT'; medicineRequest: MedicineRequestDetailsModel }
  | { type: 'OPEN_DELETE'; medicineRequestId: string }
  | { type: 'CLOSE' };

// Reducer function to manage the state of medicine request modals
function modalReducer(_state: MedicineRequestModalState, action: Action): MedicineRequestModalState {
  switch (action.type) {
    case 'OPEN_VIEW':
      return { type: 'view', medicineRequest: action.medicineRequest };
    case 'OPEN_CREATE':
      return { type: 'create' };
    case 'OPEN_EDIT':
      return { type: 'edit', medicineRequest: action.medicineRequest };
    case 'OPEN_DELETE':
      return { type: 'delete', medicineRequestId: action.medicineRequestId };
    case 'CLOSE':
      return { type: 'closed' };
  }
}

export function useMedicineRequestModals() {
  const [state, dispatch] = useReducer(modalReducer, { type: 'closed' });

  return {
    state,
    openView: useCallback((medicineRequest: MedicineRequestDetailsModel) => dispatch({ type: 'OPEN_VIEW', medicineRequest }), []),
    openCreate: useCallback(() => dispatch({ type: 'OPEN_CREATE' }), []),
    openEdit: useCallback((medicineRequest: MedicineRequestDetailsModel) => dispatch({ type: 'OPEN_EDIT', medicineRequest }), []),
    openDelete: useCallback((medicineRequestId: string) => dispatch({ type: 'OPEN_DELETE', medicineRequestId }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE' }), []),
  };
}