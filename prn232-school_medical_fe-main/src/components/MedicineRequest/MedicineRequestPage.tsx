import { Link } from "react-router-dom";
import { MedicineRequestResponseDto } from "../../feature/API/MedicineRequestService";
import { IconMedicineBottle, IconPlus, IconHistory, IconView, IconEdit, IconCalendar, IconStatus } from "../IconList";

const MedicineRequestPage = ({ requestsData,openModal }: RequestPageListProps) => {
    return (
        <div className="page-container">
            <div className="page-title-section">
                <div className="page-title-icon-wrapper">
                    <IconMedicineBottle className="icon-small" />
                </div>
                <h1 className="page-title">Medicine Request</h1>
                <p className="page-subtitle">Submit a request for medicine to be administered to your child at school</p>

                <Link className="button button-primary create-request-button no-link" to="/createMedicineRequest">
                    <IconPlus className="icon" />
                    Create a Medicine Request
                </Link>
            </div>
            <RequestList requestsData={requestsData} openModal={openModal}/>
        </div>
    );
};

export interface RequestPageListProps {
    requestsData: MedicineRequestResponseDto[];
    openModal: (requestId: string) => void;
}

const RequestList = ({ requestsData, openModal }: RequestPageListProps) => {
    console.log("Request List Data:", requestsData);    
    return (
        <div className="request-list-container">
            <div className="request-list-header">
                <IconHistory className="icon" />
                <h2>Previous Medicine Requests</h2>
                <p>View and track your submitted medicine requests</p>
            </div>
            {requestsData &&
                requestsData.length > 0 ? (
                    <div className="request-cards">
                        {requestsData.map((request) => (
                            <RequestCard key={request.id} request={request} openModal={openModal} />
                        ))}
                    </div>
                ) : (
                    <p className="no-requests-message">No medicine requests found !!</p>
                )
            }
        </div>
    );
};

export interface RequestCardProps {
    request: MedicineRequestResponseDto;
    openModal: (requestId: string) => void;
}


const RequestCard = ({ request, openModal }: RequestCardProps) => {
    const statusClass = `status-${request.status.toLowerCase()}`;
    
    return (
        <div className={`request-card ${statusClass}`}>
            <div className="card-main-content">
                <div className="card-icon-wrapper">
                    <IconMedicineBottle className="icon" />
                </div>
                <div className="card-details">
                    <div className="card-title-line">
                        <h3>Request Medicine</h3>
                        <StatusBadge status={request.status} />
                    </div>
                    <p className="card-description">{request.description}</p>
                </div>
                <div className="card-actions">
                    {request.status === 'Approved' && <><button className="action-button"><IconView className="icon" /></button><button onClick={() => openModal(request.id)} className="action-button"><IconEdit className="icon" /></button></>}
                    {request.status === 'Pending' && <><button className="action-button"><IconView className="icon" /></button><button onClick={() => openModal(request.id)} className="action-button"><IconEdit className="icon" /></button></>}
                    {request.status === 'Rejected' && <><button className="action-button"><IconView className="icon" /></button><button onClick={() => openModal(request.id)} className="action-button"><IconEdit className="icon" /></button></>}
                </div>
            </div>
            <div className="card-footer">
                <div className="footer-item">
                    <IconCalendar className="icon" />
                    <span>Date Sent: {request.dateSent}</span>
                </div>
                <div className="footer-item">
                    <IconStatus className="icon" />
                    <span>
                        {request.status === 'Completed' ? 'Completed:' : 'Status Updated:'}
                    </span>
                </div>
            </div>
        </div>
    );
};





const StatusBadge = ({ status }: any) => {
    const statusClass = `status-badge-${status.toLowerCase()}`;
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
}

export default MedicineRequestPage;
