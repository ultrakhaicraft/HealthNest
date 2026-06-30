
import { useState } from 'react';
import { 
  IconEdit,
  IconPerson
} from '../../components/IconList';
import { AccountDetail, AccountUpdateData } from '../../feature/API/AccountService';
import { IPersonalInfo } from '../../app/pages/ParentUserProfile-Page';

interface PersonalInfoProp{
    account: AccountDetail;
    onUpdate:(PersonalInfo:IPersonalInfo) => void;
    isEditMode: boolean;
    setIsEditMode:React.Dispatch<React.SetStateAction<boolean>>;
    formData: IPersonalInfo;
    setFormData: React.Dispatch<React.SetStateAction<IPersonalInfo>>;
}


const PersonalInfo = ({ account, onUpdate,isEditMode,setIsEditMode,formData,setFormData} : PersonalInfoProp) => {

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault(); // prevent default form submission
    const newData: IPersonalInfo = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
    };
    onUpdate(newData);
};

   
    
    const handleCancel = () => {
        // Reset form to original account data
        setFormData({
            fullName: account.fullName,
            email: account.email,
            phone: account.phoneNumber,
            address: account.address,
        });
        setIsEditMode(false);
    };

    return (
        <div className="info-card">
            <div className="info-card-header">
                <h2 className="info-card-title"><IconPerson className="icon" /> Personal Information</h2>
                {!isEditMode && (
                    <button className="edit-button" onClick={() => setIsEditMode(true)}>
                        <IconEdit className="icon" /> Edit
                    </button>
                )}
            </div>
            
            {isEditMode ? (
                <form onSubmit={handleSaveChanges}>
                    <div className="info-grid">
                        <div className="info-item">
                            <label className="input-label" htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className="input-field" />
                        </div>
                        <div className="info-item">
                            <label className="input-label" htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field" />
                        </div>
                        <div className="info-item">
                            <label className="input-label" htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" />
                        </div>              
                        <div className="info-item full-width">
                            <label className="input-label" htmlFor="address">Address</label>
                            <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className="input-field" />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                        <button className="button button-primary" type='submit'>Save Changes</button>
                    </div>
                </form>
            ) : (
                <div className="info-grid">
                    <div className="info-item">
                        <label>Full Name</label>
                        <p>{account.fullName}</p>
                    </div>
                    <div className="info-item">
                        <label>Email Address</label>
                        <p>{account.email}</p>
                    </div>
                    <div className="info-item">
                        <label>Phone Number</label>
                        <p>{account.phoneNumber}</p>
                    </div>                     
                    <div className="info-item full-width">
                        <label>Address</label>
                        <p>{account.address}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalInfo


