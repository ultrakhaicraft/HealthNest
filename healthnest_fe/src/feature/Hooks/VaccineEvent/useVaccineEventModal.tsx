import { useReducer, useCallback } from 'react';
import { MedicalSupplyDetailsViewModel } from '../../API/MedicalSupplyService';
import { MedicineRequestDetailsModel } from '../../API/MedicineRequestService';
import { VaccineEventDetailDTO, ViewVaccineEventDTO } from '../../../models/VaccineEventModel';


type VaccineEventModalState =
  | { type: 'closed' }
  | { type: 'view'; vaccineEvent: VaccineEventDetailDTO }
  | { type: 'create' }
  | { type: 'edit'; vaccineEvent: VaccineEventDetailDTO }
  | { type: 'delete'; vaccineEventId: string };

type Action =
  | { type: 'OPEN_VIEW'; vaccineEvent: VaccineEventDetailDTO }
  | { type: 'OPEN_CREATE' }
  | { type: 'OPEN_EDIT'; vaccineEvent: VaccineEventDetailDTO }
  | { type: 'OPEN_DELETE'; vaccineEventId: string }
  | { type: 'CLOSE' };

// Reducer function to manage the state of vaccine event modals
function modalReducer(_state: VaccineEventModalState, action: Action): VaccineEventModalState {
  switch (action.type) {
    case 'OPEN_VIEW':
      return { type: 'view', vaccineEvent: action.vaccineEvent };
    case 'OPEN_CREATE':
      return { type: 'create' };
    case 'OPEN_EDIT':
      return { type: 'edit', vaccineEvent: action.vaccineEvent };
    case 'OPEN_DELETE':
      return { type: 'delete', vaccineEventId: action.vaccineEventId };
    case 'CLOSE':
      return { type: 'closed' };
  }
}

export function useVaccineEventModals() {
  const [state, dispatch] = useReducer(modalReducer, { type: 'closed' });

  return {
    state,
    openView: useCallback((vaccineEvent: VaccineEventDetailDTO) => dispatch({ type: 'OPEN_VIEW', vaccineEvent }), []),
    openCreate: useCallback(() => dispatch({ type: 'OPEN_CREATE' }), []),
    openEdit: useCallback((vaccineEvent: VaccineEventDetailDTO) => dispatch({ type: 'OPEN_EDIT', vaccineEvent }), []),
    openDelete: useCallback((vaccineEventId: string) => dispatch({ type: 'OPEN_DELETE', vaccineEventId }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE' }), []),
  };
}