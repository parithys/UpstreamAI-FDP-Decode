import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'scenario' | 'asset' | 'user' | 'document' | 'insight' | 'agent';
  url: string;
  category: string;
  icon?: string;
  metadata?: {
    updated?: string;
    author?: string;
    status?: string;
    tags?: string[];
  };
}

interface SearchContextType {
  isSearchOpen: boolean;
  searchQuery: string;
  searchResults: SearchResult[];
  recentSearches: string[];
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => void;
  clearSearch: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Comprehensive search index for UpstreamAI FDP
const searchIndex: SearchResult[] = [
  // Main Pages
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Main overview dashboard with key metrics and insights',
    type: 'page',
    url: '/dashboard',
    category: 'Navigation'
  },
  {
    id: 'data-health',
    title: 'Data Health',
    description: 'Data quality monitoring and validation status',
    type: 'page',
    url: '/data-health',
    category: 'Data Management'
  },
  {
    id: 'subsurface-uncertainty',
    title: 'Subsurface Uncertainty',
    description: 'Geological and reservoir uncertainty analysis',
    type: 'page',
    url: '/uncertainty/subsurface',
    category: 'Uncertainty Analysis',
    metadata: { tags: ['uncertainty', 'subsurface', 'geology'] }
  },
  {
    id: 'operational-uncertainty',
    title: 'Operational Uncertainty',
    description: 'Facilities and production uncertainty analysis',
    type: 'page',
    url: '/uncertainty/operational',
    category: 'Uncertainty Analysis',
    metadata: { tags: ['uncertainty', 'operations', 'facilities'] }
  },
  {
    id: 'cross-domain',
    title: 'Cross-Domain Uncertainty',
    description: 'Multi-disciplinary uncertainty integration',
    type: 'page',
    url: '/uncertainty/cross-domain',
    category: 'Uncertainty Analysis',
    metadata: { tags: ['uncertainty', 'cross-domain', 'integration'] }
  },
  {
    id: 'market-volatility',
    title: 'Market Volatility',
    description: 'Economic and market risk analysis',
    type: 'page',
    url: '/uncertainty/market-volatility',
    category: 'Uncertainty Analysis',
    metadata: { tags: ['market', 'economics', 'volatility'] }
  },
  {
    id: 'simulation-comparison',
    title: 'Simulation Comparison',
    description: 'Compare and analyze multiple simulation scenarios',
    type: 'page',
    url: '/simulation/comparison',
    category: 'Simulation',
    metadata: { tags: ['simulation', 'comparison', 'scenarios'] }
  },
  {
    id: 'ai-led-integration',
    title: 'AI-Led Integration',
    description: 'AI-powered scenario optimization and integration',
    type: 'page',
    url: '/insights/ai-led-integration',
    category: 'AI & Insights',
    metadata: { tags: ['AI', 'integration', 'optimization'] }
  },
  {
    id: 'deep-dive-analytics',
    title: 'Deep Dive Analytics',
    description: 'Detailed analytics and performance insights',
    type: 'page',
    url: '/insights/deep-dive-analytics',
    category: 'AI & Insights',
    metadata: { tags: ['analytics', 'insights', 'performance'] }
  },
  {
    id: 'multidisciplinary-workflow',
    title: 'Multidisciplinary Workflow',
    description: 'Cross-team collaboration and workflow visualization',
    type: 'page',
    url: '/insights/multidisciplinary-workflow',
    category: 'Collaboration',
    metadata: { tags: ['workflow', 'collaboration', 'teams'] }
  },
  {
    id: 'governance-audit',
    title: 'Governance & Audit Trail',
    description: 'Compliance monitoring and audit logging',
    type: 'page',
    url: '/insights/governance-audit',
    category: 'Governance',
    metadata: { tags: ['governance', 'audit', 'compliance'] }
  },
  {
    id: 'decision-approval',
    title: 'Decision Approval',
    description: 'Decision tracking and approval workflow',
    type: 'page',
    url: '/insights/decision-approval',
    category: 'Decision Management',
    metadata: { tags: ['decisions', 'approval', 'workflow'] }
  },
  {
    id: 'fdp-summary',
    title: 'FDP Summary',
    description: 'Field Development Plan summary and reports',
    type: 'page',
    url: '/fdp-summary',
    category: 'Reports',
    metadata: { tags: ['FDP', 'summary', 'reports'] }
  },
  {
    id: 'ai-agents',
    title: 'AI Agents Management',
    description: 'Manage and monitor 12 specialized AI agents',
    type: 'page',
    url: '/ai-agents-management',
    category: 'AI Management',
    metadata: { tags: ['AI', 'agents', 'management'] }
  },
  {
    id: 'cross-discipline',
    title: 'Cross-Discipline Visibility',
    description: 'Integrated view across all disciplines',
    type: 'page',
    url: '/cross-discipline-visibility',
    category: 'Collaboration',
    metadata: { tags: ['cross-discipline', 'visibility', 'integration'] }
  },
  {
    id: 'forum',
    title: 'Discussion Forum',
    description: 'Team discussions and knowledge sharing',
    type: 'page',
    url: '/forum',
    category: 'Collaboration',
    metadata: { tags: ['forum', 'discussion', 'collaboration'] }
  },

