import { Link } from 'react-router-dom';
import FormSection from '../../components/FormSection';
import { IconHeart, IconActivity, IconEye, IconInfo } from '../../components/IconList';
import { StudentHealthRecordDetail } from '../../feature/API/StudentHealthRecordService';
import EmptyRecordView from './EmptyRecordView';

interface MedicalRecordViewProps {
  viewData: StudentHealthRecordDetail | null;
  parentName: string | null;
  error: string | null;
}

const MedicalRecordView = ({ error, viewData, parentName }: MedicalRecordViewProps) => {
  if (!viewData) return <EmptyRecordView />;

  return (
    <div className="medical-record-form">
      <h2 className="form-title">Student Medical Record</h2>
      {error && <div className='error-message'>{error}</div>}

      <p>Parent: {parentName}</p>
      <p>Child: {viewData.studentName}</p>
      <p>Height: {viewData.height} cm</p>

      <FormSection icon={<IconHeart />} title="Allergies">
        <p>{viewData.allergies}</p>
      </FormSection>
      <FormSection icon={<IconActivity />} title="Chronic Diseases">
        <p>{viewData.chronicDiseases}</p>
      </FormSection>
      <FormSection icon={<IconEye />} title="Vision">
        <p>{viewData.vision}</p>
      </FormSection>
      <FormSection icon={<IconInfo />} title="Hearing">
        <p>{viewData.hearing}</p>
      </FormSection>

      <Link to="/updateStudentHealthRecord" className="create-record-button">Update</Link>
    </div>
  );
};

export default MedicalRecordView;
