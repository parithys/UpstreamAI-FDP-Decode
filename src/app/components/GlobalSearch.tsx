import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSearch } from '../context/SearchContext';
import {
  Search,
  X,
  FileText,
  Folder,
  Users,
  Bot,
  TrendingUp,
  File,
  Clock,
  ArrowRight,
  LayoutGrid,
  Database,
  Sparkles,
  Zap,
  Command,
  Loader2,
  BarChart3,
  Layers,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

const typeIcons = {
  page: LayoutGrid,
  scenario: TrendingUp,
  asset: Database,
  agent: Zap,
  insight: Sparkles,
  document: FileText,
  user: Users
};

const typeColors = {
  page: 'text-primary',
  scenario: 'text-purple-500',
  asset: 'text-blue-500',
  agent: 'text-cyan-500',
  insight: 'text-pink-500',
  document: 'text-amber-500',
  user: 'text-green-500'
};

const typeBgColors = {
  page: 'bg-primary/10',
  scenario: 'bg-purple-500/10',
  asset: 'bg-blue-500/10',
  agent: 'bg-cyan-500/10',
  insight: 'bg-pink-500/10',
  document: 'bg-amber-500/10',
  user: 'bg-green-500/10'
};

const typeBadges = {
  page: 'bg-primary/10 text-primary border-primary/30',
  scenario: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  asset: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  agent: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
  insight: 'bg-pink-500/10 text-pink-500 border-pink-500/30',
  document: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  user: 'bg-green-500/10 text-green-500 border-green-500/30'
};

export function GlobalSearch() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  
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

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  // Handle search with debounce and loading state
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      performSearch('');
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

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchOpen) return;

      const hasResults = searchResults.length > 0;
      const maxIndex = searchResults.length - 1;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closeSearch();
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (hasResults) {
            setSelectedIndex(prev => Math.min(prev + 1, maxIndex));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (hasResults) {
            setSelectedIndex(prev => Math.max(prev - 1, 0));
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (hasResults && searchResults[selectedIndex]) {
            handleResultClick(searchResults[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, searchResults, selectedIndex, closeSearch]);

  const handleResultClick = (result: typeof searchResults[0]) => {
    addRecentSearch(result.title);
    closeSearch();
    navigate(result.url);
    
    toast.success('Navigating...', {
      description: `Opening ${result.title}`,
      duration: 2000
    });
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    inputRef.current?.focus();
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

  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = searchResults.length > 0;
  const showRecentSearches = !hasQuery && recentSearches.length > 0;
  const showPopularSearches = !hasQuery && recentSearches.length === 0;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div 
        className="w-full max-w-3xl bg-card border border-card-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-card-border">
          <Search className="w-5 h-5 text-text-tertiary flex-shrink-0" />
          <input
            ref={inputRef}
            id="search-modal-title"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages, scenarios, assets, AI agents..."
            className="flex-1 bg-transparent text-text-primary text-base outline-none placeholder:text-text-tertiary"
            aria-label="Search"
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
        <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
          {/* Loading State */}
          {isSearching && hasQuery && (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center gap-3 text-text-secondary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Searching...</span>
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {showRecentSearches && !isSearching && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-tertiary" />
                  <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                    Recent Searches
                  </h3>
                </div>
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
                    onClick={() => handleRecentSearchClick(query)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-background-secondary transition-colors text-left group"
                  >
                    <Clock className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                    <span className="text-sm text-text-primary flex-1">{query}</span>
                    <ArrowRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches - Empty State */}
          {showPopularSearches && !isSearching && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-text-primary font-semibold mb-1">Quick Search</h3>
                <p className="text-sm text-text-secondary">
                  Search across all pages, scenarios, and resources
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide px-2">
                  Popular Searches
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Uncertainty Analysis', query: 'uncertainty', icon: TrendingUp },
                    { label: 'AI Agents', query: 'AI agents', icon: Zap },
                    { label: 'Production Forecast', query: 'production', icon: BarChart3 },
                    { label: 'Scenario Comparison', query: 'scenario', icon: Layers },
                    { label: 'Compliance', query: 'governance', icon: Shield },
                    { label: 'Data Health', query: 'data health', icon: Database }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.query}
                        onClick={() => handleRecentSearchClick(item.query)}
                        className="flex items-center gap-2 px-3 py-2.5 bg-background-secondary hover:bg-card-hover rounded-lg text-sm text-text-primary text-left transition-colors group"
                      >
                        <Icon className="w-4 h-4 text-text-tertiary group-hover:text-primary transition-colors" />
                        <span className="flex-1">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-card-border">
                <div className="flex items-center justify-center gap-2 text-xs text-text-tertiary">
                  <kbd className="px-2 py-1 bg-background-primary border border-card-border rounded">↑</kbd>
                  <kbd className="px-2 py-1 bg-background-primary border border-card-border rounded">↓</kbd>
                  <span>to navigate</span>
                  <kbd className="px-2 py-1 bg-background-primary border border-card-border rounded">↵</kbd>
                  <span>to select</span>
                  <kbd className="px-2 py-1 bg-background-primary border border-card-border rounded">esc</kbd>
                  <span>to close</span>
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {hasQuery && hasResults && !isSearching && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs text-text-tertiary">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </div>
              <div className="space-y-1">
                {searchResults.map((result, index) => {
                  const Icon = typeIcons[result.type];
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <button
                      key={result.id}
                      data-index={index}
                      onClick={() => handleResultClick(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg transition-all text-left ${
                        isSelected 
                          ? 'bg-primary/10 border border-primary/30 shadow-sm' 
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
                          <span className={`text-xs px-2 py-0.5 rounded border ${typeBadges[result.type]} flex-shrink-0 capitalize`}>
                            {result.type}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary line-clamp-2 mb-1.5">
                          {result.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-text-tertiary">
                          <span>{result.category}</span>
                          {result.metadata?.status && (
                            <>
                              <span>•</span>
                              <span>{result.metadata.status}</span>
                            </>
                          )}
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
                        <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Results */}
          {hasQuery && !hasResults && !isSearching && (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-text-tertiary opacity-50" />
              </div>
              <h3 className="text-text-primary font-medium mb-1">
                No results found for "{searchQuery}"
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Try different keywords or check your spelling
              </p>
              <button
                onClick={handleClearInput}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Clear search and try again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-card-border bg-background-secondary/50">
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
            <div className="flex items-center gap-1.5">
              <Command className="w-3 h-3" />
              <span>K to open</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}