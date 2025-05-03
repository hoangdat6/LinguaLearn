// API Response Types
interface SentenceAudio {
  key: string;
  audio: string;
  trans: string;
}

interface Collocation {
  id: number;
  w_id: number;
  collocations: string;
  audio_uk: string;
  audio: string;
  definition: string;
  review: number;
  example: string;
  example2: string;
  collocation_trans: {
    collo: string;
    example: string;
    example2: string;
  };
}

interface WordMeaning {
  id: number;
  trans: string;
  sentence_audio: SentenceAudio[];
  collocations: Collocation[];
  synonyms: any;
  cefr_level: string;
}

interface DictionaryApiWord {
  id: number;
  content: string;
  position: string;
  phonetic_uk: string;
  phonetic_us: string;
  audio_uk: string;
  audio_us: string;
  words: WordMeaning[];
  synonyms?: string[];
  antonyms?: string[];
  thesaurus?: any[];
}

interface DictionaryApiResponse {
  code: number;
  data: DictionaryApiWord[];
  suggests: string[];
  msg: string;
}

// Our App's Types
export interface Definition {
  translation: string;
  sentence_audio: SentenceAudio[];
}

export interface WordDetails {
  word: string;
  partOfSpeech: string;
  phonetic_uk: string;
  phonetic_us: string;
  audio_uk: string;
  audio_us: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
  etymology?: string;
}

// Base API URL - now pointing to our own Next.js API route
const API_BASE_URL = '/api/dictionary';

// We don't need custom headers anymore as our proxy will add them
const API_HEADERS = {};

/**
 * Transforms an API word response to our app's WordDetails format
 */
function transformApiWordToWordDetails(apiWord: DictionaryApiWord): WordDetails | null {
  try {
    // Check if we have word meanings available
    if (!apiWord.words || apiWord.words.length === 0) {
      console.error('API response missing word meanings');
      return null;
    }
    
    // Extract definitions from word meanings with additional safety checks
    const definitions: Definition[] = apiWord.words
      .filter(meaning => meaning && typeof meaning.trans === 'string') // Only include valid meanings
      .map(meaning => ({
        translation: meaning.trans || 'Không có định nghĩa',
        sentence_audio: Array.isArray(meaning.sentence_audio) ? meaning.sentence_audio : []
      }));
    
    // If we couldn't extract any valid definitions, return null
    if (definitions.length === 0) {
      console.error('No valid definitions found in API response');
      return null;
    }
    
    // Extract synonyms and antonyms with safety checks
    let synonyms: string[] = [];
    let antonyms: string[] = [];
    
    if (apiWord.thesaurus && apiWord.thesaurus.length > 0) {
      const thesaurus = apiWord.thesaurus[0];
      
      // Split strongest and strong match synonyms
      if (thesaurus.strongest_match) {
        synonyms = synonyms.concat(thesaurus.strongest_match.split(','));
      }
      
      if (thesaurus.strong_match) {
        synonyms = synonyms.concat(thesaurus.strong_match.split(',').slice(0, 5));
      }
      
      // Split strongest and strong opposite antonyms
      if (thesaurus.strongest_opposite) {
        antonyms = antonyms.concat(thesaurus.strongest_opposite.split(','));
      }
      
      if (thesaurus.strong_opposite) {
        antonyms = antonyms.concat(thesaurus.strong_opposite.split(','));
      }
    }
    
    // Ensure no duplicates and remove empty strings
    synonyms = [...new Set(synonyms)].filter(s => s.trim() !== '');
    antonyms = [...new Set(antonyms)].filter(a => a.trim() !== '');
    
    // Create the transformed word object
    return {
      word: apiWord.content || '',
      partOfSpeech: apiWord.position || 'noun',
      phonetic_uk: apiWord.phonetic_uk || '',
      phonetic_us: apiWord.phonetic_us || '',
      audio_uk: apiWord.audio_uk || '',
      audio_us: apiWord.audio_us || '',
      definitions,
      synonyms,
      antonyms,
      etymology: '' // API doesn't seem to provide etymology
    };
  } catch (error) {
    console.error('Error transforming API response:', error);
    return null;
  }
}

/**
 * Searches for a word in the dictionary
 */
export async function searchDictionary(
  query: string,
  language: string = 'vi'
): Promise<{
  word: WordDetails | null;
  suggestions: string[];
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}?language=${language}&key=${encodeURIComponent(query)}`,
      {
        // No need for custom headers or credentials here
        // since we're calling our own API route
      }
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data: DictionaryApiResponse = await response.json();
    
    // Handle suggestions if there's no exact match
    if (data.data.length === 0) {
      return {
        word: null,
        suggestions: data.suggests || []
      };
    }
    
    // Transform the API data to match our app's format
    const transformedWord = transformApiWordToWordDetails(data.data[0]);
    
    // If transformation failed, treat as no match
    if (!transformedWord) {
      console.error('Failed to transform API response');
      return {
        word: null,
        suggestions: data.suggests || []
      };
    }
    
    return {
      word: transformedWord,
      suggestions: data.suggests || []
    };
  } catch (error) {
    console.error('Error searching dictionary:', error);
    throw error;
  }
}

/**
 * Gets suggestions for a partial word
 */
export async function getSuggestions(
  query: string,
  language: string = 'vi'
): Promise<string[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `${API_BASE_URL}?language=${language}&key=${encodeURIComponent(query)}`,
      {
        // No custom headers needed
      }
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data: DictionaryApiResponse = await response.json();
    return data.suggests || [];
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
}
