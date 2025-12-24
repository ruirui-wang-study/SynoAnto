import React from 'react';
import { WordData } from '@/types';
import './NuanceAnalysis.css';
interface NuanceAnalysisProps {
    wordData?: WordData;
    className?: string;
}
declare const NuanceAnalysis: React.FC<NuanceAnalysisProps>;
export default NuanceAnalysis;
