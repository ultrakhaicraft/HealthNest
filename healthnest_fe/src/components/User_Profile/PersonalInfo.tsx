
import { useState } from 'react';
import { IconBusinessCardPerson, IconEdit, IconPerson } from '../../components/IconList';
import { AccountDetailModel } from '../../models/AccountModel';
import styles from '../../CSS/Components/UserProfile.module.css';
import { ParentDetailModel } from '../../models/AccountSubclassModels/ParentModel';

type EditableField = 'fullName' | 'email' | 'phoneNumber' | 'address' | 'gender' | 'dateOfBirth' | 'incomeLevel' | 'relationshipStatus';

const FIELDS: { name: EditableField; label: string; type: 'text' | 'email' | 'tel' |'date'; fullWidth?: boolean }[] = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
    { name: 'gender', label: 'Gender', type:'text'},
    { name: 'address', label: 'Address', type: 'text', fullWidth: true },
    { name: 'dateOfBirth', label: 'dateOfBirth', type: 'date' },
    { name: 'incomeLevel', label: 'Address', type: 'text' },
    { name: 'relationshipStatus', label: 'Gender', type:'text'},
];


interface PersonalInfoProps {
    account: ParentDetailModel;
    onUpdate: (info: ParentDetailModel) => Promise<void>;
}


const PersonalInfo = ({ account, onUpdate }: PersonalInfoProps) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [draft, setDraft] = useState<ParentDetailModel>(account);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const startEditing = () => {
        setDraft(account);          // always start from the latest server data
        setSaveError(null);
        setIsEditMode(true);
    };

    const handleCancel = () => {
        setDraft(account);
        setSaveError(null);
        setIsEditMode(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDraft(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);
        try {
            await onUpdate(draft);      // full model: id, role, gender, avatarUrl, dateOfBirth all preserved
            setIsEditMode(false);
        } catch (err: any) {
            setSaveError(err?.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const itemClass = (fullWidth?: boolean) =>
        fullWidth ? `${styles.infoItem} ${styles.fullWidth}` : styles.infoItem;

    return (
        <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
                <h2 className={styles.infoCardTitle}>
                    <IconBusinessCardPerson className={styles.icon} /> Personal Information
                </h2>
                {!isEditMode && (
                    <button type="button" className={styles.editButton} onClick={startEditing}>
                        <IconEdit className={styles.icon} /> Edit
                    </button>
                )}
            </div>

            {isEditMode ? (
                <form onSubmit={handleSaveChanges}>
                    {saveError && <p className={styles.errorText}>{saveError}</p>}
                    <div className={styles.infoGrid}>
                        {FIELDS.map(({ name, label, type, fullWidth }) => (
                            <div key={name} className={itemClass(fullWidth)}>
                                <label className={styles.inputLabel} htmlFor={name}>{label}</label>
                                <input
                                    id={name}
                                    name={name}
                                    type={type}
                                    value={type === 'date' ? toDateInputValue(draft[name]) : (draft[name] ?? '')}
                                    onChange={handleInputChange}
                                    className={styles.inputField}
                                    disabled={isSaving}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" className="button button-secondary" onClick={handleCancel} disabled={isSaving}>
                            Cancel
                        </button>
                        <button type="submit" className="button button-primary" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className={styles.infoGrid}>
                    {FIELDS.map(({ name, label, fullWidth,type }) => (
                        <div key={name} className={itemClass(fullWidth)}>
                            <label>{label}</label>
                            <p>{type === 'date' ? formatDateForDisplay(account[name]) : (account[name] || 'N/A')}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Backend DateTime arrives as "2012-05-14T00:00:00" (optionally with "Z" or an offset).
// <input type="date"> only accepts "yyyy-MM-dd"; anything else renders as empty.
const toDateInputValue = (value?: string | null): string =>
    value ? value.slice(0, 10) : '';

// Read-only view: build the Date from its parts so the day can't shift with timezone
const formatDateForDisplay = (value?: string | null): string => {
    if (!value) return 'N/A';
    const [y, m, d] = value.slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString();
};

export default PersonalInfo


