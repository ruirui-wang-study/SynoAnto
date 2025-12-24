import React from 'react';
import { GalaxyWord } from '@/types';
import './WordGalaxy.css';
interface WordGalaxyProps {
    words?: GalaxyWord[];
    onWordSelect?: (word: GalaxyWord) => void;
    className?: string;
}
declare const WordGalaxy: React.FC<WordGalaxyProps>;
export default WordGalaxy;
