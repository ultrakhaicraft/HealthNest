// VaccineRecordTab.tsx — no fetch, just reads from context
import { useOutletContext } from 'react-router-dom';
import { StudentHealthRecordDetailModel } from '../../models/StudentHealthRecordModel';
import styles from '../../CSS/Components/StudentHealthRecordDetail.module.css';

export default function VaccineRecordTab() {
  const { record } = useOutletContext<{ record: StudentHealthRecordDetailModel }>();
  return (
    <div className={styles.vaccineRecordTab}>
      {record.vaccineRecordViewModels.map(v => (
        <div key={v.id} className={styles.vaccineRecordItem}>
          <h3>{v.vaccineTitle}</h3>
          <p>{v.description}</p>
          <span>{new Date(v.recordDate).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
}