  // Data Categories
  {
    id: 'petrophysical-logs',
    title: 'Petrophysical Logs',
    description: 'Well log data and interpretations',
    type: 'document',
    url: '/data-health',
    category: 'Data Management',
    metadata: { tags: ['data', 'petrophysics', 'well logs'] }
  },
  {
    id: 'geological-interpretations',
    title: 'Geological Interpretations',
    description: 'Structural and stratigraphic models',
    type: 'document',
    url: '/data-health',
    category: 'Data Management',
    metadata: { tags: ['data', 'geology', 'interpretation'] }
  },
  {
    id: 'geophysical-data',
    title: 'Geophysical Data',
    description: 'Seismic and gravity data',
    type: 'document',
    url: '/data-health',
    category: 'Data Management',
    metadata: { tags: ['data', 'geophysics', 'seismic'] }
  },
  {
    id: 'production-history',
    title: 'Production History',
    description: 'Historical production data and forecasts',
    type: 'document',
    url: '/data-health',
    category: 'Data Management',
    metadata: { tags: ['data', 'production', 'history'] }
  },
  {
    id: 'history-matching',
    title: 'History Matching',
    description: 'Reservoir model calibration and validation',
    type: 'document',
    url: '/data-health',
    category: 'Data Management',
    metadata: { tags: ['data', 'history matching', 'calibration'] }
  },

  // Assets
  {
    id: 'asset-satah',
    title: 'SATAH AL RAZBOOT',
    description: 'Primary offshore asset',
    type: 'asset',
    url: '/dashboard',
    category: 'Assets',
    metadata: { status: 'Active', tags: ['asset', 'offshore'] }
  },
  {
    id: 'asset-umm-lulu',
    title: 'UMM LULU',
    description: 'Offshore asset',
    type: 'asset',
    url: '/dashboard',
    category: 'Assets',
    metadata: { status: 'Active', tags: ['asset', 'offshore'] }
  },
  {
    id: 'asset-umm-shaif',
    title: 'UMM SHAIF',
    description: 'Offshore asset',
    type: 'asset',
    url: '/dashboard',
    category: 'Assets',
    metadata: { status: 'Active', tags: ['asset', 'offshore'] }
  },
  {
    id: 'asset-nasr',
    title: 'NASR',
    description: 'Offshore asset',
    type: 'asset',
    url: '/dashboard',
    category: 'Assets',
    metadata: { status: 'Active', tags: ['asset', 'offshore'] }
  },

