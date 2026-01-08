// Word Galaxy 相关类型
export interface GalaxyWord {
    id: number;
    word: string;
    x: number;
    y: number;
    type: 'center' | 'synonym' | 'antonym' | 'related';
    size?: number;
    strength?: number;
    example?: string;
}

export interface Synonym {
    word: string;
    strength: number;
    example: string;
}

export interface Antonym {
    word: string;
    strength: number;
    example: string;
}

export interface NuanceExample {
    word: string;
    context: string;
    usage: string;
    intensity?: number;
    formality?: 'formal' | 'neutral' | 'informal';
}

export interface WordData {
    word: string;
    definition: string;
    synonyms: Synonym[];
    antonyms: Antonym[];
    nuanceExamples: NuanceExample[];
    pronunciation?: string;
    partOfSpeech?: string;
}

// Flashcard 相关类型
export interface FlashcardProps {
    word: string;
    definition: string;
    synonyms: string[];
    antonyms: string[];
    example?: string;
    onFlip?: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
}

// 组件 Props 类型
export interface WordGalaxyProps {
    words?: GalaxyWord[];
    onWordSelect?: (word: GalaxyWord) => void;
    className?: string;
}

export interface NuanceAnalysisProps {
    wordData?: WordData;
    className?: string;
}