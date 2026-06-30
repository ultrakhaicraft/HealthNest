import FormSection from '../../components/FormSection';
import { 
  IconHeart, 
  IconActivity, 
  IconEye, 
  IconInfo, 
  IconPaperPlane
} from '../../components/IconList';
import { AccountDetail } from '../../feature/API/AccountService';

interface MedicalRecordFormProps {
  formData: {
    height: string;
    allergies: string;
    chronicDiseases: string;
    vision: string;
    hearing: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string | null;
}

const MedicalRecordForm = ({ handleInputChange, handleSubmit, isLoading, error, formData }: MedicalRecordFormProps) => {
  const stored = localStorage.getItem('accountDetail');
  let parentData: AccountDetail | null = null;
  if (stored) {
    parentData = JSON.parse(stored);
  } else {
    console.warn('No account detail found in local storage');
  }

  const parentName = parentData?.fullName || '';
  const childName = parentData?.studentName || '';

  return (
    <div className="medical-record-form">
      <div className="form-title-container">
        <h2 className="form-title">Student Medical Record Form</h2>
        <p className="form-subtitle">Please fill out all medical information for your child.</p>
      </div>

      {error && <div className='error-message'>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label className="input-label" htmlFor="parentName">Parent Name</label>
            <input type="text" id="parentName" value={parentName} readOnly className="input-field" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="childName">Child Name</label>
            <input type="text" id="childName" value={childName} readOnly className="input-field" />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="height">Height</label>
          <div className="input-with-unit">
            <input type="number" id="height" name="height" value={formData.height} onChange={handleInputChange} className="input-field" />
            <span className="input-unit">cm</span>
          </div>
        </div>

        <FormSection icon={<IconHeart />} title="Allergies">
          <textarea id="allergies" name="allergies" rows={4} value={formData.allergies} onChange={handleInputChange} className="textarea-field" />
        </FormSection>

        <FormSection icon={<IconActivity />} title="Chronic Diseases">
          <textarea id="chronicDiseases" name="chronicDiseases" rows={4} value={formData.chronicDiseases} onChange={handleInputChange} className="textarea-field" />
        </FormSection>

        <FormSection icon={<IconEye />} title="Vision">
          <textarea id="vision" name="vision" rows={4} value={formData.vision} onChange={handleInputChange} className="textarea-field" />
        </FormSection>

        <FormSection icon={<IconInfo />} title="Hearing">
          <textarea id="hearing" name="hearing" rows={4} value={formData.hearing} onChange={handleInputChange} className="textarea-field" />
        </FormSection>

        <div className="form-actions">
          <button type="submit" className="button button-primary" disabled={isLoading}>
            <IconPaperPlane /> Save Medical Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalRecordForm;
