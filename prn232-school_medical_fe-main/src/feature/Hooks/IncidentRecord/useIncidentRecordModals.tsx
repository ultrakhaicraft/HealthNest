import { useReducer, useCallback } from 'react';
import { IncidentRecordViewDetail } from '../../API/IncidentRecordService';

type IncidentRecordModalState =
  | { type: 'closed' }
  | { type: 'view'; incidentRecord: IncidentRecordViewDetail }
  | { type: 'create' }
  | { type: 'edit'; incidentRecord: IncidentRecordViewDetail }
  | { type: 'delete'; incidentRecordId: string };

type Action =
  | { type: 'OPEN_VIEW'; incidentRecord: IncidentRecordViewDetail }
  | { type: 'OPEN_CREATE' }
  | { type: 'OPEN_EDIT'; incidentRecord: IncidentRecordViewDetail }
  | { type: 'OPEN_DELETE'; incidentRecordId: string }
  | { type: 'CLOSE' };

// Reducer function to manage the state of incident record modals
function modalReducer(_state: IncidentRecordModalState, action: Action): IncidentRecordModalState {
  switch (action.type) {
    case 'OPEN_VIEW':
      return { type: 'view', incidentRecord: action.incidentRecord };
    case 'OPEN_CREATE':
      return { type: 'create' };
    case 'OPEN_EDIT':
      return { type: 'edit', incidentRecord: action.incidentRecord };
    case 'OPEN_DELETE':
      return { type: 'delete', incidentRecordId: action.incidentRecordId };
    case 'CLOSE':
      return { type: 'closed' };
  }
}

export function useIncidentRecordModals() {
  const [state, dispatch] = useReducer(modalReducer, { type: 'closed' });

  return {
    state,
    openView: useCallback((incidentRecord: IncidentRecordViewDetail) => dispatch({ type: 'OPEN_VIEW', incidentRecord }), []),
    openCreate: useCallback(() => dispatch({ type: 'OPEN_CREATE' }), []),
    openEdit: useCallback((incidentRecord: IncidentRecordViewDetail) => dispatch({ type: 'OPEN_EDIT', incidentRecord }), []),
    openDelete: useCallback((incidentRecordId: string) => dispatch({ type: 'OPEN_DELETE', incidentRecordId }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE' }), []),
  };
}