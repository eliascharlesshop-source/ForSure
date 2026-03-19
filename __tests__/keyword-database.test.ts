// Comprehensive test suite for the keyword database system
// Tests for keyword-database.ts and keyword-search.ts

import {
  KeywordEntry,
  KeywordCategory,
  KEYWORD_DATABASE,
  searchKeywords,
  getKeywordsByCategory,
  getKeywordsBySubcategory,
  getHighPriorityKeywords,
  getRelatedKeywords
} from '../lib/keyword-database';

import {
  advancedSearch,
  getKeywordSuggestions,
  getKeywordAnalytics,
  findKeywordsByContext,
  getKeywordNetwork,
  exportKeywords,
  importKeywords,
  SearchResult,
  KeywordAnalytics
} from '../lib/keyword-search';

describe('Keyword Database', () => {
  describe('Database Structure', () => {
    test('should have all required categories', () => {
      expect(KEYWORD_DATABASE).toHaveProperty('dev');
      expect(KEYWORD_DATABASE).toHaveProperty('design');
      expect(KEYWORD_DATABASE).toHaveProperty('both');
    });

    test('should have valid keyword entries', () => {
      const allKeywords: KeywordEntry[] = [
        ...KEYWORD_DATABASE.dev.flatMap(cat => cat.keywords),
        ...KEYWORD_DATABASE.design.flatMap(cat => cat.keywords),
        ...KEYWORD_DATABASE.both.flatMap(cat => cat.keywords)
      ];

      allKeywords.forEach(keyword => {
        expect(keyword).toHaveProperty('keyword');
        expect(keyword).toHaveProperty('category');
        expect(keyword).toHaveProperty('subcategory');
        expect(keyword).toHaveProperty('definition');
        expect(keyword).toHaveProperty('synonyms');
        expect(keyword).toHaveProperty('related');
        expect(keyword).toHaveProperty('priority');
        expect(keyword).toHaveProperty('context');
        expect(keyword).toHaveProperty('examples');

        expect(['dev', 'design', 'both']).toContain(keyword.category);
        expect(['high', 'medium', 'low']).toContain(keyword.priority);
        expect(Array.isArray(keyword.synonyms)).toBe(true);
        expect(Array.isArray(keyword.related)).toBe(true);
        expect(Array.isArray(keyword.examples || [])).toBe(true);
      });
    });

    test('should have no duplicate keywords within same category', () => {
      Object.entries(KEYWORD_DATABASE).forEach(([categoryName, categories]) => {
        const keywords = categories.flatMap(cat => cat.keywords);
        const keywordNames = keywords.map(k => k.keyword);
        const uniqueNames = new Set(keywordNames);
        
        expect(keywordNames.length).toBe(uniqueNames.size);
      });
    });
  });

  describe('Search Functions', () => {
    test('should find exact keyword matches', () => {
      const results = searchKeywords('react');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].keyword).toBe('react');
    });

    test('should find partial matches', () => {
      const results = searchKeywords('type');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.keyword.includes('type'))).toBe(true);
    });

    test('should search within definitions', () => {
      const results = searchKeywords('javascript');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => 
        r.definition.toLowerCase().includes('javascript')
      )).toBe(true);
    });

    test('should filter by category', () => {
      const devResults = searchKeywords('react', 'dev');
      const designResults = searchKeywords('react', 'design');
      
      expect(devResults.length).toBeGreaterThan(0);
      devResults.forEach(result => {
        expect(result.category).toBe('dev');
      });

      designResults.forEach(result => {
        expect(result.category).toBe('design');
      });
    });

    test('should include synonyms in search', () => {
      const results = searchKeywords('ts');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.synonyms.includes('ts'))).toBe(true);
    });
  });

  describe('Category Functions', () => {
    test('should return keywords by category', () => {
      const devCategories = getKeywordsByCategory('dev');
      const designCategories = getKeywordsByCategory('design');
      const bothCategories = getKeywordsByCategory('both');

      expect(devCategories.length).toBeGreaterThan(0);
      expect(designCategories.length).toBeGreaterThan(0);
      expect(bothCategories.length).toBeGreaterThan(0);

      devCategories.forEach(cat => {
        cat.keywords.forEach(keyword => {
          expect(keyword.category).toBe('dev');
        });
      });
    });

    test('should return keywords by subcategory', () => {
      const frameworkKeywords = getKeywordsBySubcategory('frameworks');
      expect(frameworkKeywords.length).toBeGreaterThan(0);
      
      frameworkKeywords.forEach(keyword => {
        expect(keyword.subcategory).toBe('frameworks');
      });
    });

    test('should return high priority keywords', () => {
      const highPriority = getHighPriorityKeywords();
      expect(highPriority.length).toBeGreaterThan(0);
      
      highPriority.forEach(keyword => {
        expect(keyword.priority).toBe('high');
      });
    });

    test('should return related keywords', () => {
      const related = getRelatedKeywords('react');
      expect(related.length).toBeGreaterThan(0);
      
      related.forEach(keyword => {
        expect(keyword.related.includes('react') || 
               keyword.keyword === 'react' ||
               keyword.related.some(rel => rel === 'react')).toBe(true);
      });
    });
  });
});

