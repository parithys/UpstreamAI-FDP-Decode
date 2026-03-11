import { SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSearch } from '../context/SearchContext';
import { toast } from 'sonner';

const typeIcons = {
  page: SearchIcon,
  scenario: SearchIcon,
  asset: SearchIcon,
  user: SearchIcon,
  document: SearchIcon,
  insight: SearchIcon,
  agent: SearchIcon
};

const typeColors = {
  page: 'text-primary',
  scenario: 'text-purple-500',
  asset: 'text-blue-500',
  user: 'text-green-500',
  document: 'text-amber-500',
  insight: 'text-pink-500',
  agent: 'text-cyan-500'
};

const typeBgColors = {
  page: 'bg-primary/10',
  scenario: 'bg-purple-500/10',
  asset: 'bg-blue-500/10',
  user: 'bg-green-500/10',
  document: 'bg-amber-500/10',
  insight: 'bg-pink-500/10',
  agent: 'bg-cyan-500/10'
};

export function SearchModal() {
  const {
    isSearchOpen,
    searchQuery,
    searchResults,
    recentSearches,
    closeSearch,
    setSearchQuery,
    performSearch,
    clearSearch,
    addRecentSearch,
    clearRecentSearches
  } = useSearch();

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Handle search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      performSearch(searchQuery);
      setIsSearching(false);
      setSelectedIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchOpen) return;

      const resultsToShow = searchQuery ? searchResults : [];
      const maxIndex = resultsToShow.length - 1;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, maxIndex));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (resultsToShow[selectedIndex]) {
            handleSelectResult(resultsToShow[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          closeSearch();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, searchQuery, searchResults, selectedIndex, closeSearch]);

  const handleSelectResult = (result: SearchResult) => {
    addRecentSearch(result.title);
    navigate(result.url);
    closeSearch();
    
    toast.success('Navigating...', {
      description: `Opening ${result.title}`,
      duration: 2000
    });
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const handleClearInput = () => {
    setSearchQuery('');
    clearSearch();
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  const handleClose = () => {
    closeSearch();
    setSelectedIndex(0);
  };

  if (!isSearchOpen) return null;

  const hasResults = searchResults.length > 0;
  const hasQuery = searchQuery.trim().length > 0;
  const showRecentSearches = !hasQuery && recentSearches.length > 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card border border-card-border rounded-lg shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-card-border">
          <SearchIcon className="w-5 h-5 text-text-tertiary flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, scenarios, data, insights..."
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-tertiary text-base"
            aria-label="Search"
            id="search-modal-title"
          />
          {hasQuery && (
            <button
              onClick={handleClearInput}
              className="p-1 hover:bg-background-secondary rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-1 hover:bg-background-secondary rounded transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Loading State */}
          {isSearching && (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center gap-3 text-text-secondary">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Searching...</span>
              </div>
            </div>
          )}

          {/* No Query - Show Recent Searches */}
          {!hasQuery && !isSearching && (
            <div className="p-4">
              {showRecentSearches ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearch(query)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background-secondary transition-colors text-left"
                      >
                        <Clock className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                        <span className="text-sm text-text-primary">{query}</span>
                        <ArrowRight className="w-4 h-4 text-text-tertiary ml-auto" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <SearchIcon className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50" />
                  <p className="text-text-secondary text-sm">
                    Start typing to search across projects, scenarios, and data
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-tertiary">
                    <kbd className="px-2 py-1 bg-background-secondary border border-card-border rounded">↑</kbd>
                    <kbd className="px-2 py-1 bg-background-secondary border border-card-border rounded">↓</kbd>
                    <span>to navigate</span>
                    <kbd className="px-2 py-1 bg-background-secondary border border-card-border rounded">↵</kbd>
                    <span>to select</span>
                    <kbd className="px-2 py-1 bg-background-secondary border border-card-border rounded">esc</kbd>
                    <span>to close</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Has Query - Show Results or No Results */}
          {hasQuery && !isSearching && (
            <>
              {hasResults ? (
                <div className="p-2">
                  <div className="mb-3 px-3 pt-3">
                    <p className="text-xs text-text-tertiary">
                      Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {searchResults.map((result, index) => {
                      const Icon = typeIcons[result.type];
                      const isSelected = index === selectedIndex;
                      
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleSelectResult(result)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                            isSelected 
                              ? 'bg-primary/10 border border-primary/30' 
                              : 'hover:bg-background-secondary border border-transparent'
                          }`}
                        >
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${typeBgColors[result.type]} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${typeColors[result.type]}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-text-primary truncate">
                                {result.title}
                              </h4>
                              <span className="text-xs text-text-tertiary capitalize flex-shrink-0">
                                {result.type}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary line-clamp-2 mb-1">
                              {result.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-text-tertiary">
                              <span>{result.category}</span>
                              {result.metadata?.tags && result.metadata.tags.length > 0 && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    {result.metadata.tags.slice(0, 3).map((tag, i) => (
                                      <span key={i} className="px-1.5 py-0.5 bg-background-secondary rounded text-[10px]">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Arrow indicator for selected item */}
                          {isSelected && (
                            <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <SearchIcon className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50" />
                  <p className="text-text-primary font-medium mb-1">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-text-secondary text-sm">
                    Try different keywords or check your spelling
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-card-border px-4 py-3 bg-background-secondary/50">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background-primary border border-card-border rounded">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background-primary border border-card-border rounded">↵</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background-primary border border-card-border rounded">esc</kbd>
                <span>Close</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Command className="w-3 h-3" />
              <span>K to open</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}