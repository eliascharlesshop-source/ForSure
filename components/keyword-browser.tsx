import React, { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, Network, BookOpen, Download, Filter, Tag, ChevronRight, Info, ExternalLink } from 'lucide-react';

import {
  KeywordEntry,
  SearchOptions,
  SearchResult,
  KeywordAnalytics,
  advancedSearch,
  getKeywordSuggestions,
  getKeywordAnalytics,
  getKeywordNetwork,
  getKeywordsByCategory,
  getHighPriorityKeywords,
  exportKeywords
} from '../lib/keyword-search';

interface KeywordBrowserProps {
  className?: string;
}

const KeywordBrowser: React.FC<KeywordBrowserProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordEntry | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<KeywordAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'browse' | 'analytics' | 'network'>('search');
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    category: undefined,
    priority: undefined,
    includeSynonyms: true,
    includeRelated: true,
    fuzzySearch: true,
    limit: 20
  });
  const [networkData, setNetworkData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setAnalytics(getKeywordAnalytics());
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const newSuggestions = getKeywordSuggestions(searchQuery, 5);
      setSuggestions(newSuggestions.map(s => s.keyword));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = advancedSearch(searchQuery, searchOptions);
      setSearchResults(results);
    }
  };

  const handleKeywordSelect = (keyword: KeywordEntry) => {
    setSelectedKeyword(keyword);
    try {
      const network = getKeywordNetwork(keyword.keyword);
      setNetworkData(network);
    } catch (error) {
      console.error('Failed to get network data:', error);
    }
  };

  const handleExport = (format: 'json' | 'csv' | 'xml') => {
    const data = exportKeywords(format);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keywords.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const categories = useMemo(() => {
    if (!analytics) return [];
    return Object.keys(analytics.categoryDistribution);
  }, [analytics]);

  const highPriorityKeywords = useMemo(() => {
    return getHighPriorityKeywords();
  }, []);

  const filteredCategories = useMemo(() => {
    if (selectedCategory === 'all') {
      return [...getKeywordsByCategory('dev'), ...getKeywordsByCategory('design'), ...getKeywordsByCategory('both')];
    }
    return getKeywordsByCategory(selectedCategory as 'dev' | 'design' | 'both');
  }, [selectedCategory]);

  return (
    <div className={`keyword-browser ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dev & Design Keyword Database</h1>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('json')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'browse'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Browse
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'network'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Network className="w-4 h-4" />
            Network
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Input */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search keywords..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setSuggestions([]);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Options */}
              <div className="flex flex-wrap gap-4">
                <select
                  value={searchOptions.category || ''}
                  onChange={(e) => setSearchOptions({
                    ...searchOptions,
                    category: e.target.value as 'dev' | 'design' | 'both' | undefined
                  })}
                  className="px-3 py-1 border border-gray-300 rounded"
                >
                  <option value="">All Categories</option>
                  <option value="dev">Development</option>
                  <option value="design">Design</option>
                  <option value="both">Both</option>
                </select>

                <select
                  value={searchOptions.priority || ''}
                  onChange={(e) => setSearchOptions({
                    ...searchOptions,
                    priority: e.target.value as 'high' | 'medium' | 'low' | undefined
                  })}
                  className="px-3 py-1 border border-gray-300 rounded"
                >
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchOptions.includeSynonyms}
                    onChange={(e) => setSearchOptions({
                      ...searchOptions,
                      includeSynonyms: e.target.checked
                    })}
                  />
                  Include Synonyms
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchOptions.includeRelated}
                    onChange={(e) => setSearchOptions({
                      ...searchOptions,
                      includeRelated: e.target.checked
                    })}
                  />
                  Include Related
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchOptions.fuzzySearch}
                    onChange={(e) => setSearchOptions({
                      ...searchOptions,
                      fuzzySearch: e.target.checked
                    })}
                  />
                  Fuzzy Search
                </label>

                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
                <div className="grid gap-4">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => handleKeywordSelect(result.keyword)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{result.keyword.keyword}</h4>
                            <span className={`px-2 py-1 text-xs rounded ${
                              result.keyword.category === 'dev' ? 'bg-blue-100 text-blue-800' :
                              result.keyword.category === 'design' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {result.keyword.category}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              result.keyword.priority === 'high' ? 'bg-red-100 text-red-800' :
                              result.keyword.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {result.keyword.priority}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{result.keyword.definition}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Score: {result.relevanceScore}%</span>
                            <span>Matches: {result.matchedFields.join(', ')}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <label className="font-medium">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded"
              >
                <option value="all">All Categories</option>
                <option value="dev">Development</option>
                <option value="design">Design</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="grid gap-6">
              {filteredCategories.map((category, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.keywords.map((keyword, kIndex) => (
                      <div
                        key={kIndex}
                        onClick={() => handleKeywordSelect(keyword)}
                        className="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{keyword.keyword}</h4>
                          <span className={`px-2 py-1 text-xs rounded ${
                            keyword.priority === 'high' ? 'bg-red-100 text-red-800' :
                            keyword.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {keyword.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{keyword.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Total Keywords</h3>
                <p className="text-3xl font-bold text-blue-600">{analytics.totalKeywords}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Categories</h3>
                <p className="text-3xl font-bold text-green-600">{Object.keys(analytics.categoryDistribution).length}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">High Priority</h3>
                <p className="text-3xl font-bold text-purple-600">{analytics.mostRelevant.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-4">Category Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(analytics.categoryDistribution).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="capitalize">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(count / analytics.totalKeywords) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-4">Priority Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(analytics.priorityDistribution).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <span className="capitalize">{priority}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              priority === 'high' ? 'bg-red-500' :
                              priority === 'medium' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`}
                            style={{ width: `${(count / analytics.totalKeywords) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-4">Trending Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {analytics.trending.map((keyword, index) => (
                  <span
                    key={index}
                    onClick={() => {
                      const result = advancedSearch(keyword, { limit: 1 });
                      if (result.length > 0) {
                        handleKeywordSelect(result[0].keyword);
                      }
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-4">High Priority Keywords</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {highPriorityKeywords.slice(0, 12).map((keyword, index) => (
                  <div
                    key={index}
                    onClick={() => handleKeywordSelect(keyword)}
                    className="p-3 bg-red-50 rounded hover:bg-red-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{keyword.keyword}</h4>
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        {keyword.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{keyword.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Enter keyword to explore network..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const keyword = (e.target as HTMLInputElement).value;
                    try {
                      const network = getKeywordNetwork(keyword.toLowerCase());
                      setNetworkData(network);
                      setSelectedKeyword(network.keyword);
                    } catch (error) {
                      alert(`Keyword "${keyword}" not found`);
                    }
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {networkData && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Target Keyword</h3>
                  <h4 className="text-xl font-bold text-blue-600">{networkData.keyword.keyword}</h4>
                  <p className="text-gray-600 mt-2">{networkData.keyword.definition}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {networkData.keyword.category}
                    </span>
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                      {networkData.keyword.subcategory}
                    </span>
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                      {networkData.keyword.priority}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {networkData.synonyms.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Synonyms ({networkData.synonyms.length})
                      </h3>
                      <div className="space-y-2">
                        {networkData.synonyms.map((syn: KeywordEntry, index: number) => (
                          <div
                            key={index}
                            onClick={() => handleKeywordSelect(syn)}
                            className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{syn.keyword}</span>
                              <span className="text-xs text-gray-500">{syn.category}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {networkData.related.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Network className="w-4 h-4" />
                        Related Keywords ({networkData.related.length})
                      </h3>
                      <div className="space-y-2">
                        {networkData.related.map((rel: KeywordEntry, index: number) => (
                          <div
                            key={index}
                            onClick={() => handleKeywordSelect(rel)}
                            className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{rel.keyword}</span>
                              <span className="text-xs text-gray-500">{rel.category}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {networkData.category.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Same Category ({networkData.category.length})
                      </h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {networkData.category.slice(0, 10).map((cat: KeywordEntry, index: number) => (
                          <div
                            key={index}
                            onClick={() => handleKeywordSelect(cat)}
                            className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{cat.keyword}</span>
                              <span className="text-xs text-gray-500">{cat.priority}</span>
                            </div>
                          </div>
                        ))}
                        {networkData.category.length > 10 && (
                          <div className="text-sm text-gray-500 text-center pt-2">
                            ... and {networkData.category.length - 10} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keyword Detail Modal */}
        {selectedKeyword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedKeyword.keyword}</h2>
                <button
                  onClick={() => setSelectedKeyword(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-sm rounded ${
                    selectedKeyword.category === 'dev' ? 'bg-blue-100 text-blue-800' :
                    selectedKeyword.category === 'design' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedKeyword.category}
                  </span>
                  <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded">
                    {selectedKeyword.subcategory}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded ${
                    selectedKeyword.priority === 'high' ? 'bg-red-100 text-red-800' :
                    selectedKeyword.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedKeyword.priority}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Definition</h3>
                  <p className="text-gray-700">{selectedKeyword.definition}</p>
                </div>

                {selectedKeyword.synonyms.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Synonyms</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedKeyword.synonyms.map((synonym, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-800 rounded">
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedKeyword.related.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Related Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedKeyword.related.map((related, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            const result = advancedSearch(related, { limit: 1 });
                            if (result.length > 0) {
                              handleKeywordSelect(result[0].keyword);
                            }
                          }}
                          className="px-2 py-1 bg-green-50 text-green-800 rounded hover:bg-green-100 transition-colors"
                        >
                          {related}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedKeyword.context && (
                  <div>
                    <h3 className="font-semibold mb-2">Context</h3>
                    <p className="text-gray-700">{selectedKeyword.context}</p>
                  </div>
                )}

                {selectedKeyword.examples && selectedKeyword.examples.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Examples</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedKeyword.examples.map((example, index) => (
                        <li key={index} className="text-gray-700">{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordBrowser;
