import FormSection from '../../components/FormSection'
import { 
  IconHeart, 
  IconActivity, 
  IconEye, 
  IconInfo, 
  IconPaperPlane,  
} from '../../components/IconList'; // Importing icons from a separate file
import { AccountDetail } from '../../feature/API/AccountService';

interface MedicineRequestFormProps {
    formData: {
      description: string;
    }
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    error: string | null;
}


//Medical Record Form Component
const MedicineRequestForm = ({ handleInputChange, handleSubmit, isLoading, error, formData }: MedicineRequestFormProps) => {
  const stored = localStorage.getItem('accountDetail');
  let parentData: AccountDetail | null=null
  if(stored){
    parentData = JSON.parse(stored);
  }else{
    console.warn('No account detail found in local storage')
  }

  const parentName=parentData?.fullName;
  const childName=parentData?.studentName
  return (
    <div className="medical-record-form">
      <div className="form-title-container">
        <div className="form-title-icon-wrapper">
          {/* Document Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="icon-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="form-title">Medicine Request Form</h2>
          <p className="form-subtitle">Please fill out all medicine information for us to let the child consume</p>
        </div>
      </div>

      <div className="info-banner" role="alert">
        <div className="info-banner-content">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon-small info-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p>All information provided will be kept confidential and used only for your child's health and safety at school.</p>
        </div>
      </div>
      
      {/* Form Fields */}
      {error && <div className='error-message'>{error}</div>}
      <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="input-group">
          <label htmlFor="parentName" className="input-label">Parent Name</label>
          <input
            type="text"
            id="parentName"
            name="parentName"
            value={parentName}
            onChange={handleInputChange}
            placeholder="Enter parent's full name"
            className="input-field"
            readOnly
          />
        </div>
      
        <div className="input-group">
          <label htmlFor="childName" className="input-label">Child Name</label>
          <input
            type="text"
            id="childName"
            name="childName"
            value={childName}
            onChange={handleInputChange}
            placeholder="Enter child's full name"
            className="input-field"
            readOnly
          />
        </div>
      </div>
      

      <FormSection icon={<IconInfo className="icon-small icon-eye" />} title="Request Description"
        formSectionClassName='form-section' headerClassName='form-section-header' titleClassName='form-section-title'>
        <textarea
          id='description'
          name='description'
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Please describe your prescription here. Best to use the format: 'Medicine Name - Dosage - Frequency'."
          className="textarea-field"
        />
      </FormSection>

      <div className="form-actions">
        <button type="submit" className="button button-primary" disabled={isLoading}>
          <IconPaperPlane className="icon-small"/>
          Save Medical Record
        </button>
      </div>
      </form>
    </div>
    
      
  );
};

export default MedicineRequestForm;