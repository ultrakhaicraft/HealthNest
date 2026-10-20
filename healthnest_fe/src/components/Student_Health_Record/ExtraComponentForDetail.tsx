import { StudentHealthRecordDetailModel } from "../../models/StudentHealthRecordModel";
import { IconBack, IconPaperPlane } from "../IconList";
import styles from '../../CSS/Components/StudentHealthRecordDetail.module.css';

export const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" className={styles.backLinkButton} onClick={onClick}>
    <IconBack />
  </button>
);

export const RecordSummaryCard = ({ record }: { record: StudentHealthRecordDetailModel }) => (
  <div className={styles.recordSummaryCard}>
    <div className={styles.recordSummaryLeft}>
      <div className={styles.recordSummaryIcon}>
        <IconPaperPlane className="icon" />
      </div>
      <div>
        <p className={styles.recordSummaryId}>Health Record ID: {record.id}</p>
        <h1 className={styles.recordSummaryName}>{record.studentName}</h1>
        <p className={styles.recordSummaryStudentid}>Student ID: {record.studentId}</p>
      </div>
    </div>
    <div className={styles.recordSummaryRight}>
      <div className={styles.recordSummaryMeta}>
        <span className={styles.recordSummaryLabel}>STATUS</span>
        <span className={`${styles.statusPill} ${record.status === 'Active' ? `${styles.statusPillActive}` : `${styles.statusPillInactive}`}`}>
          {record.status}
        </span>
      </div>
      <div className={styles.recordSummaryMeta}>
        <span className={styles.recordSummaryLabel}>DATE CREATED</span>
        <span className={styles.recordSummaryValue}>
          {new Date(record.createdDateTime).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric',
          })} — {new Date(record.createdDateTime).toLocaleTimeString(undefined, {
            hour: '2-digit', minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  </div>
);

export const DETAIL_TABS = [
  { label: 'Health Record', segment: '' },
  { label: 'Vaccine Record', segment: 'vaccines' },
  { label: 'Treatment Record', segment: 'treatments' },
];

export const TabNav = ({ activeItem, onSelect }: { activeItem: string; onSelect: (label: string) => void }) => (
  <div className={styles.detailTabNav}>
    {DETAIL_TABS.map(tab => (
      <button
        key={tab.label}
        type="button"
        className={activeItem === tab.label ? `${styles.detailTab} ${styles.active}` : `${styles.detailTab}`}
        onClick={() => onSelect(tab.label)}
      >
        {tab.label}
      </button>
    ))}
  </div>
); 