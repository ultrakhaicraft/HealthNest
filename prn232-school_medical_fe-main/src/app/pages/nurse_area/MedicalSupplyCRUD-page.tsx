import { useState } from "react";
import { MedicalSupplyViewModel, MedicalSupplyQuery } from "../../../feature/API/MedicalSupplyService";

export default function MedicalSupplyCRUDPage() {
    const [medicalSuppliesData, setMedicalSuppliesData] = useState<MedicalSupplyViewModel[]>([]);
    const [selectedMedicalSupply, setSelectedMedicalSupply] = useState<MedicalSupplyViewModel | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [medicalSupplyToDelete, setMedicalSupplyToDelete] = useState<MedicalSupplyViewModel | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [medicalSupplyToEdit, setMedicalSupplyToEdit] = useState<MedicalSupplyViewModel | null>(null);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<MedicalSupplyQuery>({
    PageIndex: 1,
    PageSize: 10,
    SortByNameByDescending: true,
    IsAvailable: true,
    Name: ''
    });

    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    return (
        <>

        </>
    )
}