import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LandingPage } from './pages/LandingPage'

// Demo entry for Landing Page preview
// To use: change index.html script src or run with this as entry

const handleExplore = (searchTerm: string) => {
    console.log('Exploring:', searchTerm);
    // In production, this would navigate to the Galaxy view
    alert(`Exploring: ${searchTerm}\n\n(In production, this would navigate to the Galaxy view)`);
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LandingPage onExplore={handleExplore} />
    </StrictMode>,
)
