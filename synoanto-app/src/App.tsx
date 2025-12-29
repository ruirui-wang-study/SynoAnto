// Import service
import { fetchWordData, fetchWordDefinition } from '@/services/wordService';
import { useState, useEffect } from 'react';
import WordGalaxy from './features/WordGalaxy/WordGalaxy';
import type { GalaxyWord, WordData } from './types';
import './styles/global.css';
import './styles/variables.css';
import './App.css';

type AppView = 'welcome' | 'galaxy' | 'detail';

function App() {
  // Initialize state based on URL to prevent "flash" of welcome screen
  const [view, setView] = useState<AppView>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') ? 'galaxy' : 'welcome';
  });

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });

  // Dynamic Data State
  const [currentGalaxyWords, setCurrentGalaxyWords] = useState<GalaxyWord[]>([]);
  const [currentWordData, setCurrentWordData] = useState<WordData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GalaxyWord | null>(null);
  const [selectedWordDetail, setSelectedWordDetail] = useState<WordData | null>(null);

  // UI State - start loading if we have a query
  const [isLoading, setIsLoading] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return !!params.get('q');
  });
  const [error, setError] = useState<string | null>(null);

  // --- Navigation & State Management ---

  // Refactored search logic to be reusable
  const performSearch = async (term: string) => {
    if (!term.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearchQuery(term);

    try {
      const { wordData, galaxyWords } = await fetchWordData(term.trim());
      setCurrentWordData(wordData);
      setCurrentGalaxyWords(galaxyWords);
      setView('galaxy');

      // Update URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.set('q', term.trim());
      window.history.pushState({}, '', url);

    } catch (err) {
      console.error(err);
      setError('Could not find word. Please try another.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Handle URL Query Params on Mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryWord = params.get('q');
    if (queryWord) {
      performSearch(queryWord);
    }
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    performSearch(searchQuery);
  };

  // ... (handleWordClick logic remains similar, maybe update view state if we wanted deep linking for details later)

  const handleWordClick = async (word: GalaxyWord) => {
    setSelectedNode(word);

    // If it's the center word, we already have the data
    if (word.type === 'center') {
      setSelectedWordDetail(currentWordData);
      setView('detail');
      return;
    }

    // Otherwise, fetch details for the clicked word
    setIsLoading(true);
    try {
      const detail = await fetchWordDefinition(word.word);
      setSelectedWordDetail(detail);
      setView('detail');
    } catch (err) {
      console.error("Failed to fetch detail", err);
      // Fallback to basic info if fetch fails
      setSelectedWordDetail(null);
      setView('detail');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToGalaxy = () => {
    setSelectedNode(null);
    setSelectedWordDetail(null);
    setView('galaxy');
  };

  const handleBackToWelcome = () => {
    setSearchQuery('');
    setSelectedNode(null);
    setCurrentGalaxyWords([]); // Clear data
    setCurrentWordData(null);
    setSelectedWordDetail(null);
    setView('welcome');

    // Clear URL
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.pushState({}, '', url);
  };

  // --- Render Helpers ---

  const renderWelcome = () => (
    <div className="welcome-page">
      <h1 className="welcome-logo">SynoAnto</h1>
      <form className="welcome-search-container" onSubmit={handleSearch}>
        <input
          type="text"
          className="welcome-search-input"
          placeholder="Enter a word (e.g., 'Beautiful')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search for a word"
          autoFocus
          disabled={isLoading}
        />
        <button type="submit" className="welcome-search-btn" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Explore Galaxy'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
      </form>
    </div>
  );

  const renderGalaxy = () => (
    <div className="app">
      <header className="app-header" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{currentWordData?.word || "Word Galaxy"}</h2>
        <button onClick={handleBackToWelcome} className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>
          New Search
        </button>
      </header>
      <main className="app-main" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative', height: '100%', width: '100%' }}>
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Exploring Galaxy...</p>
            </div>
          ) : (
            <WordGalaxy
              words={currentGalaxyWords}
              onWordSelect={handleWordClick}
              disableInternalModal={true}
              className="full-height-galaxy"
            />
          )}
        </div>
      </main>
    </div>
  );

  const renderDetail = () => {
    if (!selectedNode || !currentWordData) return null;

    // Defines the data for the second card (Comparison Word)
    // If fetch succeeded, use selectedWordDetail. If not (or still loading), fallback to selectedNode basic info.
    const comparisonData = selectedWordDetail;
    const comparisonWord = selectedNode.word;

    return (
      <div className="app comparison-page">
        <div className="comparison-header">
          <button onClick={handleBackToGalaxy} className="back-btn" aria-label="Back to Galaxy">
            ←
          </button>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Word Analysis</h2>
        </div>

        <div className="comparison-content">
          {/* Card 1: Original Search Word */}
          <div className="word-card highlight">
            <div className="word-title-row compact">
              <div className="word-header-main">
                <h2>{currentWordData.word}</h2>
                {currentWordData.partOfSpeech && (
                  <span className="word-pos">{currentWordData.partOfSpeech}</span>
                )}
                {currentWordData.pronunciation && (
                  <span className="word-pron">/{currentWordData.pronunciation}/</span>
                )}
              </div>
            </div>

            <div className="word-info-grid compact">
              <div className="info-item full-width">
                <label>Definition</label>
                <p>{currentWordData.definition}</p>
              </div>
              <div className="info-item full-width">
                <label>Example</label>
                <p className="example-text">
                  "{currentWordData.nuanceExamples?.find(e => e.context === 'Primary Usage')?.usage || 'No example available.'}"
                </p>
              </div>
              <div className="card-footer">
                <span className="word-tag center-tag">Center</span>
              </div>
            </div>
          </div>

          {/* Card 2: Clicked Word (Comparison) */}
          <div className="word-card">
            <div className="word-title-row compact">
              <div className="word-header-main">
                <h2>{comparisonWord}</h2>
                {comparisonData?.partOfSpeech && (
                  <span className="word-pos">{comparisonData.partOfSpeech}</span>
                )}
                {comparisonData?.pronunciation && (
                  <span className="word-pron">/{comparisonData.pronunciation}/</span>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="loading-state">Fetching details...</div>
            ) : comparisonData ? (
              <div className="word-info-grid compact">
                <div className="info-item full-width">
                  <label>Definition</label>
                  <p>{comparisonData.definition}</p>
                </div>
                <div className="info-item full-width">
                  <label>Example</label>
                  <p className="example-text">
                    "{comparisonData.nuanceExamples?.[0]?.usage || selectedNode.example || 'No example available.'}"
                  </p>
                </div>
                <div className="card-footer">
                  <span className={`word-tag ${selectedNode.type}`}>{selectedNode.type}</span>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Could not load full details.</p>
                <p style={{ fontSize: '0.9rem' }}>Relationship: {selectedNode.example}</p>
              </div>
            )}
          </div>
        </div>

        {/* Usage Difference Section */}
        <div className="usage-analysis-section">
          <h3>Usage Comparison</h3>
          <div className="usage-summary">
            <p className="usage-text">
              While <strong>{currentWordData.word}</strong> implies "{currentWordData.definition}",
              <strong> {comparisonWord}</strong> {selectedNode.type === 'synonym' ? 'suggests' : 'contrasts this with'} "{comparisonData?.definition || '...'}"
              <br /><br />
              <strong>Usage Context:</strong> {currentWordData.word} is typically used in {currentWordData.nuanceExamples?.[0]?.formality || 'general'} settings, whereas {comparisonWord} often fits {comparisonData?.nuanceExamples?.[0]?.formality || 'specific'} contexts.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {view === 'welcome' && renderWelcome()}
      {view === 'galaxy' && renderGalaxy()}
      {view === 'detail' && renderDetail()}
    </>
  );
}

export default App;