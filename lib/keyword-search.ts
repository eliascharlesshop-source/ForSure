// Advanced Keyword Search and Analysis Utilities
// Built on top of the keyword database for intelligent search and categorization

import { KeywordEntry, KeywordCategory, KEYWORD_DATABASE, searchKeywords } from './keyword-database';

export interface SearchOptions {
  category?: 'dev' | 'design' | 'both';
  subcategory?: string;
  priority?: 'high' | 'medium' | 'low';
  includeSynonyms?: boolean;
  includeRelated?: boolean;
  fuzzySearch?: boolean;
  limit?: number;
}

export interface SearchResult {
  keyword: KeywordEntry;
  relevanceScore: number;
  matchedFields: string[];
  context?: string;
}

export interface KeywordAnalytics {
  totalKeywords: number;
  categoryDistribution: Record<string, number>;
  priorityDistribution: Record<string, number>;
  mostRelevant: KeywordEntry[];
  trending: string[];
}

export interface KeywordSuggestion {
  keyword: string;
  confidence: number;
  reason: string;
  category: 'dev' | 'design' | 'both';
}

// Advanced search with relevance scoring
export const advancedSearch = (query: string, options: SearchOptions = {}): SearchResult[] => {
  const {
    category,
    subcategory,
    priority,
    includeSynonyms = true,
    includeRelated = true,
    fuzzySearch = true,
    limit = 50
  } = options;

  let keywords: KeywordEntry[] = [];

  // Get base keywords
  if (category) {
    const categories = KEYWORD_DATABASE[category];
    keywords = categories.flatMap(cat => cat.keywords);
  } else {
    keywords = Object.values(KEYWORD_DATABASE).flatMap(cats => 
      cats.flatMap(cat => cat.keywords)
    );
  }

  // Apply filters
  if (subcategory) {
    keywords = keywords.filter(k => k.subcategory === subcategory);
  }
  if (priority) {
    keywords = keywords.filter(k => k.priority === priority);
  }

  // Calculate relevance scores
  const results: SearchResult[] = keywords.map(keyword => {
    let score = 0;
    const matchedFields: string[] = [];
    const lowerQuery = query.toLowerCase();

    // Exact match in keyword
    if (keyword.keyword === lowerQuery) {
      score += 100;
      matchedFields.push('exact_keyword');
    } else if (keyword.keyword.includes(lowerQuery)) {
      score += 80;
      matchedFields.push('partial_keyword');
    }

    // Definition match
    if (keyword.definition.toLowerCase().includes(lowerQuery)) {
      score += 60;
      matchedFields.push('definition');
    }

    // Synonym matches
    if (includeSynonyms) {
      keyword.synonyms.forEach(syn => {
        if (syn.toLowerCase() === lowerQuery) {
          score += 70;
          matchedFields.push('exact_synonym');
        } else if (syn.toLowerCase().includes(lowerQuery)) {
          score += 50;
          matchedFields.push('partial_synonym');
        }
      });
    }

    // Related keywords
    if (includeRelated) {
      keyword.related.forEach(rel => {
        if (rel.toLowerCase() === lowerQuery) {
          score += 40;
          matchedFields.push('exact_related');
        } else if (rel.toLowerCase().includes(lowerQuery)) {
          score += 20;
          matchedFields.push('partial_related');
        }
      });
    }

    // Context match
    if (keyword.context?.toLowerCase().includes(lowerQuery)) {
      score += 30;
      matchedFields.push('context');
    }

    // Examples match
    if (keyword.examples) {
      keyword.examples.forEach(example => {
        if (example.toLowerCase().includes(lowerQuery)) {
          score += 25;
          matchedFields.push('example');
        }
      });
    }

    // Priority boost
    const priorityBoost = keyword.priority === 'high' ? 10 : keyword.priority === 'medium' ? 5 : 0;
    score += priorityBoost;

    // Fuzzy search bonus
    if (fuzzySearch && isFuzzyMatch(lowerQuery, keyword.keyword)) {
      score += 15;
      matchedFields.push('fuzzy');
    }

    return {
      keyword,
      relevanceScore: score,
      matchedFields,
      context: keyword.context
    };
  });

  // Sort by relevance score and limit results
  return results
    .filter(result => result.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
};

// Fuzzy matching for typos and variations
const isFuzzyMatch = (query: string, target: string): boolean => {
  if (query.length < 3) return false;
  
  const distance = levenshteinDistance(query, target);
  const maxLength = Math.max(query.length, target.length);
  const similarity = 1 - distance / maxLength;
  
  return similarity > 0.7; // 70% similarity threshold
};

// Levenshtein distance algorithm for fuzzy matching
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => 
    Array(str1.length + 1).fill(null)
  );

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[str2.length][str1.length];
};

