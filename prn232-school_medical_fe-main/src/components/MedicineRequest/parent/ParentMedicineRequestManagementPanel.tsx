import { IconView, IconEdit, IconFilter, IconPlus, IconDelete } from "../../IconList";
import { PaginationControls } from "../../PaginationControls";
import { StatusBadge } from "../../StatusBadge";
import { MedicineRequestFilter } from "../nurse/MedicineRequestFilter";
import { MedicineRequestCRUDPanelProps } from "../nurse/MedicineRequestManagementPanel";
import "../../../app/CSS/Nurse/NurseCRUDPanel.css"


export const ParentMedicineRequestManagementPanel = ({
  medicineRequestData = [], loading, pagination, filterState, userRole,
  onView, onEdit, onCreate, onDelete
}: MedicineRequestCRUDPanelProps) => {
  return (
    <div className="crud-container">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">Medicine Request Management Panel</h2>
          <p className="crud-subtitle">Manage your own medicine request to your children such as View, Create, Update and Delete</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="button button-secondary button-small" onClick={filterState.onToggle}>
            <IconFilter />
            {filterState.show ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button className="button button-primary button-small" onClick={onCreate}>
            <IconPlus />
            Create a Medical Request item
          </button>
        </div>
      </div>

      {filterState.show && (
        <MedicineRequestFilter
          userRole={userRole}
          filters={filterState.value}
          onApplyFilters={filterState.onApply}
          onClearFilters={filterState.onClear}
        />
      )}

      <div className="crud-table-wrapper">
        <div className="crud-table-info">
          <span>Total: {pagination.totalItems} items</span>
          <span>Page {filterState.value.PageIndex || 1} of {pagination.totalPages}</span>
        </div>
        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Requested By</th>
              <th>For Student</th>
              <th>Date Sent</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  Loading medicine requests...
                </td>
              </tr>
            )}
            {medicineRequestData.length === 0 && !loading && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  No medicine requests found
                </td>
              </tr>
            )}
            {medicineRequestData.map(request => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.requestByName}</td>
                <td>{request.forStudentName}</td>
                <td>{new Date(request.dateSent).toLocaleDateString()}</td>
                <td><StatusBadge status={request.status} /></td>
                <td>
                  <div className="action-buttons">
                    <button className="action-button" onClick={() => onView(request.id)} disabled={loading}>
                      <IconView />
                    </button>
                    <button className="action-button" onClick={() => onEdit(request)} disabled={loading}>
                      <IconEdit />
                    </button>
                    <button className="action-button action-delete" onClick={() => onDelete(request.id)} disabled={loading}>
                      <IconDelete />
                    </button>
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


