import type { WordData, GalaxyWord } from '@/types';

export const mockWordData: WordData = {
    word: "beautiful",
    definition: "pleasing the senses or mind aesthetically",
    partOfSpeech: "adjective",
    pronunciation: "/ˈbjuːtɪfəl/",
    synonyms: [
        { word: "attractive", strength: 0.9, example: "an attractive painting" },
        { word: "gorgeous", strength: 0.95, example: "a gorgeous sunset" },
        { word: "stunning", strength: 0.85, example: "a stunning view" },
        { word: "lovely", strength: 0.8, example: "a lovely melody" },
        { word: "exquisite", strength: 0.7, example: "exquisite craftsmanship" },
        { word: "picturesque", strength: 0.6, example: "a picturesque village" },
    ],
    antonyms: [
        { word: "ugly", strength: 0.9, example: "an ugly building" },
        { word: "unattractive", strength: 0.8, example: "unattractive design" },
        { word: "plain", strength: 0.6, example: "a plain appearance" },
        { word: "hideous", strength: 0.95, example: "a hideous monster" },
    ],
    nuanceExamples: [
        {
            word: "beautiful",
            context: "general, all-purpose aesthetic appeal",
            usage: "Her beautiful smile brightened the room.",
            intensity: 7,
            formality: "neutral"
        },
        {
            word: "gorgeous",
            context: "visually striking, often natural beauty",
            usage: "The gorgeous mountains took our breath away.",
            intensity: 9,
            formality: "neutral"
        },
        {
            word: "stunning",
            context: "causing surprise or shock with beauty",
            usage: "She looked stunning in that evening gown.",
            intensity: 8,
            formality: "neutral"
        },
        {
            word: "exquisite",
            context: "delicate, intricate beauty",
            usage: "The jewelry featured exquisite craftsmanship.",
            intensity: 8,
            formality: "formal"
        },
        {
            word: "lovely",
            context: "pleasant, charming beauty",
            usage: "We had a lovely time at the garden party.",
            intensity: 6,
            formality: "neutral"
        }
    ]
};

export const galaxyWords: GalaxyWord[] = [
    { id: 1, word: "beautiful", x: 50, y: 50, type: "center", size: 2 },
    { id: 2, word: "attractive", x: 30, y: 30, type: "synonym", size: 1.5, strength: 0.9 },
    { id: 3, word: "gorgeous", x: 70, y: 30, type: "synonym", size: 1.7, strength: 0.95 },
    { id: 4, word: "stunning", x: 20, y: 70, type: "synonym", size: 1.3, strength: 0.85 },
    { id: 5, word: "lovely", x: 60, y: 70, type: "synonym", size: 1.2, strength: 0.8 },
    { id: 6, word: "exquisite", x: 40, y: 20, type: "synonym", size: 1.4, strength: 0.7 },
    { id: 7, word: "ugly", x: 10, y: 50, type: "antonym", size: 1.5, strength: 0.9 },
    { id: 8, word: "unattractive", x: 90, y: 50, type: "antonym", size: 1.3, strength: 0.8 },
    { id: 9, word: "hideous", x: 20, y: 85, type: "antonym", size: 1.6, strength: 0.95 },
    { id: 10, word: "picturesque", x: 80, y: 20, type: "synonym", size: 1.1, strength: 0.6 },
];

export const flashcardsData = [
    {
        id: 1,
        word: "beautiful",
        definition: "pleasing the senses or mind aesthetically",
        synonyms: ["attractive", "gorgeous", "stunning", "lovely", "exquisite"],
        antonyms: ["ugly", "unattractive", "hideous", "plain"],
        example: "The beautiful sunset painted the sky in hues of orange and pink."
    },
    {
        id: 2,
        word: "intelligent",
        definition: "having or showing intelligence, especially of a high level",
        synonyms: ["smart", "bright", "brilliant", "clever", "wise"],
        antonyms: ["stupid", "foolish", "ignorant", "unintelligent"],
        example: "She is an intelligent student who always asks insightful questions."
    },
    {
        id: 3,
        word: "courageous",
        definition: "not deterred by danger or pain; brave",
        synonyms: ["brave", "fearless", "valiant", "heroic", "bold"],
        antonyms: ["cowardly", "timid", "fearful", "spineless"],
        example: "The firefighter made a courageous rescue during the blaze."
    }
];