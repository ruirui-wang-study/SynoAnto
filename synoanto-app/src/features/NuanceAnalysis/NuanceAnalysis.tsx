import React, { useState } from 'react';
import type { WordData, NuanceExample } from '@/types';
import './NuanceAnalysis.css';

interface NuanceAnalysisProps {
    wordData?: WordData;
    className?: string;
}

const NuanceAnalysis: React.FC<NuanceAnalysisProps> = ({
    wordData,
    className = ''
}) => {
    const [selectedNuance, setSelectedNuance] = useState<number>(0);

    if (!wordData?.nuanceExamples?.length) {
        return (
            <div className={`nuance-analysis ${className}`}>
                <h3>Nuance Analysis</h3>
                <p>No nuance data available for this word.</p>
            </div>
        );
    }

    return (
        <div className={`nuance-analysis ${className}`}>
            <div className="nuance-header">
                <h3>Nuance Analysis: {wordData.word}</h3>
                <p className="definition">{wordData.definition}</p>
                {wordData.partOfSpeech && (
                    <div className="word-meta">
                        <span className="part-of-speech">{wordData.partOfSpeech}</span>
                        {wordData.pronunciation && (
                            <span className="pronunciation">/{wordData.pronunciation}/</span>
                        )}
                    </div>
                )}
            </div>

            <div className="nuance-tabs">
                {wordData.nuanceExamples.map((example: NuanceExample, index: number) => (
                    <button
                        key={example.word}
                        className={`nuance-tab ${selectedNuance === index ? 'active' : ''}`}
                        onClick={() => setSelectedNuance(index)}
                        type="button"
                    >
                        {example.word}
                    </button>
                ))}
            </div>

            <div className="nuance-content">
                <div className="nuance-detail">
                    <h4>{wordData.nuanceExamples[selectedNuance].word}</h4>
                    <p className="context">
                        <strong>Context:</strong> {wordData.nuanceExamples[selectedNuance].context}
                    </p>
                    <p className="usage">
                        <strong>Usage:</strong> "{wordData.nuanceExamples[selectedNuance].usage}"
                    </p>
                </div>

                <div className="comparison-table">
                    <h4>Word Comparison</h4>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Word</th>
                                    <th>Intensity</th>
                                    <th>Formality</th>
                                    <th>Common Context</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wordData.nuanceExamples.map((example: NuanceExample, index: number) => (
                                    <tr
                                        key={example.word}
                                        className={selectedNuance === index ? 'selected' : ''}
                                        onClick={() => setSelectedNuance(index)}
                                    >
                                        <td>
                                            <strong>{example.word}</strong>
                                        </td>
                                        <td>
                                            <div className="intensity-bar">
                                                <div
                                                    className="intensity-fill"
                                                    style={{
                                                        width: `${(example.intensity || 5) * 10}%`,
                                                        backgroundColor: getIntensityColor(example.intensity || 5)
                                                    }}
                                                />
                                                <span className="intensity-label">
                                                    {example.intensity || 5}/10
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`formality-badge formality-${example.formality || 'neutral'}`}>
                                                {example.formality || 'neutral'}
                                            </span>
                                        </td>
                                        <td>{example.context.split(',')[0]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getIntensityColor = (intensity: number): string => {
    if (intensity >= 8) return '#f56565'; // High intensity
    if (intensity >= 6) return '#ed8936'; // Medium-high
    if (intensity >= 4) return '#ecc94b'; // Medium
    return '#48bb78'; // Low intensity
};

export default NuanceAnalysis;