// Get keyword suggestions based on partial input
export const getKeywordSuggestions = (partial: string, limit: number = 10): KeywordSuggestion[] => {
  const allKeywords: KeywordEntry[] = Object.values(KEYWORD_DATABASE).flatMap(cats => 
    cats.flatMap(cat => cat.keywords)
  );

  const lowerPartial = partial.toLowerCase();
  const suggestions: KeywordSuggestion[] = [];

  allKeywords.forEach(keyword => {
    let confidence = 0;
    let reason = '';

    // Exact prefix match
    if (keyword.keyword.startsWith(lowerPartial)) {
      confidence = 90;
      reason = 'Exact prefix match';
    }
    // Contains match
    else if (keyword.keyword.includes(lowerPartial)) {
      confidence = 70;
      reason = 'Contains match';
    }
    // Synonym match
    else if (keyword.synonyms.some(syn => syn.toLowerCase().includes(lowerPartial))) {
      confidence = 60;
      reason = 'Synonym match';
    }
    // Related keyword match
    else if (keyword.related.some(rel => rel.toLowerCase().includes(lowerPartial))) {
      confidence = 40;
      reason = 'Related keyword';
    }
    // Fuzzy match
    else if (isFuzzyMatch(lowerPartial, keyword.keyword)) {
      confidence = 30;
      reason = 'Similar spelling';
    }

    if (confidence > 0) {
      suggestions.push({
        keyword: keyword.keyword,
        confidence,
        reason,
        category: keyword.category
      });
    }
  });

  return suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);
};

// Get analytics about the keyword database
export const getKeywordAnalytics = (): KeywordAnalytics => {
  const allKeywords: KeywordEntry[] = Object.values(KEYWORD_DATABASE).flatMap(cats => 
    cats.flatMap(cat => cat.keywords)
  );

  // Category distribution
  const categoryDistribution: Record<string, number> = {};
  allKeywords.forEach(keyword => {
    categoryDistribution[keyword.category] = (categoryDistribution[keyword.category] || 0) + 1;
  });

  // Priority distribution
  const priorityDistribution: Record<string, number> = {};
  allKeywords.forEach(keyword => {
    priorityDistribution[keyword.priority] = (priorityDistribution[keyword.priority] || 0) + 1;
  });

  // Most relevant (high priority)
  const mostRelevant = allKeywords.filter(k => k.priority === 'high');

  // Trending keywords (would be based on usage data in a real implementation)
  const trending = [
    'typescript',
    'react',
    'design system',
    'accessibility',
    'responsive design',
    'user experience',
    'api',
    'component'
  ];

  return {
    totalKeywords: allKeywords.length,
    categoryDistribution,
    priorityDistribution,
    mostRelevant,
    trending
  };
};

// Find keywords by context
export const findKeywordsByContext = (context: string): KeywordEntry[] => {
  const allKeywords: KeywordEntry[] = Object.values(KEYWORD_DATABASE).flatMap(cats => 
    cats.flatMap(cat => cat.keywords)
  );

  const lowerContext = context.toLowerCase();
  return allKeywords.filter(keyword => 
    keyword.context?.toLowerCase().includes(lowerContext) ||
    keyword.examples?.some(example => example.toLowerCase().includes(lowerContext))
  );
};

// Get keyword network (relationships between keywords)
export const getKeywordNetwork = (keyword: string): {
  keyword: KeywordEntry;
  synonyms: KeywordEntry[];
  related: KeywordEntry[];
  category: KeywordEntry[];
} => {
  const allKeywords: KeywordEntry[] = Object.values(KEYWORD_DATABASE).flatMap(cats => 
    cats.flatMap(cat => cat.keywords)
  );

  const targetKeyword = allKeywords.find(k => k.keyword === keyword.toLowerCase());
  if (!targetKeyword) {
    throw new Error(`Keyword "${keyword}" not found`);
  }

  // Find synonym keywords
  const synonyms = allKeywords.filter(k => 
    targetKeyword.synonyms.includes(k.keyword) ||
    k.synonyms.includes(targetKeyword.keyword)
  );

  // Find related keywords
  const related = allKeywords.filter(k => 
    targetKeyword.related.includes(k.keyword) ||
    k.related.includes(targetKeyword.keyword)
  );

  // Find keywords in same category
  const category = allKeywords.filter(k => 
    k.category === targetKeyword.category && 
    k.keyword !== targetKeyword.keyword
  );

  return {
    keyword: targetKeyword,
    synonyms,
    related,
    category
  };
};

