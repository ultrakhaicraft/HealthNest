import { useEffect, useState } from 'react';
import { 
  IconStudent
} from '../../components/IconList'; 
import { Link } from 'react-router-dom';


interface StudentInfoProp{
    studentName: string;
    studentId: string;
}

const StudentInfo = ({ studentName, studentId } : StudentInfoProp) => {
   

    
   

  

    return (
        <div className="info-card">
            <div className="info-card-header">
                <h2 className="info-card-title"><IconStudent className="icon" /> Student Information</h2>
            </div>
            <div className="student-info-content">
                <img src='/assets/PRN_Avatar.svg' alt="Student Avatar" className="student-avatar" />
                <div className="student-details">
                    {studentId ? (
                        <>
                        <h3>{studentName}</h3>
                        <p className="student-id">Student ID: {studentId}</p>
                        </>
                    ) : (
                        <p className="student-id">No student linked to this account.</p>
                    )}
                </div>
            </div>
            <div className="info-grid" style={{marginTop: '1rem'}}>
                {studentId ? (
                    <>
                        <div className="info-item">
                            <label>Class</label>
                            <p>11-A</p>
                        </div>
                        <div className="info-item">
                            <label>Homeroom Teacher</label>
                            <p>Mikeson</p>
                        </div>
                        <div className="info-item">
                            <label>Academic Year</label>
                            <p>2024-2025</p>
                        </div>
                    </>
                ) : (
                     <div className="info-item full-width">
                        <Link to="/assignStudentToParent" className="primary-btn no-link " style={{marginTop: '1rem'}}>
                            Link your student to you here
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentInfo


