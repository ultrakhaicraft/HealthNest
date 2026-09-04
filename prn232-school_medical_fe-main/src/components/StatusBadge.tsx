interface StatusBadgeProps {
  status: string;
}


// Status Badge Component
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-badge-active';
      case 'Inactive':
        return 'status-badge-inactive';
      case 'Completed':
        return 'status-badge-resolved';
      case 'Pending':
        return 'status-badge-pending';
      case 'Available':
        return 'status-badge-active';
      case 'Unavailable':
        return 'status-badge-inactive';
      default:
        return 'status-badge-active'; // Default to active if status is unknown
    }
  };
  
  return <span className={`status-badge ${getStatusClass(status)}`}>{status}</span>;
};