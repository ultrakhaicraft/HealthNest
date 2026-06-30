import { useState, useEffect } from "react";
import UpdateRequestModal from "../../../components/MedicineRequest/UpdateRequestModal"
import { MedicineRequestResponseDto, MedicineRequestService, MedicineUpdateCreation } from "../../../feature/API/MedicineRequestService";
import Modal from "../../../components/GenericModal";

interface UpdateMedicineRequestProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
}

const UpdateMedicineRequest = ({ isOpen, onClose, requestId }: UpdateMedicineRequestProps) => {
  const [initialData, setInitialData] = useState<MedicineUpdateCreation | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        console.log("Fetching request details for ID:", requestId);
        const data: MedicineRequestResponseDto = await MedicineRequestService.getById(requestId);
        // Transform to update format
        const updateData: MedicineUpdateCreation = {
          requestBy: data.requestBy,
          forStudent: data.forStudent,
          description: data.description,
        };
        setInitialData(updateData);
        console.log("Fetched request data for update:", updateData);
      } catch (error) {
        console.error("Failed to fetch request details", error);
      }
    };

    if (isOpen && requestId) {
      fetchRequest();
    }
  }, [isOpen, requestId]);

  const handleSubmit = async (formData: MedicineUpdateCreation) => {
    try {
      await MedicineRequestService.update(requestId, formData);
      console.log("Request updated successfully");
      onClose(); // Close modal
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  return (
    <>
    {isOpen && (
      initialData ? (
        <UpdateRequestModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleSubmit}
          initialData={initialData}
        />
      ) : (
        <Modal title="Loading..." onClose={onClose}>
          <div className="p-4">Loading request details...</div>
        </Modal>
      )
    )}
  </>
  );
};

export default UpdateMedicineRequest;