describe('Advanced Search Functions', () => {
  describe('Advanced Search', () => {
    test('should return search results with relevance scores', () => {
      const results = advancedSearch('react', { limit: 10 });
      expect(results.length).toBeGreaterThan(0);
      
      results.forEach(result => {
        expect(result).toHaveProperty('keyword');
        expect(result).toHaveProperty('relevanceScore');
        expect(result).toHaveProperty('matchedFields');
        expect(result.relevanceScore).toBeGreaterThan(0);
        expect(Array.isArray(result.matchedFields)).toBe(true);
      });
    });

    test('should sort results by relevance score', () => {
      const results = advancedSearch('react', { limit: 10 });
      expect(results.length).toBeGreaterThan(0);
      
      for (let i = 1; i < results.length; i++) {
        expect(results[i].relevanceScore).toBeLessThanOrEqual(results[i - 1].relevanceScore);
      }
    });

    test('should respect category filter', () => {
      const devResults = advancedSearch('react', { category: 'dev' });
      const designResults = advancedSearch('react', { category: 'design' });
      
      devResults.forEach(result => {
        expect(result.keyword.category).toBe('dev');
      });
      
      designResults.forEach(result => {
        expect(result.keyword.category).toBe('design');
      });
    });

    test('should respect priority filter', () => {
      const highResults = advancedSearch('react', { priority: 'high' });
      
      highResults.forEach(result => {
        expect(result.keyword.priority).toBe('high');
      });
    });

    test('should limit results correctly', () => {
      const limitedResults = advancedSearch('react', { limit: 5 });
      expect(limitedResults.length).toBeLessThanOrEqual(5);
    });

    test('should handle empty search query', () => {
      const results = advancedSearch('', { limit: 10 });
      expect(results.length).toBe(0);
    });

    test('should handle non-existent keyword', () => {
      const results = advancedSearch('nonexistentkeyword12345', { limit: 10 });
      expect(results.length).toBe(0);
    });
  });

  describe('Keyword Suggestions', () => {
    test('should return suggestions for partial input', () => {
      const suggestions = getKeywordSuggestions('rea');
      expect(suggestions.length).toBeGreaterThan(0);
      
      suggestions.forEach(suggestion => {
        expect(suggestion).toHaveProperty('keyword');
        expect(suggestion).toHaveProperty('confidence');
        expect(suggestion).toHaveProperty('reason');
        expect(suggestion).toHaveProperty('category');
        expect(suggestion.confidence).toBeGreaterThan(0);
        expect(suggestion.confidence).toBeLessThanOrEqual(100);
      });
    });

    test('should sort suggestions by confidence', () => {
      const suggestions = getKeywordSuggestions('rea', 10);
      expect(suggestions.length).toBeGreaterThan(0);
      
      for (let i = 1; i < suggestions.length; i++) {
        expect(suggestions[i].confidence).toBeLessThanOrEqual(suggestions[i - 1].confidence);
      }
    });

    test('should limit suggestions correctly', () => {
      const limitedSuggestions = getKeywordSuggestions('rea', 3);
      expect(limitedSuggestions.length).toBeLessThanOrEqual(3);
    });

    test('should return empty suggestions for very short input', () => {
      const suggestions = getKeywordSuggestions('r');
      expect(suggestions.length).toBe(0);
    });
  });

  describe('Analytics', () => {
    test('should return keyword analytics', () => {
      const analytics = getKeywordAnalytics();
      
      expect(analytics).toHaveProperty('totalKeywords');
      expect(analytics).toHaveProperty('categoryDistribution');
      expect(analytics).toHaveProperty('priorityDistribution');
      expect(analytics).toHaveProperty('mostRelevant');
      expect(analytics).toHaveProperty('trending');
      
      expect(analytics.totalKeywords).toBeGreaterThan(0);
      expect(Object.keys(analytics.categoryDistribution).length).toBeGreaterThan(0);
      expect(Object.keys(analytics.priorityDistribution).length).toBeGreaterThan(0);
      expect(analytics.mostRelevant.length).toBeGreaterThan(0);
      expect(analytics.trending.length).toBeGreaterThan(0);
    });

    test('should have correct category distribution totals', () => {
      const analytics = getKeywordAnalytics();
      const totalFromCategories = Object.values(analytics.categoryDistribution)
        .reduce((sum, count) => sum + count, 0);
      
      expect(totalFromCategories).toBe(analytics.totalKeywords);
    });

    test('should have correct priority distribution totals', () => {
      const analytics = getKeywordAnalytics();
      const totalFromPriorities = Object.values(analytics.priorityDistribution)
        .reduce((sum, count) => sum + count, 0);
      
      expect(totalFromPriorities).toBe(analytics.totalKeywords);
    });
  });

  describe('Context Search', () => {
    test('should find keywords by context', () => {
      const results = findKeywordsByContext('web development');
      expect(results.length).toBeGreaterThan(0);
      
      results.forEach(keyword => {
        const hasContextMatch = keyword.context?.toLowerCase().includes('web development') ||
          keyword.examples?.some(example => example.toLowerCase().includes('web development'));
        expect(hasContextMatch).toBe(true);
      });
    });

    test('should handle empty context search', () => {
      const results = findKeywordsByContext('');
      expect(results.length).toBe(0);
    });
  });

  describe('Keyword Network', () => {
    test('should return keyword network for valid keyword', () => {
      const network = getKeywordNetwork('react');
      
      expect(network).toHaveProperty('keyword');
      expect(network).toHaveProperty('synonyms');
      expect(network).toHaveProperty('related');
      expect(network).toHaveProperty('category');
      
      expect(network.keyword.keyword).toBe('react');
      expect(Array.isArray(network.synonyms)).toBe(true);
      expect(Array.isArray(network.related)).toBe(true);
      expect(Array.isArray(network.category)).toBe(true);
    });

    test('should throw error for non-existent keyword', () => {
      expect(() => {
        getKeywordNetwork('nonexistentkeyword12345');
      }).toThrow('Keyword "nonexistentkeyword12345" not found');
    });

    test('should return correct network relationships', () => {
      const network = getKeywordNetwork('react');
      
      // Check that related keywords are actually related
      network.related.forEach(keyword => {
        expect(keyword.related.includes('react') || 
               keyword.keyword === 'react').toBe(true);
      });
      
      // Check that category keywords are in same category
      network.category.forEach(keyword => {
        expect(keyword.category).toBe(network.keyword.category);
      });
    });
  });

  describe('Export/Import Functions', () => {
    test('should export keywords as JSON', () => {
      const jsonExport = exportKeywords('json');
      expect(jsonExport).toBeDefined();
      
      const parsed = JSON.parse(jsonExport);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBeGreaterThan(0);
      
      parsed.forEach((keyword: any) => {
        expect(keyword).toHaveProperty('keyword');
        expect(keyword).toHaveProperty('category');
        expect(keyword).toHaveProperty('definition');
      });
    });

    test('should export keywords as CSV', () => {
      const csvExport = exportKeywords('csv');
      expect(csvExport).toBeDefined();
      expect(csvExport).toContain('keyword,category,subcategory');
      
      const lines = csvExport.split('\n');
      expect(lines.length).toBeGreaterThan(1); // Header + at least one data row
    });

    test('should export keywords as XML', () => {
      const xmlExport = exportKeywords('xml');
      expect(xmlExport).toBeDefined();
      expect(xmlExport).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xmlExport).toContain('<keywords>');
      expect(xmlExport).toContain('</keywords>');
    });

    test('should import keywords from JSON', () => {
      const originalData = exportKeywords('json');
      const imported = importKeywords(originalData, 'json');
      
      expect(Array.isArray(imported)).toBe(true);
      expect(imported.length).toBeGreaterThan(0);
      
      imported.forEach((keyword: KeywordEntry) => {
        expect(keyword).toHaveProperty('keyword');
        expect(keyword).toHaveProperty('category');
        expect(keyword).toHaveProperty('definition');
      });
    });

    test('should handle invalid JSON import', () => {
      expect(() => {
        importKeywords('invalid json', 'json');
      }).toThrow();
    });

    test('should handle unsupported export format', () => {
      expect(() => {
        exportKeywords('yaml' as any);
      }).toThrow('Unsupported export format: yaml');
    });
  });
});

