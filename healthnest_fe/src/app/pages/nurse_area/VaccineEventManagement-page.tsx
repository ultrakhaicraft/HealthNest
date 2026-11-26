
// Vaccine Event Management Page
// 1. Display a list of vaccine events with details such as event name, date, location, and available vaccines.
// Note: Nurse can only view the vaccine events and cannot create, edit, or delete them.
// 2. Allow nurses to view the list of students who have signed up for a particular vaccine event by clicking on the event (Redirect to a new Page). 
// The list should include student names, contact information, and vaccination status.
// 3. Allow nurses to approve or reject student sign-ups for a vaccine event.

import { useState } from "react";
import { useVaccineEvent } from "../../../feature/Hooks/VaccineEvent/useVaccineEvent";
import { VaccineEventQueryParams } from "../../../models/VaccineEventModel";
import { VaccineEventManagementPanel } from "../../../components/Vaccine_Event/VaccineEventManagementPanel";
import { Toast } from "../../../components/Notification/Toast";
import { useNavigate } from "react-router-dom";


const DEFAULT_FILTER: VaccineEventQueryParams = {
  pageIndex: 1,
  pageSize: 10,
  sortByLatestDateOccured: true,
  Status: '',
};

//Page component for managing medicine records
export default function VaccineEventManagementPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<VaccineEventQueryParams>(DEFAULT_FILTER);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });

  const vaccineEvents = useVaccineEvent(filters);
  const navigate = useNavigate();


  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleApplyFilters = (newFilters: VaccineEventQueryParams) => {
    setFilters({ ...newFilters, pageIndex: 1 }); // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, pageIndex: page }));
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTER);
  };



  

  const handleRedirectToSignUp = (eventId: string) => {
    //Pass some data info
    navigate(`/nurse/vaccine-event/${eventId}/signups`)
  }



  return (
    <>

      <VaccineEventManagementPanel
        vaccineEventData={vaccineEvents.data}
        loading={vaccineEvents.loading}
        pagination={{
          currentPage: filters.pageIndex || 1,
          totalPages: vaccineEvents.totalPages,
          totalItems: vaccineEvents.totalItems,
          onPageChange: handlePageChange,
        }}
        filterState={{
          value: filters,
          show: showFilters,
          onToggle: () => setShowFilters((s) => !s),
          onApply: handleApplyFilters,
          onClear: handleClearFilters,
        }}
        onView={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        onCreate={() => {}}
        onRefresh={() => { void vaccineEvents.refetch(); }}
        handleRedirectToSignUp={handleRedirectToSignUp}
        IsAdmin={false}
      />
      


      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
    </>
  );
}