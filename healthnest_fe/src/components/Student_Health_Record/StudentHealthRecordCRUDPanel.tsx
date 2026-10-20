import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StudentHealthRecordService } from "../../feature/API/StudentHealthRecordService";
import { StudentHealthRecordQuery, StudentHealthRecordViewModel } from "../../models/StudentHealthRecordModel";
import styles from "../../CSS/Nurse/NurseCRUDPanel.module.css";
import { IconDelete, IconEdit, IconFilter, IconPlus, IconView } from "../IconList";
import { MedicineRequestFilter } from "../MedicineRequest/nurse/MedicineRequestFilter";
import { PaginationControls } from "../PaginationControls";
import { StatusBadge } from "../StatusBadge";
import { StudentHealthRecordFilter } from "./StudentHealthRecordFilter";
import { UserRole } from "../../feature/Constant";

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export interface FilterState {
  value: StudentHealthRecordQuery;
  show: boolean;
  onToggle: () => void;
  onApply: (filters: StudentHealthRecordQuery) => void;
  onClear: () => void;
}

export interface StudentHealthRecordCRUDPanelProps {
  studentHealthRecordData: StudentHealthRecordViewModel[];
  loading: boolean;
  pagination: PaginationState;
  filterState: FilterState;
  onView: (id: string) => void;
  onEdit: (studentHealthRecord: StudentHealthRecordViewModel) => void;
  userRole: string;
  onCreate: () => void;
  onDelete: (studentHealthRecordId: string) => void;
}

const StudentHealthRecordViewPanel = ({ 
    studentHealthRecordData = [], loading, pagination, filterState, userRole,
    onView, onEdit, onCreate, onDelete
}: StudentHealthRecordCRUDPanelProps) => {
  console.log(studentHealthRecordData);

  return (
    <div className={styles.crudContainer}>
      <div className={styles.crudHeader}>
        <div>
          <h2 className={styles.crudTitle}>Student Health Record View Panel</h2>
          <p className={styles.crudSubtitle}>View your child health record</p>
        </div>
        {/* .crudActions is display:flex + gap:0.5rem, same as the old inline style */}
        <div className={styles.crudActions}>

          

          {/* button classes are not in the module, so they stay global */}
          <button className="button button-secondary button-large" onClick={filterState.onToggle}>
            <IconFilter />
            {filterState.show ? 'Hide Filters' : 'Show Filters'}
          </button>

          {userRole==UserRole.Nurse && (
            <button className="button button-primary button-large" onClick={onCreate}>
              <IconPlus />
              Create Medicine
            </button>
          )}
        </div>
      </div>
      
      {filterState.show && (
        <StudentHealthRecordFilter 
          userRole={userRole}
          filters={filterState.value}
          onApplyFilters={filterState.onApply}
          onClearFilters={filterState.onClear}
        />
      )}
      
      <div className={styles.crudTableWrapper}>
        <div className={styles.crudTableInfo}>
          <span>Total: {pagination.totalItems} items</span>
          <span>Page {filterState.value.pageNumber || 1} of {pagination.totalPages}</span>
        </div>
        <table className={styles.crudTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Created By</th>
              <th>Created Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className={styles.loadingBox}>
                  Loading medicine requests...
                </td>
              </tr>
            )}
            {studentHealthRecordData.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className={styles.loadingBox}>
                  No student health record found
                </td>
              </tr>
            )}
            {studentHealthRecordData.map(request => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.studentName}</td>
                <td>{request.createdBy}</td>
                <td>{new Date(request.createdDateTime).toLocaleDateString()}</td>
                <td><StatusBadge status={request.status ?? ""} /></td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton} onClick={() => onView(request.id)} disabled={loading}>
                      <IconView />
                    </button>
                    {userRole== UserRole.Nurse &&(
                      <>
                      <button className={styles.actionButton} onClick={() => onEdit(request)} disabled={loading}>
                      <IconEdit />
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.actionDelete}`}
                      onClick={() => onDelete(request.id)}
                      disabled={loading}
                    >
                      <IconDelete />
                    </button></>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <PaginationControls 
          currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
        />
      </div>
    </div>
  );
};

export default StudentHealthRecordViewPanel;