  // Scenarios
  {
    id: 'scenario-3a',
    title: 'Scenario 3A: Accelerated Development',
    description: 'Accelerated drilling with infill wells',
    type: 'scenario',
    url: '/simulation/comparison',
    category: 'Scenarios',
    metadata: { status: 'Approved', tags: ['scenario', 'development', 'drilling'] }
  },
  {
    id: 'scenario-2b',
    title: 'Scenario 2B: Balanced Growth',
    description: 'Moderate pace with phased facilities',
    type: 'scenario',
    url: '/simulation/comparison',
    category: 'Scenarios',
    metadata: { status: 'Under Review', tags: ['scenario', 'balanced', 'growth'] }
  },
  {
    id: 'scenario-1a',
    title: 'Scenario 1A: Conservative Base',
    description: 'Minimal investment baseline scenario',
    type: 'scenario',
    url: '/simulation/comparison',
    category: 'Scenarios',
    metadata: { status: 'Baseline', tags: ['scenario', 'conservative', 'baseline'] }
  },

  // AI Agents
  {
    id: 'agent-data-validation',
    title: 'AG-01: Data Validation Agent',
    description: 'Validates input data quality and completeness',
    type: 'agent',
    url: '/ai-agents-management',
    category: 'AI Agents',
    metadata: { status: 'Active', tags: ['AI', 'agent', 'validation'] }
  },
  {
    id: 'agent-reservoir',
    title: 'AG-02: Reservoir Simulation Agent',
    description: 'Executes reservoir flow simulations',
    type: 'agent',
    url: '/ai-agents-management',
    category: 'AI Agents',
    metadata: { status: 'Active', tags: ['AI', 'agent', 'reservoir'] }
  },
  {
    id: 'agent-production',
    title: 'AG-03: Production Forecasting Agent',
    description: 'Forecasts production profiles',
    type: 'agent',
    url: '/ai-agents-management',
    category: 'AI Agents',
    metadata: { status: 'Active', tags: ['AI', 'agent', 'production'] }
  },
  {
    id: 'agent-facilities',
    title: 'AG-04: Facilities Engineering Agent',
    description: 'Designs surface facilities',
    type: 'agent',
    url: '/ai-agents-management',
    category: 'AI Agents',
    metadata: { status: 'Active', tags: ['AI', 'agent', 'facilities'] }
  },
  {
    id: 'agent-economic',
    title: 'AG-05: Economic Evaluation Agent',
    description: 'Calculates NPV, IRR, and economic metrics',
    type: 'agent',
    url: '/ai-agents-management',
    category: 'AI Agents',
    metadata: { status: 'Active', tags: ['AI', 'agent', 'economics'] }
  },
  {
    id: 'agent-environmental',
    title: 'AG-06: Environmental Impact Agent',
    description: 'Assesses CO2 emissions and environmental impact',
    type: 'agent',
    url: '/ai-agents-management',
    category: 'AI Agents',
    metadata: { status: 'Active', tags: ['AI', 'agent', 'environmental'] }
  },
  {
    id: 'agent-risk',
    title: 'AG-07: Risk Assessment Agent',
    description: 'Performs Monte Carlo risk analysis',
    type: 'agent',
    url: '/ai-agents-management',
    category: 'AI Agents',
    metadata: { status: 'Active', tags: ['AI', 'agent', 'risk'] }
  },
  {
    id: 'agent-uncertainty',
    title: 'AG-08: Uncertainty Quantification Agent',
    description: 'Quantifies parameter uncertainties',
    type: 'agent',
    url: '/ai-agents-management',
    category: 'AI Agents',
    metadata: { status: 'Active', tags: ['AI', 'agent', 'uncertainty'] }
  },
  {
    id: 'agent-optimization',
    title: 'AG-09: Optimization Agent',
    description: 'Multi-objective scenario optimization',
    type: 'agent',
    url: '/ai-agents-management',
    category: 'AI Agents',
    metadata: { status: 'Active', tags: ['AI', 'agent', 'optimization'] }
  },
  {
    id: 'agent-ai-led',
    title: 'AG-10: AI-Led Simulation Agent',
    description: 'Physics-informed neural networks for rapid simulation',
    type: 'agent',
    url: '/ai-agents-management',
    category: 'AI Agents',
    metadata: { status: 'Active', tags: ['AI', 'agent', 'simulation'] }
  },
  {
    id: 'agent-governance',
    title: 'AG-11: Governance & Audit Agent',
    description: 'Tracks actions and ensures compliance',
    type: 'agent',
    url: '/ai-agents-management',
    category: 'AI Agents',
    metadata: { status: 'Active', tags: ['AI', 'agent', 'governance'] }
  },
  {
    id: 'agent-reporting',
    title: 'AG-12: Report Generation Agent',
    description: 'Generates comprehensive FDP reports',
    type: 'agent',
    url: '/ai-agents-management',
    category: 'AI Agents',
    metadata: { status: 'Active', tags: ['AI', 'agent', 'reporting'] }
  },

