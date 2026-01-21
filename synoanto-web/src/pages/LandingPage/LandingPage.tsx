import { useState } from 'react';
import './LandingPage.css';

interface LandingPageProps {
    onExplore?: (searchTerm: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onExplore }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim() && onExplore) {
            onExplore(searchTerm.trim());
        }
    };

    const handleTagClick = (word: string) => {
        setSearchTerm(word);
        if (onExplore) {
            onExplore(word);
        }
    };

    return (
        <div className="landing-page">
            {/* Header */}
            <header className="landing-header">
                <div className="landing-logo">
                    <span className="logo-syno">Syno</span>
                    <span className="logo-anto">Anto</span>
                </div>
                <nav className="landing-nav">
                    <a href="#explore" className="nav-link">Explore Galaxy</a>
                    <a href="#stats" className="nav-link">Stats</a>
                    <a href="#learn" className="nav-link">Learn</a>
                    <a href="#community" className="nav-link">Community</a>
                </nav>
                <div className="nav-separator"></div>
                <button className="login-btn">Log in</button>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        See how words relate, <strong>differ</strong>,
                        <br />
                        and are actually used.
                    </h1>

                    <form className="hero-search" onSubmit={handleSearch}>
                        <div className="search-input-wrapper">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search a word"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="explore-btn">
                                Explore Galaxy
                            </button>
                        </div>
                    </form>

                    <div className="search-tags">
                        {['love', 'efficient', 'awkward', 'cherish'].map((tag) => (
                            <button
                                key={tag}
                                className="search-tag"
                                onClick={() => handleTagClick(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Word Galaxy Visualization with Connection Lines */}
                <div className="hero-galaxy">
                    <div className="galaxy-container">
                        {/* SVG Connection Lines */}
                        <svg className="galaxy-lines" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid meet">
                            {/* Lines from center (250, 200) to each word */}
                            <line className="connection-line" x1="250" y1="200" x2="175" y2="50" />   {/* Cherish */}
                            <line className="connection-line" x1="250" y1="200" x2="100" y2="100" />  {/* adore */}
                            <line className="connection-line" x1="250" y1="200" x2="425" y2="60" />   {/* adhor */}
                            <line className="connection-line" x1="250" y1="200" x2="450" y2="100" />  {/* treasure */}
                            <line className="connection-line" x1="250" y1="200" x2="50" y2="160" />   {/* tate */}
                            <line className="connection-line" x1="250" y1="200" x2="80" y2="250" />   {/* sheatre */}
                            <line className="connection-line" x1="250" y1="200" x2="420" y2="200" />  {/* dig */}
                            <line className="connection-line" x1="250" y1="200" x2="400" y2="300" />  {/* lofhole */}
                            <line className="connection-line" x1="250" y1="200" x2="180" y2="340" />  {/* brtos */}
                        </svg>

                        {/* Center word */}
                        <div className="galaxy-word center-word">
                            <span>love</span>
                        </div>

                        {/* Related words in bubbles */}
                        <div className="galaxy-word word-cherish">
                            <span>Cherish</span>
                        </div>
                        <div className="galaxy-word word-adore">
                            <span>adore</span>
                        </div>
                        <div className="galaxy-word word-adhor">
                            <span>adhor</span>
                        </div>
                        <div className="galaxy-word word-treasure">
                            <span>treasure</span>
                        </div>
                        <div className="galaxy-word word-tate">
                            <span>tate</span>
                        </div>
                        <div className="galaxy-word word-sheatre">
                            <span>sheatre</span>
                        </div>
                        <div className="galaxy-word word-dig">
                            <span>dig</span>
                        </div>
                        <div className="galaxy-word word-lofhole">
                            <span>lofhole</span>
                        </div>
                        <div className="galaxy-word word-brtos">
                            <span>brtos</span>
                        </div>

                        {/* Decorative bubbles */}
                        <div className="bubble bubble-1"></div>
                        <div className="bubble bubble-2"></div>
                        <div className="bubble bubble-3"></div>
                        <div className="bubble bubble-4"></div>
                        <div className="bubble bubble-5"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="feature-card">
                    <div className="feature-icon icon-trends">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                        </svg>
                    </div>
                    <div className="feature-content">
                        <h3>Track Usage Trends</h3>
                        <p>See absolutely clearly your proficiency and maximize clarity in context.</p>
                    </div>
                </div>

                <div className="feature-card">
                    <div className="feature-icon icon-compare">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 12h8M12 8v8" />
                        </svg>
                    </div>
                    <div className="feature-content">
                        <h3>Compare Meanings</h3>
                        <p>Understand real nuances and effects across tone and context.</p>
                    </div>
                </div>

                <div className="feature-card">
                    <div className="feature-icon icon-vocabulary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                    </div>
                    <div className="feature-content">
                        <h3>Build Your Vocabulary</h3>
                        <p>Build your foundational skills or stretch higher. Track usage and growth.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section - Text Only, No Button */}
            <section className="cta-section">
                <p className="cta-text">
                    <strong>Discover connections</strong>, refine your vocabulary, and watch your
                    <br />
                    understanding grow.
                </p>
            </section>
        </div>
    );
};

export default LandingPage;
