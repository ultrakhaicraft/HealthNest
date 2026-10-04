import styles from "../app/CSS/CRUDStatusBadge.module.css";

interface StatusBadgeProps {
  status: string;
}


// Status Badge Component
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active':
        return `${styles.statusBadgeActive}`;
      case 'Inactive':
        return `${styles.statusBadgeInactive}`;
      case 'Completed':
        return `${styles.statusBadgeResolved}`;
      case 'Pending':
        return `${styles.statusBadgePending}`;
      case 'Cancelled':
        return `${styles.statusBadgeCancelled}`
      case 'Available':
        return `${styles.statusBadgeActive}`;
      case 'Unavailable':
        return `${styles.statusBadgeInactive}`;
      default:
        return `${styles.statusBadgeActive}`; // Default to active if status is unknown
    }
  };
  
  return <span className={`${styles.statusBadge} ${getStatusClass(status)}`}>{status}</span>;
};