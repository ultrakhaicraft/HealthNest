import { useEffect, useRef, useState } from "react";
import { useUserId } from "../../../feature/Hooks/Account/AccountHooks";
import { useParentStudents } from "../../../feature/Hooks/Account/useStudentParent";
import { useMyLinkRequests } from "../../../feature/Hooks/StudentLinkRequest/useStudentLinkRequest";
import { LinkRequestCreateModel, StudentLinkRequestQuery, StudentLinkRequestViewModel } from "../../../models/StudentLinkRequestModel";
import LinkedStudentTableWrapper from "../../../components/StudentManagementPage/Parent/LinkedStudentTableWrapper";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { useStudentLinkRequestModal } from "../../../feature/Hooks/StudentLinkRequest/useStudentLinkRequestModal";
import { getLinkRequestErrorMessage, StudentLinkRequestService } from "../../../feature/API/StudentLinkRequestService";
import LinkRequestSectionView from "../../../components/StudentManagementPage/Parent/StudentLinkRequestSectionView";
import CreateStudentLinkRequestModal from "../../../components/StudentManagementPage/Parent/CreateLinkRequestModal";
import { StudentViewModel } from "../../../models/AccountSubclassModels/StudentModel";
import { Link } from "react-router-dom";

import styles from '../../../CSS/Parent/StudentManagementPage.module.css';
import { IconBack } from "../../../components/IconList";
import { Toast } from "../../../components/Notification/Toast";

// Module-level constant: not required (the hook tolerates inline objects) but it makes intent obvious
const MY_REQUESTS_FILTER: StudentLinkRequestQuery = { PageIndex: 1, PageSize: 50 };
const MAX_PENDING_REQUESTS = 5;




