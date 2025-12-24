import React, { useState, useRef, useEffect, type MouseEvent, type TouchEvent } from 'react';
import type { GalaxyWord } from '@/types';
import './WordGalaxy.css';

interface WordGalaxyProps {
    words?: GalaxyWord[];
    onWordSelect?: (word: GalaxyWord) => void;
    className?: string;
    disableInternalModal?: boolean;
}

const WordGalaxy: React.FC<WordGalaxyProps> = ({
    words = [],
    onWordSelect,
    className = '',
    disableInternalModal = false
}) => {
    const [selectedWord, setSelectedWord] = useState<GalaxyWord | null>(null);
    const [zoom, setZoom] = useState<number>(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            });
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        setPosition({
            x: e.touches[0].clientX - dragStart.x,
            y: e.touches[0].clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        setZoom(prev => Math.min(Math.max(0.5, prev + delta), 2));
    };

    const handleWordClick = (word: GalaxyWord) => {
        setSelectedWord(word);
        if (onWordSelect) {
            onWordSelect(word);
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    const getWordClass = (type: GalaxyWord['type']): string => {
        switch (type) {
            case 'center': return 'galaxy-word-center';
            case 'synonym': return 'galaxy-word-synonym';
            case 'antonym': return 'galaxy-word-antonym';
            default: return 'galaxy-word-neutral';
        }
    };

    const getWordSize = (size?: number): number => {
        return size || 1;
    };

    return (
        <div className={`word-galaxy-container ${className}`}>


            <div
                ref={containerRef}
                className="galaxy-canvas"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                role="application"
                aria-label="Interactive word galaxy visualization"
            >
                <div
                    className="galaxy-content"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease'
                    }}
                >
                    <svg className="connection-lines" aria-hidden="true">
                        {words.map((word) => {
                            if (word.type === 'center') {
                                return words
                                    .filter(w => w.id !== word.id)
                                    .map(connectedWord => (
                                        <line
                                            key={`line-${word.id}-${connectedWord.id}`}
                                            x1={`${word.x}%`}
                                            y1={`${word.y}%`}
                                            x2={`${connectedWord.x}%`}
                                            y2={`${connectedWord.y}%`}
                                            className={`connection-line ${connectedWord.type === 'synonym'
                                                ? 'line-synonym'
                                                : 'line-antonym'
                                                }`}
                                        />
                                    ));
                            }
                            return null;
                        }).filter(Boolean)}
                    </svg>

                    {words.map(word => (
                        <button
                            key={word.id}
                            className={`galaxy-word ${getWordClass(word.type)}`}
                            style={{
                                left: `${word.x}%`,
                                top: `${word.y}%`,
                                transform: `translate(-50%, -50%) scale(${getWordSize(word.size)})`,
                                zIndex: word.type === 'center' ? 10 : 5
                            }}
                            onClick={() => handleWordClick(word)}
                            aria-label={`${word.word} (${word.type})`}
                            type="button"
                        >
                            <div className="word-content">
                                <span className="word-text">{word.word}</span>
                                {word.type !== 'center' && <span className="word-type">{word.type}</span>}
                                {word.type !== 'center' && word.strength && (
                                    <span className="word-strength">
                                        {Math.round(word.strength * 100)}%
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {selectedWord && !disableInternalModal && (
                <div
                    className="word-detail-modal"
                    role="dialog"
                    aria-labelledby="word-detail-title"
                >
                    <div className="word-detail-content">
                        <div className="word-detail-header">
                            <h3 id="word-detail-title">{selectedWord.word}</h3>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedWord(null)}
                                aria-label="Close details"
                            >
                                ×
                            </button>
                        </div>
                        <div className="word-detail-body">
                            <p><strong>Type:</strong> {selectedWord.type}</p>
                            {selectedWord.strength && (
                                <p><strong>Strength:</strong> {selectedWord.strength.toFixed(2)}</p>
                            )}
                            {selectedWord.example && (
                                <p><strong>Example:</strong> <em>{selectedWord.example}</em></p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WordGalaxy;