import { useOutletContext } from "react-router-dom";
import { StudentHealthRecordDetailModel } from "../../models/StudentHealthRecordModel";
import styles from '../../CSS/Components/StudentHealthRecordDetail.module.css';
import { IconEye, IconInfo, IconHeart, IconUser } from "../IconList";


export default function HealthRecordTabView() {
  const { record } = useOutletContext<{ record: StudentHealthRecordDetailModel }>();
  return (
   <div className={styles.recordDetailGrid}>
      <div className={styles.recordDetailMain}>
        <SectionCard icon="📏" title="Basic Measurements">
          <div className={styles.measurementGrid}>
            <MeasurementBox label="Height" value={record.height} unit="cm" />
            <MeasurementBox label="Weight" value={record.weight} unit="kg" />
            <MeasurementBox label="Blood Pressure" value={record.bloodPressure} highlight />
            <MeasurementBox label="Blood Profile" value={record.bloodProfile} highlight />
          </div>
        </SectionCard>

        <SectionCard icon="🩺" title="Examination Details">
          <ExaminationRow icon={<IconEye className={styles.icon} />} label="Vision" value={record.vision} />
          <ExaminationRow icon={<IconInfo className={styles.icon} />} label="Ear, Nose & Mouth" value={record.earNoseAndMouth} />
          <ExaminationRow icon="🦷" label="Teeth" value={record.teeth} />
          <ExaminationRow icon={<IconHeart className={styles.icon} />} label="Heart" value={record.heart} />
        </SectionCard>

        <SectionCard icon="📄" title="Allergies & Health History">
          <div className={styles.allergyBanner}>
            <strong>⚠ Allergies</strong>
            <p>{record.allergies || 'No known allergies recorded.'}</p>
          </div>
          <div className={styles.historyBanner}>
            <strong>Health History</strong>
            <p>{record.healthHistory || 'No health history recorded.'}</p>
          </div>
        </SectionCard>
      </div>

      <div className={styles.recordDetailSide}>
        <SectionCard icon={<IconUser className="icon" />} title="Student Information">
          <p className={styles.sideStudentName}>{record.studentName}</p>
          <div className={styles.sideInfoRow}>
            <span>Student ID</span>
            <strong>{record.studentId}</strong>
          </div>
        </SectionCard>

        <SectionCard icon="ℹ️" title="Record Metadata">
          <div className={styles.sideInfoRow}>
            <span>Created By</span>
            <strong>{record.createdByName}</strong>
          </div>
          <div className={styles.sideInfoRow}>
            <span>Created</span>
            <strong>{new Date(record.createdDateTime).toLocaleString()}</strong>
          </div>
          <div className={styles.sideInfoRow}>
            <span>Last Updated</span>
            <strong>{new Date(record.updatedDateTime).toLocaleString()}</strong>
          </div>
          <div className={styles.sideInfoRow}>
            <span>Status</span>
            <strong>{record.status}</strong>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

const SectionCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className={styles.detailSectionCard}>
    <div className={styles.detailSectionHeader}>
      <span className={styles.detailSectionIcon}>{icon}</span>
      <h2>{title}</h2>
    </div>
    <div className={styles.detailSectionBody}>{children}</div>
  </div>
);

const MeasurementBox = ({
  label, value, unit, highlight,
}: { label: string; value: string | number | null | undefined; unit?: string; highlight?: boolean }) => (
  <div className={`${styles.measurementBox} ${highlight ? `${styles.measurementBoxHighlight}` : ''}`}>
    <span className={styles.examinationLabel}>{label}:</span>
    <span className={styles.examinationValue}>
      {value ?? '—'} {value != null && unit && <span className={styles.measurementUnit}>{unit}</span>}
    </span>
  </div>
);

const ExaminationRow = ({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value?: string | null }) => (
  <div className={styles.examinationRow}>
    <span className={styles.examinationIcon}>{icon}</span>
    <div>
      <p className={styles.examinationLabel}>{label}</p>
      <p className={styles.examinationValue}>{value || 'Not recorded'}</p>
    </div>
  </div>
);