// Export keyword database to different formats
export const exportKeywords = (format: 'json' | 'csv' | 'xml' = 'json'): string => {
  const allKeywords: KeywordEntry[] = Object.values(KEYWORD_DATABASE).flatMap(cats => 
    cats.flatMap(cat => cat.keywords)
  );

  switch (format) {
    case 'json':
      return JSON.stringify(allKeywords, null, 2);
    
    case 'csv':
      const headers = ['keyword', 'category', 'subcategory', 'definition', 'synonyms', 'related', 'priority', 'context'];
      const csvRows = [headers.join(',')];
      
      allKeywords.forEach(keyword => {
        const row = [
          keyword.keyword,
          keyword.category,
          keyword.subcategory,
          `"${keyword.definition.replace(/"/g, '""')}"`,
          `"${keyword.synonyms.join('; ')}"`,
          `"${keyword.related.join('; ')}"`,
          keyword.priority,
          keyword.context || ''
        ];
        csvRows.push(row.join(','));
      });
      
      return csvRows.join('\n');
    
    case 'xml':
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<keywords>\n';
      
      allKeywords.forEach(keyword => {
        xml += '  <keyword>\n';
        xml += `    <term>${keyword.keyword}</term>\n`;
        xml += `    <category>${keyword.category}</category>\n`;
        xml += `    <subcategory>${keyword.subcategory}</subcategory>\n`;
        xml += `    <definition>${keyword.definition}</definition>\n`;
        xml += `    <synonyms>${keyword.synonyms.join(', ')}</synonyms>\n`;
        xml += `    <related>${keyword.related.join(', ')}</related>\n`;
        xml += `    <priority>${keyword.priority}</priority>\n`;
        if (keyword.context) {
          xml += `    <context>${keyword.context}</context>\n`;
        }
        xml += '  </keyword>\n';
      });
      
      xml += '</keywords>';
      return xml;
    
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

// Import keywords from external source
export const importKeywords = (data: string, format: 'json' | 'csv' = 'json'): KeywordEntry[] => {
  try {
    switch (format) {
      case 'json':
        return JSON.parse(data) as KeywordEntry[];
      
      case 'csv':
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        
        return lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            keyword: values[0],
            category: values[1] as 'dev' | 'design' | 'both',
            subcategory: values[2],
            definition: values[3].replace(/"/g, ''),
            synonyms: values[4].replace(/"/g, '').split('; '),
            related: values[5].replace(/"/g, '').split('; '),
            priority: values[6] as 'high' | 'medium' | 'low',
            context: values[7] || undefined
          };
        });
      
      default:
        throw new Error(`Unsupported import format: ${format}`);
    }
  } catch (error) {
    throw new Error(`Failed to import keywords: ${error}`);
  }
};

// Get keywords by category
export const getKeywordsByCategory = (category?: 'dev' | 'design' | 'both'): KeywordEntry[] => {
  const allKeywords: KeywordEntry[] = Object.values(KEYWORD_DATABASE).flatMap(cats => 
    cats.flatMap(cat => cat.keywords)
  );

  if (!category || category === 'both') {
    return allKeywords;
  }

  return allKeywords.filter(k => k.category === category);
};

// Get high priority keywords
export const getHighPriorityKeywords = (limit: number = 20): KeywordEntry[] => {
  const allKeywords: KeywordEntry[] = Object.values(KEYWORD_DATABASE).flatMap(cats => 
    cats.flatMap(cat => cat.keywords)
  );

  return allKeywords
    .filter(k => k.priority === 'high')
    .slice(0, limit);
};

// Export all utilities
export type {
  KeywordEntry,
  KeywordCategory,
  SearchResult,
  SearchOptions,
  KeywordAnalytics,
  KeywordSuggestion
};
