import inputStyles from '../../CSS/InputField.module.css';
import { RELATIONSHIP_STATUS_OPTIONS, INCOME_LEVEL_OPTIONS } from '../../feature/Constant';
import { CreateParentModel } from '../../models/AccountSubclassModels/ParentModel';
import { CreateStudentModel } from '../../models/AccountSubclassModels/StudentModel';


export type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
export type ParentExtraData = Pick<CreateParentModel, 'relationshipStatus' | 'incomeLevel'>;
export type StudentExtraData = Pick<CreateStudentModel, 'class'>;   

interface ExtraFieldsProps<T> {
  data: T;
  onChange: ChangeHandler;
  disabled: boolean;
}

export const ParentExtraFields = ({ data, onChange, disabled }: ExtraFieldsProps<ParentExtraData>) => (
  <>
    <div className={inputStyles.inputGroup}>
      <label htmlFor='relationshipStatus'>Relationship Status</label>
      <select id='relationshipStatus' name='relationshipStatus' value={data.relationshipStatus}
              onChange={onChange} disabled={disabled} required>
        <option value=''>Select status...</option>
        {RELATIONSHIP_STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
    <div className={inputStyles.inputGroup}>
      <label htmlFor='incomeLevel'>Income Level</label>
      <select id='incomeLevel' name='incomeLevel' value={data.incomeLevel}
              onChange={onChange} disabled={disabled} required>
        <option value=''>Select income level...</option>
        {INCOME_LEVEL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  </>
);

export const StudentExtraFields = ({ data, onChange, disabled }: ExtraFieldsProps<StudentExtraData>) => (
  <>
    <div className={inputStyles.inputGroup}>
      <label htmlFor='class'>Class</label>
      <input type='text' id='class' name='class' value={data.class} onChange={onChange}
             placeholder='e.g. 10A' disabled={disabled} required />
    </div>
    
  </>
);