export default function StudentManagementPage() {
    const parentId = useUserId();
    const { students, loading: studentsLoading, error: studentsError, refetch: refetchStudents }
        = useParentStudents(parentId ?? '');
    const { data: requests, loading: requestsLoading, error: requestError, submit, cancel, refetch: refetchRequests, }
        = useMyLinkRequests(MY_REQUESTS_FILTER);

    const modal = useStudentLinkRequestModal();


    const [actionLoading, setActionLoading] = useState(false);
    const [unlinkingId, setUnlinkingId] = useState<string | null>(null);
    const [cancelingId, setCancelingId] = useState<string | null>(null);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
    const showToast = (message: string, type: 'success' | 'error') =>
        setToast({ isVisible: true, message, type });


    const pendingRequests = requests.filter(r => r.status === 'Pending');
    const atCap = pendingRequests.length >= MAX_PENDING_REQUESTS;
    const studentToUnlink = modal.state.type === 'unlink' ? modal.state.student : null;

    // Keep the children table in sync when a nurse approves a request while this page is open.
    // The requests hook already refetches on tab focus, so a rising Approved count is the signal.
    const approvedCount = requests.filter(r => r.status === 'Approved').length;
    const previousApprovedCount = useRef<number | null>(null);
    useEffect(() => {
        if (requestsLoading) return;                       // wait for the first load to set a baseline
        if (previousApprovedCount.current !== null && approvedCount > previousApprovedCount.current) {
            refetchStudents();
        }
        previousApprovedCount.current = approvedCount;
    }, [approvedCount, requestsLoading, refetchStudents]);




    const handleUnlinkConfirm = async () => {
        if (!studentToUnlink) return;

        setUnlinkingId(studentToUnlink.id);
        try {
            await StudentLinkRequestService.unlink(studentToUnlink.id);
            showToast(`${studentToUnlink.fullName ?? 'The student'} has been unlinked.`, 'success');
        } catch (err) {
            showToast(getLinkRequestErrorMessage(err, 'Failed to remove the link.'), 'error');
        } finally {
            setUnlinkingId(null);
            modal.close();
            // Success or failure, make both lists match the server. Unlinking hard-deletes
            // the Approved request row, so the requests section needs a refresh as well.
            await Promise.all([refetchStudents(), refetchRequests()]);
        }
    };

    const handleCancelRequest = async (request: StudentLinkRequestViewModel) => {
        setCancelingId(request.id);
        try {
            await cancel(request.id);
            showToast('Request cancelled.', 'success');
        } catch (err) {
            // A common failure is "a nurse just reviewed it", and cancel already refetched,
            // so the row now shows its real status.
            showToast(getLinkRequestErrorMessage(err, 'Failed to cancel the request.'), 'error');
        } finally {
            setCancelingId(null);
        }
    };

    const handleSubmitRequest = async (payload: LinkRequestCreateModel) => {
        await submit(payload);
        showToast(
            payload.studentIds.length > 1
                ? 'Link requests sent. A school nurse will review them.'
                : 'Link request sent. A school nurse will review it.',
            'success'
        );
        modal.close();
    };

    // ----- Opening the request modal: one entry point, one rule -----
    const openRequestModal = async (preselected?: { studentId: string; displayName?: string }) => {
        if (atCap) {
            showToast(
                `You can have at most ${MAX_PENDING_REQUESTS} pending requests. Cancel one or wait for a review.`,
                'error'
            );
            return;
        }
        modal.openCreate(preselected);
    }

    const handleRequestLink = () => openRequestModal();         // wrapper: never pass the click event along


    const onRequestAgain = async (request: StudentLinkRequestViewModel) => {
        openRequestModal({ studentId: request.studentId, displayName: request.studentName ?? undefined })

    }

    // Hooks are all above this line. localStorage can lose userId while the auth cookie is still valid.
    if (!parentId) {
        return (
            <div className={styles.page}>
                <p className={styles.error}>
                    We couldn't identify your account. Please <Link to="/login">log in again</Link>.
                </p>
            </div>
        );
    }

    const childName = studentToUnlink?.fullName ?? 'this student';

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link className={styles.backLink} to="/parent" aria-label="Back to home" title="Back to home">
                        <IconBack className={styles.backIcon} />
                    </Link>
                    <div>
                        <h1 className={styles.title}>Manage your children</h1>
                        <p className={styles.subtitle}>
                            Link students to your account, track your requests, or remove a link.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={handleRequestLink}
                    disabled={atCap}
                >
                    Request to link a student
                </button>
            </header>

            {atCap && (
                <p className={styles.capNote} role="status">
                    You have {MAX_PENDING_REQUESTS} pending requests, the maximum allowed. Cancel one or
                    wait for a nurse to review them before sending another.
                </p>
            )}


            <LinkedStudentTableWrapper
                students={students}                       // from useParentStudents
                loading={actionLoading}
                error={studentsError}
                removingStudentId={unlinkingId}           // page state, set while the DELETE is in flight
                onRemoveLink={modal.openDelete}         // opens the ConfirmationModal
                onRequestLink={modal.openCreate}
            />

            <LinkRequestSectionView
                requests={requests}
                loading={requestsLoading}
                error={requestError}
                cancelingId={cancelingId}
                maxPending={MAX_PENDING_REQUESTS}
                onCancel={handleCancelRequest}
                onRequestAgain={onRequestAgain}   // pre-seeding the student comes with the modal (see below)
                onRequestLink={openRequestModal}
            />

           

            {modal.state.type === 'create' && (
                <CreateStudentLinkRequestModal
                    remainingSlots={MAX_PENDING_REQUESTS - pendingRequests.length}
                    pendingStudentIds={pendingRequests.map(r => r.studentId)}
                    preselected={modal.state.preselectedStudent}
                    onClose={modal.close}
                    onSubmit={handleSubmitRequest}
                    isOpen={false}
                />
            )}

            {studentToUnlink && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={modal.close}
                    onConfirm={handleUnlinkConfirm}
                    title={`Remove link to ${childName}?`}
                    message={`You will lose access to ${childName}'s health record and medicine requests. To link again, you will need to send a new request and wait for nurse approval.`}
                    confirmText="Remove link"
                    cancelText="Cancel"
                    isLoading={unlinkingId !== null}
                    type="danger"
                />
            )}

             <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
}
