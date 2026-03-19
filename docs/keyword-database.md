// Documentation for the Dev & Design Keyword Database
// Complete guide for using the keyword database system

# Dev & Design Keyword Database

A comprehensive keyword database system for development and design terminology, featuring advanced search capabilities, analytics, and management tools.

## Overview

The keyword database provides:
- **200+ keywords** covering development, design, and interdisciplinary topics
- **Advanced search** with fuzzy matching and relevance scoring
- **Category-based organization** (dev, design, both)
- **Priority levels** (high, medium, low)
- **Relationship mapping** (synonyms, related keywords)
- **Multiple export formats** (JSON, CSV, XML)
- **RESTful API** for integration
- **Interactive CLI** tool
- **React component** for web interfaces
- **Comprehensive testing** suite

## Installation

```bash
# Install dependencies
npm install

# The keyword database is included in the lib/ directory
```

## Quick Start

### Basic Search

```typescript
import { searchKeywords } from './lib/keyword-database';

// Simple search
const results = searchKeywords('react');
console.log(results); // Array of matching keywords

// Category-specific search
const devResults = searchKeywords('react', 'dev');
const designResults = searchKeywords('react', 'design');
```

### Advanced Search

```typescript
import { advancedSearch } from './lib/keyword-search';

const results = advancedSearch('react', {
  category: 'dev',
  priority: 'high',
  includeSynonyms: true,
  includeRelated: true,
  fuzzySearch: true,
  limit: 10
});

console.log(results);
// [
//   {
//     keyword: KeywordEntry,
//     relevanceScore: 95,
//     matchedFields: ['exact_keyword', 'definition'],
//     context: 'Frontend development'
//   }
// ]
```

### Keyword Suggestions

```typescript
import { getKeywordSuggestions } from './lib/keyword-search';

const suggestions = getKeywordSuggestions('rea', 5);
console.log(suggestions);
// [
//   {
//     keyword: 'react',
//     confidence: 90,
//     reason: 'Exact prefix match',
//     category: 'dev'
//   }
// ]
```

## API Reference

### Core Functions

#### `searchKeywords(query, category?)`
Search keywords by query string.

**Parameters:**
- `query: string` - Search query
- `category?: 'dev' | 'design' | 'both'` - Filter by category

**Returns:** `KeywordEntry[]`

#### `advancedSearch(query, options?)`
Advanced search with relevance scoring.

**Parameters:**
- `query: string` - Search query
- `options?: SearchOptions` - Search options

**Returns:** `SearchResult[]`

#### `getKeywordSuggestions(partial, limit?)`
Get keyword suggestions for partial input.

**Parameters:**
- `partial: string` - Partial keyword
- `limit?: number` - Number of suggestions

**Returns:** `KeywordSuggestion[]`

#### `getKeywordAnalytics()`
Get database analytics and statistics.

**Returns:** `KeywordAnalytics`

#### `getKeywordNetwork(keyword)`
Get keyword relationships and network.

**Parameters:**
- `keyword: string` - Keyword to analyze

**Returns:** `KeywordNetwork`

### Search Options

```typescript
interface SearchOptions {
  category?: 'dev' | 'design' | 'both';
  subcategory?: string;
  priority?: 'high' | 'medium' | 'low';
  includeSynonyms?: boolean;
  includeRelated?: boolean;
  fuzzySearch?: boolean;
  limit?: number;
}
```

### Data Types

#### KeywordEntry

```typescript
interface KeywordEntry {
  keyword: string;
  category: 'dev' | 'design' | 'both';
  subcategory: string;
  definition: string;
  synonyms: string[];
  related: string[];
  priority: 'high' | 'medium' | 'low';
  context?: string;
  examples?: string[];
}
```

#### SearchResult

```typescript
interface SearchResult {
  keyword: KeywordEntry;
  relevanceScore: number;
  matchedFields: string[];
  context?: string;
}
```

## REST API

### Search Endpoint

```http
GET /api/keywords/search?q=react&category=dev&limit=10
POST /api/keywords/search
Content-Type: application/json

{
  "query": "react",
  "category": "dev",
  "priority": "high",
  "limit": 10
}
```

### Suggestions Endpoint

```http
GET /api/keywords/suggestions?partial=rea&limit=5
```

### Analytics Endpoint

```http
GET /api/keywords/analytics
```

### Network Endpoint

```http
GET /api/keywords/network?keyword=react
```

### Categories Endpoint

```http
GET /api/keywords/categories?category=dev&priority=high
```

### Export Endpoint

```http
GET /api/keywords/export?format=json
GET /api/keywords/export?format=csv
GET /api/keywords/export?format=xml
```

## CLI Usage

### Installation

```bash
# Make the CLI executable
chmod +x bin/keyword-cli

# Or run with node
node bin/keyword-cli
```

### Commands

#### Search

```bash
# Basic search
./keyword-cli search "react"

# Advanced search with options
./keyword-cli search "react" --category dev --priority high --limit 5

# Disable fuzzy search
./keyword-cli search "react" --no-fuzzy
```

#### Suggestions

```bash
# Get suggestions
./keyword-cli suggest "rea" --limit 5
```

#### Analytics

```bash
# View analytics
./keyword-cli analytics
```

#### Categories

```bash
# Browse categories
./keyword-cli categories --category dev
```

#### Network

