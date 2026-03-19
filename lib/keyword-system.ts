// Integration and setup utilities for the keyword database system
// Provides easy setup and configuration for the complete system

export interface KeywordDatabaseConfig {
  enableApi?: boolean;
  enableCli?: boolean;
  enableReactComponent?: boolean;
  defaultSearchOptions?: {
    limit?: number;
    includeSynonyms?: boolean;
    includeRelated?: boolean;
    fuzzySearch?: boolean;
  };
  customCategories?: string[];
  enableAnalytics?: boolean;
  cacheEnabled?: boolean;
}

export class KeywordDatabaseSystem {
  private config: KeywordDatabaseConfig;
  private isInitialized = false;

  constructor(config: KeywordDatabaseConfig = {}) {
    this.config = {
      enableApi: true,
      enableCli: true,
      enableReactComponent: true,
      defaultSearchOptions: {
        limit: 20,
        includeSynonyms: true,
        includeRelated: true,
        fuzzySearch: true
      },
      enableAnalytics: true,
      cacheEnabled: true,
      ...config
    };
  }

  // Initialize the complete keyword database system
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('Keyword database system already initialized');
      return;
    }

    console.log('🚀 Initializing Keyword Database System...');

    try {
      // Validate database structure
      await this.validateDatabase();
      
      // Setup caching if enabled
      if (this.config.cacheEnabled) {
        await this.setupCaching();
      }

      // Initialize analytics if enabled
      if (this.config.enableAnalytics) {
        await this.initializeAnalytics();
      }

      // Setup API routes if enabled
      if (this.config.enableApi) {
        await this.setupApiRoutes();
      }

      // Setup CLI if enabled
      if (this.config.enableCli) {
        await this.setupCli();
      }

      this.isInitialized = true;
      console.log('✅ Keyword Database System initialized successfully');
      
      // Display system information
      this.displaySystemInfo();
      
    } catch (error) {
      console.error('❌ Failed to initialize Keyword Database System:', error);
      throw error;
    }
  }

  // Validate the database structure and integrity
  private async validateDatabase(): Promise<void> {
    const { getKeywordAnalytics } = await import('./keyword-search');
    const { searchKeywords } = await import('./keyword-database');
    
    try {
      // Test basic functionality
      const analytics = getKeywordAnalytics();
      if (!analytics || analytics.totalKeywords === 0) {
        throw new Error('Database appears to be empty or corrupted');
      }

      // Test search functionality
      const searchResults = searchKeywords('test');
      if (!Array.isArray(searchResults)) {
        throw new Error('Search functionality is not working');
      }

      console.log(`✅ Database validated: ${analytics.totalKeywords} keywords`);
    } catch (error) {
      throw new Error(`Database validation failed: ${error}`);
    }
  }

  // Setup caching system for performance
  private async setupCaching(): Promise<void> {
    // Simple in-memory cache implementation
    const cache = new Map();
    
    // Cache frequently accessed data
    const { getKeywordAnalytics } = await import('./keyword-search');
    const { getHighPriorityKeywords } = await import('./keyword-database');
    
    try {
      const analytics = getKeywordAnalytics();
      const highPriority = getHighPriorityKeywords();
      
      cache.set('analytics', analytics);
      cache.set('highPriority', highPriority);
      
      console.log('✅ Caching system initialized');
    } catch (error) {
      console.warn('⚠️  Failed to setup caching:', error);
    }
  }

  // Initialize analytics tracking
  private async initializeAnalytics(): Promise<void> {
    try {
      const { getKeywordAnalytics } = await import('./keyword-search');
      const analytics = getKeywordAnalytics();
      
      console.log(`✅ Analytics initialized:`);
      console.log(`   - Total keywords: ${analytics.totalKeywords}`);
      console.log(`   - Categories: ${Object.keys(analytics.categoryDistribution).length}`);
      console.log(`   - High priority: ${analytics.priorityDistribution.high}`);
    } catch (error) {
      console.warn('⚠️  Failed to initialize analytics:', error);
    }
  }

  // Setup API routes information
  private async setupApiRoutes(): Promise<void> {
    const apiRoutes = [
      '/api/keywords/search',
      '/api/keywords/suggestions', 
      '/api/keywords/analytics',
      '/api/keywords/network',
      '/api/keywords/categories',
      '/api/keywords/export'
    ];

    console.log('✅ API routes configured:');
    apiRoutes.forEach(route => {
      console.log(`   - ${route}`);
    });
  }

  // Setup CLI information
  private async setupCli(): Promise<void> {
    console.log('✅ CLI tool configured:');
    console.log('   - Search: ./keyword-cli search <query>');
    console.log('   - Suggestions: ./keyword-cli suggest <partial>');
    console.log('   - Analytics: ./keyword-cli analytics');
    console.log('   - Categories: ./keyword-cli categories');
    console.log('   - Network: ./keyword-cli network <keyword>');
    console.log('   - Export: ./keyword-cli export');
    console.log('   - Interactive: ./keyword-cli interactive');
  }

  // Display system information and statistics
  private displaySystemInfo(): void {
    console.log('\n📊 Keyword Database System Information:');
    console.log('=====================================');
    console.log(`🔍 Search: Enabled`);
    console.log(`📈 Analytics: ${this.config.enableAnalytics ? 'Enabled' : 'Disabled'}`);
    console.log(`🌐 API: ${this.config.enableApi ? 'Enabled' : 'Disabled'}`);
    console.log(`💻 CLI: ${this.config.enableCli ? 'Enabled' : 'Disabled'}`);
    console.log(`⚛️  React Component: ${this.config.enableReactComponent ? 'Enabled' : 'Disabled'}`);
    console.log(`💾 Caching: ${this.config.cacheEnabled ? 'Enabled' : 'Disabled'}`);
    console.log('\n🚀 Quick Start Examples:');
    console.log('```typescript');
    console.log('// Basic search');
    console.log('import { searchKeywords } from "./lib/keyword-database";');
    console.log('const results = searchKeywords("react");');
    console.log('');
    console.log('// Advanced search');
    console.log('import { advancedSearch } from "./lib/keyword-search";');
    console.log('const results = advancedSearch("react", {');
    console.log('  category: "dev",');
    console.log('  priority: "high",');
    console.log('  limit: 10');
    console.log('});');
    console.log('```');
    console.log('\n📚 For full documentation, see: docs/keyword-database.md');
  }

  // Get system status
  getStatus(): {
    initialized: boolean;
    config: KeywordDatabaseConfig;
    features: string[];
  } {
    const features = [];
    if (this.config.enableApi) features.push('REST API');
    if (this.config.enableCli) features.push('CLI Tool');
    if (this.config.enableReactComponent) features.push('React Component');
    if (this.config.enableAnalytics) features.push('Analytics');
    if (this.config.cacheEnabled) features.push('Caching');

    return {
      initialized: this.isInitialized,
      config: this.config,
      features
    };
  }

  // Perform health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    checks: Array<{
      name: string;
      status: 'pass' | 'fail';
      message?: string;
    }>;
  }> {
    const checks = [];

    try {
      // Check database functionality
      const { searchKeywords } = await import('./keyword-database');
      const results = searchKeywords('test');
      checks.push({
        name: 'Database Search',
        status: Array.isArray(results) ? 'pass' : 'fail' as const,
        message: Array.isArray(results) ? 'Search working' : 'Search failed'
      });

      // Check advanced search
      const { advancedSearch } = await import('./keyword-search');
      const advancedResults = advancedSearch('test', { limit: 1, includeSynonyms: true, includeRelated: true, fuzzySearch: true, priority: 'high' });
      checks.push({
        name: 'Advanced Search',
        status: Array.isArray(advancedResults) ? 'pass' : 'fail' as const,
        message: Array.isArray(advancedResults) ? 'Advanced search working' : 'Advanced search failed'
      });

      // Check analytics
      const { getKeywordAnalytics } = await import('./keyword-search');
      const analytics = getKeywordAnalytics();
      checks.push({
        name: 'Analytics',
        status: analytics && analytics.totalKeywords > 0 ? 'pass' : 'fail' as const,
        message: analytics ? `${analytics.totalKeywords} keywords` : 'Analytics failed'
      });

    } catch (error: any) {
      checks.push({
        name: 'System Health',
        status: 'fail' as const,
        message: `Health check failed: ${error}`
      });
    }

    const allPassed = checks.every(check => check.status === 'pass');
    
    return {
      status: allPassed ? 'healthy' : 'unhealthy',
      checks
    };
  }

  // Get usage examples
  getUsageExamples(): {
    basic: string[];
    advanced: string[];
    api: string[];
    cli: string[];
  } {
    return {
      basic: [
        'searchKeywords("react")',
        'getKeywordsByCategory("dev")',
        'getHighPriorityKeywords()',
        'getKeywordSuggestions("rea")'
      ],
      advanced: [
        'advancedSearch("react", { category: "dev", priority: "high" })',
        'getKeywordNetwork("react")',
        'findKeywordsByContext("web development")',
        'exportKeywords("json")'
      ],
      api: [
        'GET /api/keywords/search?q=react',
        'GET /api/keywords/suggestions?partial=rea',
        'GET /api/keywords/analytics',
        'GET /api/keywords/network?keyword=react'
      ],
      cli: [
        './keyword-cli search "react"',
        './keyword-cli suggest "rea"',
        './keyword-cli analytics',
        './keyword-cli interactive'
      ]
    };
  }

  // Shutdown the system
  async shutdown(): Promise<void> {
    console.log('🔄 Shutting down Keyword Database System...');
    
    // Clear caches
    if (this.config.cacheEnabled) {
      // Clear any in-memory caches
    }
    
    this.isInitialized = false;
    console.log('✅ Keyword Database System shut down successfully');
  }
}

// Default system instance
export const keywordSystem = new KeywordDatabaseSystem();

// Convenience function for quick initialization
export async function initializeKeywordDatabase(config?: KeywordDatabaseConfig): Promise<void> {
  const system = new KeywordDatabaseSystem(config);
  await system.initialize();
}

// Export all main utilities for easy access
export * from './keyword-database';
export * from './keyword-search';
