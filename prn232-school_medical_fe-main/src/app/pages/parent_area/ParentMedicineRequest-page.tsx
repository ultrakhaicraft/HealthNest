import React, { useEffect } from 'react';

import Footer from '../../../components/Landing_Page/footer';
import UserHomeNavBar from '../../../components/User_homepage/horizontal-nav-bar';

import '../../CSS/MedicineRequest.css';
import MedicineRequestPage from '../../../components/MedicineRequest/MedicineRequestPage';
import { MedicineRequestResponseDto, MedicineRequestService } from '../../../feature/API/MedicineRequestService';
import UpdateMedicineRequest from './UpdateMedicineRequest';



// Main Medicine Request Component
export default function ParentMedicineRequestView() {
    const [medicineRequests, setMedicineRequests] = React.useState<MedicineRequestResponseDto[]>([

    ]);

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null);


    useEffect(() => {
        const fetchMedicineRequests = async () => {
            const parentId = localStorage.getItem('userId');
            if (!parentId) {
                console.error("Parent ID not found in local storage");
                return;
            }
            try {
                const response = await MedicineRequestService.getByRequesterId(parentId);
                console.log("Fetched medicine requests:", response);
                console.log("Medicine requests data:", response.data);
                setMedicineRequests(response.data);
            } catch (error) {
                console.error("Error fetching medicine requests:", error);
            }
        }
        fetchMedicineRequests();


    }, [])

    const openModal = (requestId: string) => {
        console.log("Opening modal for request ID:", requestId);
        setSelectedRequestId(requestId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequestId(null);
    };

    return (
        <div className="app-shell">
            <UserHomeNavBar
                userType='parent' />
            <main className="main-content">
                <MedicineRequestPage requestsData={medicineRequests} openModal={openModal} />
            </main>
            <Footer />

            {isModalOpen && selectedRequestId && (
                <UpdateMedicineRequest
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    requestId={selectedRequestId}
                />
            )}
        </div>
    );
}





