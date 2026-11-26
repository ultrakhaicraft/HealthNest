import { useReducer, useCallback } from 'react';
import { ViewVaccineEventStudentDetailModel } from '../../../models/VaccineEventStudentModel';


type VaccineEventStudentModalState =
    | { type: 'closed' }
    | { type: 'view'; vaccineEventStudent: ViewVaccineEventStudentDetailModel }
    | { type: 'sign-up'; }
    | { type: 're-sign-up'; eventId: string; studentId: string }
    | { type: 'reject-student'; eventId: string; studentId: string }
    | { type: 'approve-student'; eventId: string; studentId: string }
    | { type: 'cancel-sign-up'; eventId: string; studentId: string }
    | { type: 'complete-student'; eventId: string; studentId: string; }
    | { type: 'update-note'; eventId: string; studentId: string; }

type Action =
    | { type: 'OPEN_VIEW'; vaccineEventStudent: ViewVaccineEventStudentDetailModel }
    | { type: 'OPEN_SIGN_UP'; }
    | { type: 'OPEN_RE_SIGN_UP'; eventId: string; studentId: string }
    | { type: 'OPEN_REJECT_STUDENT'; eventId: string; studentId: string }
    | { type: 'OPEN_APPROVE_STUDENT'; eventId: string; studentId: string }
    | { type: 'OPEN_CANCEL_SIGN_UP'; eventId: string; studentId: string }
    | { type: 'OPEN_COMPLETE_STUDENT'; eventId: string; studentId: string; }
    | { type: 'OPEN_UPDATE_NOTE'; eventId: string; studentId: string; }
    | { type: 'CLOSE' };

// Reducer function to manage the state of vaccine event modals
function modalReducer(_state: VaccineEventStudentModalState, action: Action): VaccineEventStudentModalState {
    switch (action.type) {
        case 'OPEN_VIEW':
            return { type: 'view', vaccineEventStudent: action.vaccineEventStudent };
        case 'OPEN_SIGN_UP':
            return { type: 'sign-up' };
        case 'OPEN_RE_SIGN_UP':
            return { type: 're-sign-up', eventId: action.eventId, studentId: action.studentId };
        case 'OPEN_REJECT_STUDENT':
            return { type: 'reject-student', eventId: action.eventId, studentId: action.studentId };
        case 'OPEN_APPROVE_STUDENT':
            return { type: 'approve-student', eventId: action.eventId, studentId: action.studentId };
        case 'OPEN_CANCEL_SIGN_UP':
            return { type: 'cancel-sign-up', eventId: action.eventId, studentId: action.studentId };
        case 'OPEN_COMPLETE_STUDENT':
            return { type: 'complete-student', eventId: action.eventId, studentId: action.studentId };
        case 'OPEN_UPDATE_NOTE':
            return { type: 'update-note', eventId: action.eventId, studentId: action.studentId };
        case 'CLOSE':
            return { type: 'closed' };
    }
}

export function useVaccineEventStudentModals() {
    const [state, dispatch] = useReducer(modalReducer, { type: 'closed' });

    return {
        state,
        openView: useCallback((vaccineEventStudent: ViewVaccineEventStudentDetailModel) => dispatch({ type: 'OPEN_VIEW', vaccineEventStudent }), []),
        openSignup: useCallback(() => dispatch({ type: 'OPEN_SIGN_UP' }), []),
        openReSignup: useCallback((eventId: string, studentId: string) => dispatch({ type: 'OPEN_RE_SIGN_UP', eventId, studentId }), []),
        openRejectStudent: useCallback((eventId: string, studentId: string) => dispatch({ type: 'OPEN_REJECT_STUDENT', eventId, studentId }), []),
        openApproveStudent: useCallback((eventId: string, studentId: string) => dispatch({ type: 'OPEN_APPROVE_STUDENT', eventId, studentId }), []),
        openCancelSignUp: useCallback((eventId: string, studentId: string) => dispatch({ type: 'OPEN_CANCEL_SIGN_UP', eventId, studentId }), []),
        openCompleteStudent: useCallback((eventId: string, studentId: string) => dispatch({ type: 'OPEN_COMPLETE_STUDENT', eventId, studentId }), []),
        openUpdateNote: useCallback((eventId: string, studentId: string) => dispatch({ type: 'OPEN_UPDATE_NOTE', eventId, studentId }), []),
        close: useCallback(() => dispatch({ type: 'CLOSE' }), []),
    };
}