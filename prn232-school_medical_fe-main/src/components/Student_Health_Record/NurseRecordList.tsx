import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StudentHealthRecordDetail, getAllStudentRecords, updateRecordStatus } from "../../feature/API/StudentHealthRecordService";

const NurseRecordList = () => {
  const [records, setRecords] = useState<StudentHealthRecordDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllStudentRecords().then(setRecords).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = (id: number, newStatus: string) => {
    updateRecordStatus(id, newStatus).then(() =>
      setRecords(prev => prev.map(r => (r.id === id ? { ...r, status: newStatus } : r)))
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!records.length) return <p>No student health records found.</p>;

  return (
    <div className="record-list">
      <h2>Student Health Records</h2>
      <table className="record-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Parent</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              <td>{record.studentName}</td>
              <td>{record.parentName}</td>
              <td>{record.status}</td>
              <td>
                <Link to={`/nurse/records/${record.id}`}>View</Link>
                <button onClick={() => handleStatusChange(record.id, "Approved")}>Approve</button>
                <button onClick={() => handleStatusChange(record.id, "Rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NurseRecordList;
