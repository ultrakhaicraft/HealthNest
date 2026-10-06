import styles from "../CSS/Components/Pagination.module.css";


interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({ currentPage, totalPages, onPageChange }: PaginationControlsProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={styles.paginationControls}>
      <button 
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      {getPageNumbers().map(pageNum => (
        <button
          key={pageNum}
          className={`${styles.paginationButton} ${pageNum === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}
      
      <button
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};