describe('Fuzzy Matching', () => {
  test('should find fuzzy matches for typos', () => {
    const results = advancedSearch('reat', { fuzzySearch: true });
    expect(results.length).toBeGreaterThan(0);
    
    results.forEach(result => {
      expect(result.matchedFields).toContain('fuzzy');
    });
  });

  test('should not find fuzzy matches when disabled', () => {
    const fuzzyResults = advancedSearch('reat', { fuzzySearch: true });
    const noFuzzyResults = advancedSearch('reat', { fuzzySearch: false });
    
    expect(fuzzyResults.length).toBeGreaterThan(noFuzzyResults.length);
  });
});

describe('Performance Tests', () => {
  test('should handle large search queries efficiently', () => {
    const start = performance.now();
    const results = advancedSearch('a', { limit: 100 });
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    expect(results.length).toBeGreaterThan(0);
  });

  test('should handle analytics generation efficiently', () => {
    const start = performance.now();
    const analytics = getKeywordAnalytics();
    const end = performance.now();
    
    expect(end - start).toBeLessThan(50); // Should complete in less than 50ms
    expect(analytics.totalKeywords).toBeGreaterThan(0);
  });
});

describe('Edge Cases', () => {
  test('should handle special characters in search', () => {
    const results = advancedSearch('c++', { fuzzySearch: true });
    expect(results.length).toBeGreaterThanOrEqual(0);
  });

  test('should handle very long search queries', () => {
    const longQuery = 'a'.repeat(100);
    const results = advancedSearch(longQuery);
    expect(results.length).toBe(0);
  });

  test('should handle null/undefined inputs gracefully', () => {
    expect(() => {
      searchKeywords(null as any);
    }).not.toThrow();
    
    expect(() => {
      searchKeywords(undefined as any);
    }).not.toThrow();
  });
});

