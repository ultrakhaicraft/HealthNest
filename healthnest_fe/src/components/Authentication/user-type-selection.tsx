import registerStyles from '../../CSS/Guest/AuthLayout.module.css';
import inputStyles from '../../CSS/InputField.module.css';

interface UserTypeSelectionProps {
    onSelectUserType: (userType: string) => void;
    navigate: (path: number) => void;
}

export const UserTypeSelection =({onSelectUserType, navigate}: UserTypeSelectionProps)=>{

    const onBack = () => {
        // Navigate back to the previous page
        navigate(-1);
    }

    return (
        <div className={registerStyles.userTypeSelection}>
            <div className='header'>
                <button type='button' className={`button-secondary button ${registerStyles.backBtn}`} onClick={onBack}>
                    ← Back
                </button>            
            </div>
            <div className={registerStyles.textGroup}>
                <h1>Choose Registration Type</h1>
                <p>Are you a parent or a student?</p>
            </div>
            <div className={registerStyles.selectionButtons}>
                <button 
                    type='button' 
                    className='button-primary button parent-btn'
                    onClick={() => onSelectUserType('parent')}
                >
                    Register as Parent
                </button>
                <button 
                    type='button' 
                    className='button-primary button student-btn'
                    onClick={() => onSelectUserType('student')}
                >
                    Register as Student
                </button>
            </div>
        </div>
    );
}