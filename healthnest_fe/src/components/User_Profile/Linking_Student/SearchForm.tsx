import { IconSearch } from "../../IconList";
import styles from '../../../CSS/Parent/LinkingWithStudent.module.css'

interface SearchFormProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onSearch: (e: React.FormEvent) => void;
}

const SearchForm = ({ searchTerm, setSearchTerm, onSearch }: SearchFormProps) => (
    <form className={styles.searchFormContainer} onSubmit={onSearch}>
        <div className={styles.searchInputWrapper}>
            <div className={styles.searchInputIcon}>
                <IconSearch />
            </div>
            <input
                type="text"
                className={styles.searchInput}
                placeholder="Search by student name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <button type="submit" className="button button-primary">
            <IconSearch className={styles.icon} />
            Search
        </button>
    </form>
);

export default SearchForm;