  // Insights & Keywords
  {
    id: 'insight-uncertainty',
    title: 'Uncertainty Analysis',
    description: 'View subsurface, operational, and market uncertainty',
    type: 'insight',
    url: '/uncertainty/subsurface',
    category: 'Analysis',
    metadata: { tags: ['uncertainty', 'analysis', 'risk'] }
  },
  {
    id: 'insight-compliance',
    title: 'Compliance & Governance',
    description: 'View audit trails and compliance metrics',
    type: 'insight',
    url: '/insights/governance-audit',
    category: 'Governance',
    metadata: { tags: ['compliance', 'governance', 'audit'] }
  },
  {
    id: 'insight-optimization',
    title: 'Scenario Optimization',
    description: 'AI-powered scenario optimization',
    type: 'insight',
    url: '/insights/ai-led-integration',
    category: 'Optimization',
    metadata: { tags: ['optimization', 'AI', 'scenarios'] }
  },
  {
    id: 'insight-production',
    title: 'Production Forecasting',
    description: 'View production forecasts and reserves',
    type: 'insight',
    url: '/fdp-summary',
    category: 'Production',
    metadata: { tags: ['production', 'forecasting', 'reserves'] }
  },
  {
    id: 'insight-economics',
    title: 'Economic Analysis',
    description: 'NPV, IRR, and investment metrics',
    type: 'insight',
    url: '/fdp-summary',
    category: 'Economics',
    metadata: { tags: ['economics', 'NPV', 'IRR'] }
  }
];

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('upstreamai_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => {
    setIsSearchOpen(false);
    // Don't clear query immediately to allow smooth close
    setTimeout(() => setSearchQuery(''), 300);
  };

  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = searchIndex
      .filter(item => {
        // Search in title, description, category, and tags
        const searchFields = [
          item.title.toLowerCase(),
          item.description.toLowerCase(),
          item.category.toLowerCase(),
          ...(item.metadata?.tags || [])
        ].join(' ');

        return searchFields.includes(lowerQuery);
      })
      .sort((a, b) => {
        // Prioritize exact title matches
        const aExact = a.title.toLowerCase().includes(lowerQuery);
        const bExact = b.title.toLowerCase().includes(lowerQuery);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        // Then prioritize by type (pages first)
        const typeOrder = { page: 0, scenario: 1, asset: 2, agent: 3, insight: 4, document: 5, user: 6 };
        return typeOrder[a.type] - typeOrder[b.type];
      })
      .slice(0, 20); // Limit to top 20 results

    setSearchResults(results);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('upstreamai_recent_searches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('upstreamai_recent_searches');
  };

  return (
    <SearchContext.Provider value={{
      isSearchOpen,
      searchQuery,
      searchResults,
      recentSearches,
      openSearch,
      closeSearch,
      setSearchQuery,
      performSearch,
      clearSearch,
      addRecentSearch,
      clearRecentSearches
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}