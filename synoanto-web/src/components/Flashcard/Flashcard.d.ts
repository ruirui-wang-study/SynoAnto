import React from 'react';
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
declare const Flashcard: React.FC<FlashcardProps>;
export default Flashcard;
