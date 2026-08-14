import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StudentHealthRecordDetail, StudentHealthRecordService } from "../../feature/API/StudentHealthRecordService";

const StudentHealthRecordDetailDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<StudentHealthRecordDetail | null>(null);

  //TODO: Add the ability to fetch parent information from student and display.
  useEffect(() => {
    if (id) StudentHealthRecordService.getDetailById(id).then(setRecord);
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    if (!record) return;
    StudentHealthRecordService.updateStatus(record.id, newStatus).then(() =>
      setRecord({ ...record, status: newStatus })
    );
  };

  if (!record) return <p>Loading...</p>;

  return (
    
    <div className="record-detail">
      <h2>{record.studentName}'s Health Record</h2>
      <p>Height: {record.height} cm</p>
      <p>Allergies: {record.allergies}</p>
      <p>Chronic Diseases: {record.chronicDiseases}</p>
      <p>Vision: {record.vision}</p>
      <p>Hearing: {record.hearing}</p>
      <p>Status: {record.status}</p>

      <div className="actions">
        <button onClick={() => handleStatusChange("Approved")}>Approve</button>
        <button onClick={() => handleStatusChange("Rejected")}>Reject</button>
      </div>

      <Link to="/nurse/records">Back to list</Link>
    </div>
  );
};

export default StudentHealthRecordDetailDisplay;