```bash
# Explore keyword network
./keyword-cli network "react"
```

#### Export

```bash
# Export database
./keyword-cli export --format json --output keywords.json
./keyword-cli export --format csv
./keyword-cli export --format xml
```

#### Interactive Mode

```bash
# Start interactive mode
./keyword-cli interactive
```

## React Component

### Usage

```typescript
import KeywordBrowser from './components/keyword-browser';

function App() {
  return (
    <div className="App">
      <KeywordBrowser className="w-full max-w-6xl mx-auto" />
    </div>
  );
}
```

### Features

- **Search Tab**: Advanced search with filters
- **Browse Tab**: Category-based browsing
- **Analytics Tab**: Database statistics and insights
- **Network Tab**: Keyword relationship visualization
- **Export**: Download in multiple formats
- **Interactive**: Click keywords for detailed information

## Database Structure

### Categories

#### Development (dev)
- **Programming Languages**: TypeScript, JavaScript, Python, Rust
- **Frameworks & Libraries**: React, Next.js, Node.js, Express
- **Development Practices**: Agile, TDD, CI/CD, Code Review
- **Database & Storage**: PostgreSQL, MongoDB, Redis
- **API & Integration**: REST API, GraphQL, Webhooks

#### Design (design)
- **Design Principles**: Hierarchy, Contrast, Balance, Unity
- **Color & Typography**: Color Theory, Typography, White Space
- **User Experience (UX)**: User Experience, Usability, Wireframe, Prototype
- **User Interface (UI)**: User Interface, Responsive Design, Accessibility
- **Design Tools & Software**: Figma, Sketch, Adobe Creative Suite

#### Combined (both)
- **Frontend Development**: Component, Design System, CSS, Animation
- **Product Development**: User Story, MVP, Iteration, Feedback

### Priority Levels

- **High**: Core concepts and frequently used terms
- **Medium**: Important but less common terms
- **Low**: Niche or specialized terminology

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test keyword-database.test.ts
```

### Test Coverage

The test suite covers:
- Database structure and integrity
- Search functionality
- Advanced search with filters
- Keyword suggestions
- Analytics generation
- Network analysis
- Export/import functionality
- Fuzzy matching
- Performance benchmarks
- Edge cases and error handling

## Performance

### Benchmarks

- **Search queries**: < 100ms for complex searches
- **Analytics generation**: < 50ms
- **Network analysis**: < 25ms
- **Export operations**: < 200ms for full database

### Optimization

- **Indexing**: Keywords indexed by category, priority, and relationships
- **Caching**: Frequently accessed data cached in memory
- **Lazy Loading**: Large datasets loaded on demand
- **Fuzzy Matching**: Optimized Levenshtein distance algorithm

## Contributing

### Adding New Keywords

```typescript
// Add to appropriate category in keyword-database.ts
{
  keyword: 'new-keyword',
  category: 'dev',
  subcategory: 'subcategory',
  definition: 'Clear definition',
  synonyms: ['synonym1', 'synonym2'],
  related: ['related1', 'related2'],
  priority: 'high',
  context: 'Usage context',
  examples: ['Example 1', 'Example 2']
}
```

### Testing New Keywords

```typescript
// Add tests for new keywords
test('should find new keyword', () => {
  const results = searchKeywords('new-keyword');
  expect(results.length).toBeGreaterThan(0);
  expect(results[0].keyword).toBe('new-keyword');
});
```

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add comprehensive tests
- Update documentation
- Ensure performance standards

## Integration Examples

### Next.js Integration

```typescript
// pages/api/search.ts
import { advancedSearch } from '../../lib/keyword-search';

export default async function handler(req, res) {
  const { query, category, priority } = req.query;
  
  const results = advancedSearch(query as string, {
    category: category as any,
    priority: priority as any
  });
  
  res.status(200).json({ results });
}
```

### Express.js Integration

```typescript
// server.ts
import express from 'express';
import { searchKeywords } from './lib/keyword-database';

const app = express();

app.get('/api/search', (req, res) => {
  const { q, category } = req.query;
  const results = searchKeywords(q as string, category as any);
  res.json({ results });
});

app.listen(3000);
```

### React Hook

```typescript
// hooks/useKeywordSearch.ts
import { useState, useCallback } from 'react';
import { advancedSearch, SearchOptions } from '../lib/keyword-search';

export function useKeywordSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback((query: string, options?: SearchOptions) => {
    setLoading(true);
    const searchResults = advancedSearch(query, options);
    setResults(searchResults);
    setLoading(false);
  }, []);

  return { results, loading, search };
}
```

## Troubleshooting

### Common Issues

#### Import Errors
```typescript
// Ensure correct import path
import { searchKeywords } from './lib/keyword-database';
```

#### Type Errors
```typescript
// Use proper TypeScript types
const results: SearchResult[] = advancedSearch('react');
```

#### Performance Issues
```typescript
// Use limits for large searches
const results = advancedSearch('react', { limit: 10 });
```

### Debug Mode

```typescript
// Enable debug logging
const results = advancedSearch('react', {
  limit: 10,
  debug: true // Enable debug output
});
```

## License

This keyword database system is part of the ForSure ecosystem and follows the same licensing terms.

## Support

For issues, questions, or contributions:
- Check the test suite for usage examples
- Review the API documentation
- Examine the CLI help commands
- Contact the development team
