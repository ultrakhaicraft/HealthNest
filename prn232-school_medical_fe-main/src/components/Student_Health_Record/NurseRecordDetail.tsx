import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StudentHealthRecordDetail, getStudentRecordById, updateRecordStatus } from "../../feature/API/StudentHealthRecordService";

const NurseRecordDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<StudentHealthRecordDetail | null>(null);

  useEffect(() => {
    if (id) getStudentRecordById(Number(id)).then(setRecord);
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    if (!record) return;
    updateRecordStatus(record.id, newStatus).then(() =>
      setRecord({ ...record, status: newStatus })
    );
  };

  if (!record) return <p>Loading...</p>;

  return (
    <div className="record-detail">
      <h2>{record.studentName}'s Health Record</h2>
      <p>Parent: {record.parentName}</p>
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

export default NurseRecordDetail;
