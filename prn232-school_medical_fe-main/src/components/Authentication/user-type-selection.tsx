
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
        <div className='user-type-selection'>
            <div className='header'>
                <button type='button' className='primary-btn back-btn' onClick={onBack}>
                    ← Back
                </button>            
            </div>
            <div className="text-group">
                <h1>Choose Registration Type</h1>
                <p>Are you a parent or a student?</p>
            </div>
            <div className='selection-buttons'>
                <button 
                    type='button' 
                    className='primary-btn parent-btn'
                    onClick={() => onSelectUserType('parent')}
                >
                    Register as Parent
                </button>
                <button 
                    type='button' 
                    className='primary-btn student-btn'
                    onClick={() => onSelectUserType('student')}
                >
                    Register as Student
                </button>
            </div>
        </div>
    );
}