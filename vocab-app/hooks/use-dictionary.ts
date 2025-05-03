import { useState, useRef, useCallback, useEffect } from "react"
import { searchDictionary, getSuggestions } from "@/services/dict-service"

// Key for storing recent searches in session storage
const RECENT_SEARCHES_KEY = 'dictionary_recent_searches';

// Helper functions for session storage
const saveRecentSearches = (searches: string[]) => {
  try {
    sessionStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  } catch (error) {
    console.error('Error saving recent searches to session storage:', error);
  }
};

const loadRecentSearches = (): string[] => {
  try {
    const saved = sessionStorage.getItem(RECENT_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading recent searches from session storage:', error);
    return [];
  }
};

export function useDictionary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedWord, setSelectedWord] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionsList, setSuggestionsList] = useState<string[]>([])
  
  // Initialize recent searches from session storage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => loadRecentSearches())
  
  const [savedWords, setSavedWords] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Update session storage when recent searches change
  useEffect(() => {
    saveRecentSearches(recentSearches);
  }, [recentSearches]);

  // Handle search
  const handleSearch = useCallback(async (term: string = searchTerm) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    setShowSuggestions(false);
    setError(null); // Clear any previous errors
    setSearchTerm(term);
    
    try {
      const result = await searchDictionary(term);
      
      if (result.word) {
        // Successfully found a word
        setSelectedWord(result.word);
        
        // Add to recent searches if not already there
        if (!recentSearches.includes(term.toLowerCase())) {
          setRecentSearches(prev => {
            const updated = [term.toLowerCase(), ...prev].slice(0, 10);
            return updated;
          });
        }
      } else {
        // No match found - show suggestions or error
        if (result.suggestions && result.suggestions.length > 0) {
          setSuggestionsList(result.suggestions);
          setShowSuggestions(true);
          setError(`Không tìm thấy từ "${term}" trong từ điển. Xem gợi ý bên dưới:`);
        } else {
          setSuggestionsList([]);
          setError(`Không tìm thấy từ "${term}" trong từ điển.`);
        }
      }
    } catch (error) {
      console.error("Error searching dictionary:", error);
      setError(`Đã có lỗi xảy ra khi tìm kiếm từ "${term}". Vui lòng thử lại sau.`);
      setSuggestionsList([]); // Clear suggestions on error
    } finally {
      setIsLoading(false);
    }
  }, [recentSearches, searchTerm]);

  // Custom method to clear recent searches (also clears session storage)
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    // Session storage will be updated by the useEffect
  }, []);

  // Toggle saved word
  const toggleSavedWord = (word: string) => {
    if (savedWords.includes(word)) {
      setSavedWords(prev => prev.filter(w => w !== word))
    } else {
      setSavedWords(prev => [...prev, word])
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
    setSelectedWord(null)
    setShowSuggestions(false)
    setSuggestionsList([])
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleSearch()
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Hide suggestions when typing - only show after pressing enter
    if (showSuggestions) {
      setShowSuggestions(false);
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    selectedWord,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    recentSearches,
    setRecentSearches: clearRecentSearches, // Replace with our custom method
    savedWords,
    suggestions: suggestionsList,
    searchInputRef,
    handleSearch,
    toggleSavedWord,
    clearSearch,
    handleKeyPress,
    handleInputChange,
    error
  }
}
