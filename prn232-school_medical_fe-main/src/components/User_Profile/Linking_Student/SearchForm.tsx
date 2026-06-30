import { IconSearch } from "../../IconList";

interface SearchFormProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onSearch: (e: React.FormEvent) => void;
}

const SearchForm = ({ searchTerm, setSearchTerm, onSearch }: SearchFormProps) => (
    <form className="search-form-container" onSubmit={onSearch}>
        <div className="search-input-wrapper">
            <div className="search-input-icon">
                <IconSearch />
            </div>
            <input
                type="text"
                className="search-input"
                placeholder="Search by student name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <button type="submit" className="button button-primary">
            <IconSearch className="icon" />
            Search
        </button>
    </form>
);

export default SearchForm;