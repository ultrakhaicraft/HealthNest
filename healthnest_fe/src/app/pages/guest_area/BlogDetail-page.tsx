import Footer from "../../../components/Landing_Page/footer";
import HomepageNavBar from "../../../components/Landing_Page/homepage-nav-bar";
import "../../CSS/BlogDetail.css";



interface Author {
  name: string;
  avatarUrl: string;
}

interface RelatedArticle {
  id: number;
  title: string;
  imageUrl: string;
}

interface BlogPost {
  id: number;
  title: string;
  synopsis: string;
  author: Author;
  publishDate: string;
  imageUrl: string;
  content: string[];
  relatedArticles: RelatedArticle[];
}




// --- Mock Data ---
const blogData: BlogPost[] = [
    {
        id: 1,
        title: "Understanding Children's Mental Health in a School Environment",
        synopsis: "Learn about the importance of mental health awareness in schools and how parents can support their children's emotional well-being during their academic journey.",
        author: {
            name: 'Dr. Michael Chen',
            avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop'
        },
        publishDate: '2025-05-18',
        imageUrl: 'https://images.unsplash.com/photo-1573164574572-5135d249b2b6?q=80&w=2069&auto=format&fit=crop',
        content: [
            "The importance of mental health awareness in schools has become increasingly recognized as we understand its profound impact on a child's overall development. A positive school environment not only fosters academic success but also nurtures emotional resilience, social skills, and overall well-being. Prioritizing mental health in educational settings lays the foundation for early identification and intervention of potential mental health concerns.",
            "Schools play a vital role in creating a supportive atmosphere where students feel safe to express their emotions and seek help without stigma. By integrating social-emotional learning (SEL) into the curriculum, schools can equip students with essential life skills such as self-awareness, self-management, responsible decision-making, relationship skills, and social awareness. These skills are crucial for navigating the challenges of childhood and adolescence.",
            "Parental involvement is equally critical. Open communication at home, where children are encouraged to share their feelings and experiences, is fundamental. Parents can collaborate with teachers and school counselors to monitor their child's emotional state and address any emerging issues promptly. By working together, parents and educators can create a cohesive support system that ensures children thrive both academically and emotionally."
        ],
        relatedArticles: [
            { id: 2, title: "Healthy Eating Habits for School Children", imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop" },
            { id: 3, title: "Creating Healthy Sleep Routines", imageUrl: "https://images.unsplash.com/photo-1595393490195-275b5b827725?q=80&w=2070&auto=format&fit=crop" }
        ]
    }
];


export default function BogDetailPage() {
    
    const currentPost = blogData[0];
    return (
        <div className="app-shell">
            <HomepageNavBar />
            <BlogPage post={currentPost} />
            <Footer />
        </div>
    );
}

// --- Page & Layout Components ---
const BlogPage = ({ post }: { post: BlogPost }) => {
    return (
        <div className="page-container">
            <Breadcrumb title={post.title} />
            <div className="blog-post-container">
                <img src={post.imageUrl} alt={post.title} className="blog-image" />
                <BlogHeader title={post.title} synopsis={post.synopsis} />
                <BlogContent content={post.content} author={post.author} publishDate={post.publishDate} />
            </div>
            <RelatedArticles articles={post.relatedArticles} />
        </div>
    );
};

const Breadcrumb = ({ title }: { title: string }) => (
            <nav className="breadcrumb">
                <a href="#">Medical Blog</a>
                <span>&gt;</span>
                <span>{title}</span>
            </nav>
        );

const BlogHeader = ({ title, synopsis }: { title: string; synopsis: string }) => (
    <header className="blog-header">
        <h1>{title}</h1>
        <p>{synopsis}</p>
    </header>
);

const BlogContent = ({
  content,
  author,
  publishDate,
}: {
  content: string[];
  author: Author;
  publishDate: string;
}) => (
  <article className="blog-content">
    {content.map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ))}

    <div className="highlight-box">
      <strong>Remember:</strong> Creating a supportive environment at home is just as important. Healthy habits, open communication, and professional support are key pillars for a child's mental well-being.
    </div>

    <BlogMeta author={author} publishDate={publishDate} />
  </article>
);

const BlogMeta = ({ author, publishDate }: { author: Author; publishDate: string }) => (
  <footer className="blog-meta">
    <img src={author.avatarUrl} alt={author.name} className="author-avatar" />
    <div className="author-info">
      <div className="author-name">{author.name}</div>
      <div className="publish-date">
        Published on{" "}
        {new Date(publishDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  </footer>
);

const RelatedArticles = ({ articles }: { articles: RelatedArticle[] }) => (
  <section className="related-articles-section">
    <h2>Related Articles</h2>
    <div className="related-articles-grid">
      {articles.map((article) => (
        <a href="#" key={article.id} className="related-article-card">
          <img src={article.imageUrl} alt={article.title} className="related-article-image" />
          <div>
            <h3 className="related-article-title">{article.title}</h3>
          </div>
        </a>
      ))}
    </div>
  </section>
);

