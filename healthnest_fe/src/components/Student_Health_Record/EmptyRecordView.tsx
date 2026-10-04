import { Link } from "react-router-dom";

const EmptyRecordView = () => {
  return (
    <div className="medical-record-view-group">
      <h1>You don't have your student health record yet</h1>
      <p>Please click the button below to create a new record</p>
      <Link to="/createStudentHealthRecord" className="create-record-button">
        Create
      </Link>
    </div>
  );
};

export default EmptyRecordView;
