

//Student Health Record Detail Hold 3 data: HealthRecord, Vaccine Record (A list belong to HealthRecord) and Treatment Record (A list belong to HealthRecord)
//A shared component called "RecordSwitchTab" will be responsible for switching between 3 component to view each part of the health record (HealthRecord, Vaccine and Treatment)
//RecordSwitchTab is a navigation tab in a sense
//As for the backend, not only we have to getStudentHealthRecord, getListOfVaccineBasedOnHealthRecordId (No Pagination), and getListOfTreatmentBasedOnHealthRecordId (No Pagination)
//We also need to discuss if we should call 3 API at once, or call singular API that perform 3 actions together and set as a single DTOs

import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { IconEdit } from "../../../components/IconList";
import { Spinner } from "../../../components/Spinner";
import { BackButton, DETAIL_TABS, RecordSummaryCard, TabNav } from "../../../components/Student_Health_Record/ExtraComponentForDetail";
import { useCallback, useEffect, useState } from "react";
import { StudentHealthRecordService } from "../../../feature/API/StudentHealthRecordService";
import styles from '../../../CSS/Components/StudentHealthRecordDetail.module.css';
import { StudentHealthRecordDetailModel } from "../../../models/StudentHealthRecordModel";
import { useUserRole } from "../../../feature/Hooks/Account/AccountHooks";
import { UserRole } from "../../../feature/Constant";




export default function StudentHealthRecordDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const [record, setRecord] = useState<StudentHealthRecordDetailModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecord = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await StudentHealthRecordService.getDetailById(id);
      setRecord(data);
    } catch {
      setError('Failed to load student health record.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  const getActiveTab = (): string => {
    const match = DETAIL_TABS.find(tab =>
      tab.segment ? location.pathname.endsWith(`/${tab.segment}`) : location.pathname.endsWith(`/${id}`)
    );
    return match?.label ?? DETAIL_TABS[0].label;
  };

  const handleTabSelect = (label: string) => {
    const tab = DETAIL_TABS.find(t => t.label === label);
    if (!tab) return;
    navigate(tab.segment ? `/student-records/${id}/${tab.segment}` : `/student-records/${id}`);
  };

  const handleBackButton= () =>{
    let userRole = useUserRole();
    if(userRole===UserRole.Parent){
      navigate('/parent/student-health-record');
    }
    if(userRole===UserRole.Nurse){
      navigate('/nurse/student-health-record');
    }
    if(userRole===UserRole.Student){
      navigate('/student/student-health-record');
    }
  }

  if (loading) {
    return (
      <div className={styles.recordDetailLoading}>
        <Spinner size="large" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className={styles.recordDetailPage}>
        <BackButton onClick={handleBackButton} />
        <p className={styles.dashboardError}>{error ?? 'Record not found.'}</p>
      </div>
    );
  }

  return (
    <div className={styles.recordDetailPage}>
      <div className={styles.recordDetailTopbar}>
        {/*Depend on the user role, it should go back to their respective student health record panel instead of -1*/}
        <BackButton onClick={handleBackButton} />
        <div className={styles.recordDetailActions}>
          <button className="button button-secondary">
            Print
          </button>
         
        </div>
      </div>

      <RecordSummaryCard record={record} />

      <TabNav activeItem={getActiveTab()} onSelect={handleTabSelect} />

      {/* Nested route renders the active tab's content; pass record down via Outlet context */}
      <Outlet context={{ record, refetch: loadRecord }} />
    </div>
  );
}
