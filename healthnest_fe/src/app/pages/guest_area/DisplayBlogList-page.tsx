import { useState } from "react";
import Footer from "../../../components/Landing_Page/footer";
import HomepageNavBar from "../../../components/Landing_Page/homepage-nav-bar";
import { IconCalendar, IconFilter, IconPageBack, IconPageNext, IconSearch } from "../../../components/IconList";
import "../../CSS/ViewBlogs.css";

// --- Types ---
interface Author {
    name: string;
    avatarUrl: string;
}

interface Article {
    id: number;
    category: string;
    title: string;
    excerpt: string;
    author: Author;
    date: string;
    readTime: string;
    views: string;
    imageUrl: string;
}

interface ArticleGridProps {
    articles: Article[];
}

interface ArticleCardProps {
    article: Article;
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number | ((prev: number) => number)) => void;
}

// --- Mock Data ---
const articlesData: Article[] = [
    {
        id: 1,
        category: 'Nutrition',
        title: 'Healthy Eating Habits for School Children',
        excerpt: 'Discover essential nutrition tips to keep your child energized and focused throughout the school day.',
        author: {
            name: 'Dr. Sarah Williams',
            avatarUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
        },
        date: 'May 16, 2025',
        readTime: '5 min read',
        views: '1.2k views',
        imageUrl: 'https://images.unsplash.com/photo-1542868275-632b63868113?q=80&w=2070&auto=format&fit=crop',
    },
    // ... other articles ...
];

// --- Main App Component ---
export default function DisplayBlogsPage() {
    return (
        <div className="app-shell">
            <HomepageNavBar />
            <BlogListPage />
            <Footer />
        </div>
    );
}

// --- Page & Layout Components ---
const BlogListPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages = 3;

    return (
        <div className="page-container">
            <header className="page-header">
                <h1>Medical Blog</h1>
                <p>Stay informed with the latest health tips, medical insights, and wellness advice from our certified medical professionals.</p>
            </header>
            <SearchFilterBar />
            <div className="latest-articles-header">
                <h2>Latest Articles</h2>
                <span className="results-count">24 articles found</span>
            </div>
            <ArticleGrid articles={articlesData} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

const SearchFilterBar = () => (
    <div className="filter-bar">
        <div className="search-input-wrapper">
            <div className="search-input-icon">
                <IconSearch />
            </div>
            <input type="text" className="search-input" placeholder="Search articles..." />
        </div>
        <div className="filter-controls">
            <select className="category-select">
                <option>All Categories</option>
                <option>Nutrition</option>
                <option>First Aid</option>
                <option>Physical Health</option>
                <option>Mental Health</option>
            </select>
            <button className="button button-primary">
                <IconFilter className="icon" />
                Filter
            </button>
        </div>
    </div>
);

const ArticleGrid = ({ articles }: ArticleGridProps) => (
    <div className="article-grid">
        {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
        ))}
    </div>
);

const ArticleCard = ({ article }: ArticleCardProps) => (
    <a href="#" className="article-card">
        <img src={article.imageUrl} alt={article.title} className="article-image" />
        <div className="article-content">
            <p className="article-category">{article.category}</p>
            <h3 className="article-title">{article.title}</h3>
            <p className="article-excerpt">{article.excerpt}</p>
            <div className="article-meta">
                <div className="meta-item">
                    <img src={article.author.avatarUrl} alt={article.author.name} className="author-avatar-small" />
                    <span>{article.author.name}</span>
                </div>
                <div className="meta-item">
                    <IconCalendar />
                    <span>{article.date}</span>
                </div>
            </div>
        </div>
    </a>
);

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    return (
        <nav className="pagination-container">
            <button className="pagination-arrow" onClick={() => onPageChange(p => Math.max(1, typeof p === 'function' ? p(currentPage) : p - 1))} disabled={currentPage === 1}>
                <IconPageBack />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}
            <button className="pagination-arrow" onClick={() => onPageChange(p => Math.min(totalPages, typeof p === 'function' ? p(currentPage) : p + 1))} disabled={currentPage === totalPages}>
                <IconPageNext />
            </button>
        </nav>
    );
};