describe('Integration Tests', () => {
  test('should work end-to-end: search -> suggest -> network -> export', () => {
    // Search for a keyword
    const searchResults = advancedSearch('react', { limit: 1 });
    expect(searchResults.length).toBeGreaterThan(0);
    
    const keyword = searchResults[0].keyword;
    
    // Get suggestions
    const suggestions = getKeywordSuggestions(keyword.keyword.substring(0, 3));
    expect(suggestions.length).toBeGreaterThan(0);
    
    // Get network
    const network = getKeywordNetwork(keyword.keyword);
    expect(network.keyword.keyword).toBe(keyword.keyword);
    
    // Export
    const exportData = exportKeywords('json');
    expect(exportData).toBeDefined();
    expect(exportData.length).toBeGreaterThan(0);
  });

  test('should maintain consistency across all operations', () => {
    const analytics = getKeywordAnalytics();
    const highPriority = getHighPriorityKeywords();
    const allDev = getKeywordsByCategory('dev');
    
    // Check that high priority count matches analytics
    expect(highPriority.length).toBe(analytics.priorityDistribution.high);
    
    // Check that category counts match analytics
    const devCount = allDev.flatMap(cat => cat.keywords).length;
    expect(devCount).toBe(analytics.categoryDistribution.dev);
  });
});
