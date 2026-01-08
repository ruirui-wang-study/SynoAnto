import React, { useState } from 'react';
import './Flashcard.css';

interface FlashcardProps {
    word: string;
    definition: string;
    synonyms: string[];
    antonyms: string[];
    example?: string;
    onFlip?: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
    className?: string;
}

const Flashcard: React.FC<FlashcardProps> = ({
    word,
    definition,
    synonyms,
    antonyms,
    example,
    onFlip,
    onNext,
    onPrevious,
    className = ''
}) => {
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [showDetails, setShowDetails] = useState<boolean>(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        if (onFlip) onFlip();
    };

    const handleShowHint = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDetails(!showDetails);
    };

    return (
        <div className={`flashcard-container ${className}`}>
            <div
                className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                onClick={handleFlip}
                role="button"
                tabIndex={0}
                aria-label={isFlipped ? `Flip back to see word: ${word}` : `Flip to see definition of ${word}`}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleFlip();
                    }
                }}
            >
                <div className="flashcard-front">
                    <div className="flashcard-content">
                        <h3 className="flashcard-word">{word}</h3>
                        {!isFlipped && (
                            <button
                                className="hint-btn"
                                onClick={handleShowHint}
                                type="button"
                                aria-label={showDetails ? "Hide hint" : "Show hint"}
                            >
                                {showDetails ? 'Hide Hint' : 'Show Hint'}
                            </button>
                        )}
                        {showDetails && !isFlipped && (
                            <div className="flashcard-hint">
                                <p className="hint-definition">{definition}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flashcard-back">
                    <div className="flashcard-content">
                        <h3 className="flashcard-word">{word}</h3>
                        <p className="flashcard-definition">{definition}</p>
                        {example && (
                            <p className="flashcard-example">
                                <em>"{example}"</em>
                            </p>
                        )}

                        <div className="flashcard-lists">
                            {synonyms.length > 0 && (
                                <div className="synonyms-list">
                                    <h4>Synonyms</h4>
                                    <div className="tags">
                                        {synonyms.map((syn, index) => (
                                            <span key={index} className="tag tag-synonym">
                                                {syn}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {antonyms.length > 0 && (
                                <div className="antonyms-list">
                                    <h4>Antonyms</h4>
                                    <div className="tags">
                                        {antonyms.map((ant, index) => (
                                            <span key={index} className="tag tag-antonym">
                                                {ant}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flashcard-actions">
                <button
                    className="action-btn"
                    onClick={handleFlip}
                    type="button"
                >
                    {isFlipped ? 'Show Word' : 'Show Definition'}
                </button>
                <button
                    className="action-btn secondary"
                    onClick={handleShowHint}
                    type="button"
                >
                    {showDetails ? 'Hide Hint' : 'Show Hint'}
                </button>
                {(onPrevious || onNext) && (
                    <div className="flashcard-navigation">
                        {onPrevious && (
                            <button
                                className="nav-btn"
                                onClick={onPrevious}
                                type="button"
                                aria-label="Previous card"
                            >
                                ←
                            </button>
                        )}
                        {onNext && (
                            <button
                                className="nav-btn"
                                onClick={onNext}
                                type="button"
                                aria-label="Next card"
                            >
                                →
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Flashcard;