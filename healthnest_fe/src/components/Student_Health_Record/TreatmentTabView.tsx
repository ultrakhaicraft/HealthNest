// TreatmentRecordTab.tsx — no fetch, just reads from context
import { useOutletContext } from 'react-router-dom';
import { StudentHealthRecordDetailModel } from '../../models/StudentHealthRecordModel';
import styles from '../../CSS/Components/StudentHealthRecordDetail.module.css';

export default function TreatmentRecordTab() {
  const { record } = useOutletContext<{ record: StudentHealthRecordDetailModel }>();
  return (
    <div className={styles.treatmentRecordTab}>
      {record.treatmentRecordViewModels.map(v => (
        <div key={v.id} className={styles.treatmentRecordItem}>
          <h3>{v.treatmentTitle}</h3>
          <p>{v.description}</p>
          <span>{new Date(v.recordDate).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
}