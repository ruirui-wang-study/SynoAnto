import type { WordData, GalaxyWord, Synonym, Antonym, NuanceExample } from '@/types';

const COLLEGIATE_KEY = '0be4cedf-7b9b-4309-b986-a9c41fefa130';
const THESAURUS_KEY = 'aeae1af3-c3dd-4dfd-a927-06855ca8576b';

const COLLEGIATE_API_BASE = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json';
const THESAURUS_API_BASE = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json';



// Helper to extract the best example sentence from Collegiate JSON
const getExampleSentence = (entry: any): string => {
    try {
        if (!entry.def) return '';

        let bestExample = '';
        let maxLength = 0;

        for (const defGroup of entry.def) {
            if (!defGroup.sseq) continue;
            for (const sseq of defGroup.sseq) {
                for (const sense of sseq) {
                    const senseData = Array.isArray(sense) ? sense[1] : sense;
                    if (senseData.dt) {
                        for (const dtItem of senseData.dt) {
                            if (dtItem[0] === 'vis' && Array.isArray(dtItem[1])) {
                                for (const visItem of dtItem[1]) {
                                    if (visItem.t) {
                                        // Clean formatting
                                        const text = visItem.t.replace(/\{[^}]+\}/g, '');

                                        // Scoring: Prefer longer sentences that look complete (end in punctuation)
                                        let score = text.length;
                                        if (/[\.\!\?]"?$/.test(text)) score += 50; // Bonus for ending punctuation
                                        if (/^[A-Z"]/.test(text)) score += 20;    // Bonus for starting with capital

                                        if (score > maxLength) {
                                            maxLength = score;
                                            bestExample = text;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return bestExample;
    } catch (e) {
        console.warn('Error parsing example sentence', e);
    }
    return '';
};

export const fetchWordDefinition = async (term: string): Promise<WordData | null> => {
    try {
        const res = await fetch(`${COLLEGIATE_API_BASE}/${term}?key=${COLLEGIATE_KEY}`);
        if (!res.ok) return null;

        const data = await res.json();

        console.log("=== Word Definition Fetch ===");
        console.log(`Term: ${term}`);
        console.log("Definition Data:", data);
        console.log("=============================");

        if (!data.length || typeof data[0] === 'string') return null;

        const validEntry = data.find((entry: any) => typeof entry === 'object' && entry.shortdef) || data[0];
        if (!validEntry) return null;

        const definitions = validEntry.shortdef || [];
        const definition = definitions.length > 0 ? definitions[0] : 'No definition available';
        const partOfSpeech = validEntry.fl || '';
        const pronunciation = validEntry.hwi?.prs?.[0]?.mw || '';
        const example = getExampleSentence(validEntry);

        return {
            word: validEntry.hwi?.hw?.replace(/\*/g, '') || term,
            definition,
            partOfSpeech,
            pronunciation,
            synonyms: [], // Not needed for simple definition fetch
            antonyms: [],
            nuanceExamples: [{
                word: term,
                context: 'General Usage',
                usage: example || `No example available for ${term}.`,
                intensity: 5,
                formality: 'neutral'
            }]
        };
    } catch (error) {
        console.error('Error fetching word definition:', error);
        return null;
    }
};

import { APP_CONFIG } from '@/config';

// Configuration interface for word limits
interface GalaxyConfig {
    maxSynonyms?: number;
    maxAntonyms?: number;
}

export const fetchWordData = async (
    term: string,
    config: GalaxyConfig = {} // Default empty object
): Promise<{ wordData: WordData; galaxyWords: GalaxyWord[] }> => {
    // Default values if not provided
    const {
        maxSynonyms = APP_CONFIG.galaxy.maxSynonyms,
        maxAntonyms = APP_CONFIG.galaxy.maxAntonyms
    } = config;

    try {
        // 1. Parallel Fetch: Collegiate (Def, Pronunciation) & Thesaurus (Syn, Ant)
        const [collegiateRes, thesaurusRes] = await Promise.all([
            fetch(`${COLLEGIATE_API_BASE}/${term}?key=${COLLEGIATE_KEY}`),
            fetch(`${THESAURUS_API_BASE}/${term}?key=${THESAURUS_KEY}`)
        ]);

        if (!collegiateRes.ok || !thesaurusRes.ok) {
            throw new Error('Failed to fetch data from dictionary services');
        }

        const collegiateData = await collegiateRes.json();
        const thesaurusData = await thesaurusRes.json();

        console.log("=== Dictionary Data Fetch ===");
        console.log(`Term: ${term}`);
        console.log("Collegiate Data:", collegiateData);
        console.log("Thesaurus Data:", thesaurusData);
        console.log("=============================");

        // Check if word exists (M-W returns empty array or array of suggestions (strings) if not found)
        if (!collegiateData.length || typeof collegiateData[0] === 'string') {
            throw new Error('Word not found in dictionary');
        }

        // --- Process Collegiate Data ---
        // Taking the first result as the primary meaning
        const validEntry = collegiateData.find((entry: any) => typeof entry === 'object' && entry.shortdef);
        if (!validEntry) {
            throw new Error('No valid definition found');
        }

        const definitions = validEntry.shortdef || [];
        const definition = definitions.length > 0 ? definitions[0] : 'No definition available';
        const partOfSpeech = validEntry.fl || '';
        // Pronunciation: hwi.prs[0].mw gives text
        const pronunciation = validEntry.hwi?.prs?.[0]?.mw || '';
        const mainExample = getExampleSentence(validEntry);


        // --- Process Thesaurus Data ---
        // Thesaurus data can also be suggestions, so check type
        let synonyms: Synonym[] = [];
        let antonyms: Antonym[] = [];

        if (thesaurusData.length > 0 && typeof thesaurusData[0] === 'object') {
            const thesaurusEntry = thesaurusData[0]; // Take first sense

            // M-W provides lists of lists (grouped by meaning). We'll flatten them.
            // meta.syns and meta.ants are the most reliable sources
            const rawSyns = thesaurusEntry.meta?.syns?.flat() || [];
            const rawAnts = thesaurusEntry.meta?.ants?.flat() || [];

            synonyms = rawSyns.slice(0, maxSynonyms).map((word: string, index: number) => ({
                word,
                strength: Math.max(0.3, 1 - (index * 0.1)), // Mock strength based on order
                example: `Similar to ${term}`
            }));

            antonyms = rawAnts.slice(0, maxAntonyms).map((word: string, index: number) => ({
                word,
                strength: Math.max(0.3, 1 - (index * 0.1)),
                example: `Opposite of ${term}`
            }));
        }

        // Mock Nuance Data (M-W Thesaurus 'dt' fields sometimes have examples, but parsing is complex. 
        // We will stick to mock structure enriched with real synonyms if possible)
        const nuanceExamples: NuanceExample[] = synonyms.slice(0, 3).map((s, i) => ({
            word: s.word,
            context: i === 0 ? 'Formal context' : i === 1 ? 'Casual conversation' : 'Literary usage',
            usage: `Here is a sample sentence using the word "${s.word}" effectively.`,
            intensity: 5 + i,
            formality: i === 0 ? 'formal' : 'neutral'
        }));

        // Add main word example to nuance examples if available
        if (mainExample) {
            nuanceExamples.unshift({
                word: term,
                context: 'Primary Usage',
                usage: mainExample,
                intensity: 5,
                formality: 'neutral'
            });
        }

        const wordData: WordData = {
            word: validEntry.hwi?.hw?.replace(/\*/g, '') || term, // hwi.hw usually has points like 'ex*am*ple'
            definition,
            synonyms,
            antonyms,
            nuanceExamples,
            pronunciation,
            partOfSpeech
        };

        // 4. Construct Galaxy Words
        const galaxyWords: GalaxyWord[] = [];

        // Helper to track occupied space for collision detection
        // x, y in percentages (0-100)
        // radius in "distance units" (approximate percentage distance)
        const occupied: { x: number; y: number; r: number }[] = [];

        const addWord = (word: GalaxyWord, safetyRadius: number) => {
            galaxyWords.push(word);
            occupied.push({ x: word.x, y: word.y, r: safetyRadius });
        };

        // Center Node
        // Center is larger, so give it a bigger safety radius (e.g. 12)
        addWord({
            id: 0,
            word: term,
            x: 50,
            y: 50,
            type: 'center',
            size: 1.5,
            strength: 1
        }, 14);

        // Add Synonyms and Antonyms to Galaxy
        const allRelated = [
            ...synonyms.map(s => ({ ...s, type: 'synonym' as const })),
            ...antonyms.map(a => ({ ...a, type: 'antonym' as const }))
        ];

        // Random distribution with collision detection
        allRelated.forEach((item, index) => {
            let placed = false;
            let attempts = 0;
            const maxAttempts = 100;
            const nodeRadius = 7; // Safety radius for standard nodes (radius ~ button size/2 + margin)

            while (!placed && attempts < maxAttempts) {
                // Generate random position between 10% and 90% to keep away from edges
                const x = 10 + Math.random() * 80;
                const y = 10 + Math.random() * 80;

                // Check collision with all existing
                let overlap = false;
                for (const spot of occupied) {
                    const dx = x - spot.x;
                    const dy = y - spot.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = spot.r + nodeRadius;

                    if (dist < minDist) {
                        overlap = true;
                        break;
                    }
                }

                if (!overlap) {
                    addWord({
                        id: index + 1,
                        word: item.word,
                        x,
                        y,
                        type: item.type,
                        size: 1,
                        strength: item.strength,
                        example: item.example
                    }, nodeRadius);
                    placed = true;
                }
                attempts++;
            }

            // Fallback: If can't find a spot, place in a random outer ring (ignoring partial collisions if must)
            if (!placed) {
                const angle = Math.random() * 2 * Math.PI;
                const r = 35 + Math.random() * 10; // 35-45% radius from center
                const safeX = Math.max(5, Math.min(95, 50 + r * Math.cos(angle)));
                const safeY = Math.max(5, Math.min(95, 50 + r * Math.sin(angle)));

                addWord({
                    id: index + 1,
                    word: item.word,
                    x: safeX,
                    y: safeY,
                    type: item.type,
                    size: 1,
                    strength: item.strength,
                    example: item.example
                }, nodeRadius);
            }
        });

        return { wordData, galaxyWords };
    } catch (error) {
        console.error('Error fetching word data:', error);
        throw error;
    }
};
