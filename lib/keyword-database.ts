// Comprehensive Dev & Design Keyword Database
// Organized by categories for easy search and reference

export interface KeywordEntry {
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

export interface KeywordCategory {
  name: string;
  description: string;
  keywords: KeywordEntry[];
}

// Development Keywords Categories
export const DEV_KEYWORDS: KeywordCategory[] = [
  {
    name: 'Programming Languages',
    description: 'Programming languages and their key concepts',
    keywords: [
      {
        keyword: 'typescript',
        category: 'dev',
        subcategory: 'languages',
        definition: 'A typed superset of JavaScript that compiles to plain JavaScript',
        synonyms: ['ts', 'typed javascript'],
        related: ['javascript', 'types', 'interfaces', 'generics'],
        priority: 'high',
        context: 'Frontend and backend development',
        examples: ['TypeScript interfaces', 'Generic types', 'Type annotations']
      },
      {
        keyword: 'javascript',
        category: 'dev',
        subcategory: 'languages',
        definition: 'Dynamic programming language primarily used for web development',
        synonyms: ['js', 'ecmascript'],
        related: ['typescript', 'nodejs', 'react', 'vue'],
        priority: 'high',
        context: 'Web development',
        examples: ['ES6 features', 'Async/await', 'DOM manipulation']
      },
      {
        keyword: 'python',
        category: 'dev',
        subcategory: 'languages',
        definition: 'High-level programming language known for readability and versatility',
        synonyms: ['py'],
        related: ['django', 'flask', 'numpy', 'pandas'],
        priority: 'high',
        context: 'Backend development, data science, AI/ML',
        examples: ['Django framework', 'Data analysis', 'Machine learning']
      },
      {
        keyword: 'rust',
        category: 'dev',
        subcategory: 'languages',
        definition: 'Systems programming language focused on safety and performance',
        synonyms: ['rs'],
        related: ['c++', 'memory safety', 'webassembly'],
        priority: 'medium',
        context: 'Systems programming, WebAssembly',
        examples: ['Memory management', 'Concurrency', 'WebAssembly modules']
      }
    ]
  },
  {
    name: 'Frameworks & Libraries',
    description: 'Popular frameworks and libraries for development',
    keywords: [
      {
        keyword: 'react',
        category: 'dev',
        subcategory: 'frameworks',
        definition: 'JavaScript library for building user interfaces',
        synonyms: ['reactjs', 'jsx'],
        related: ['nextjs', 'redux', 'hooks', 'components'],
        priority: 'high',
        context: 'Frontend development',
        examples: ['React components', 'Hooks', 'State management']
      },
      {
        keyword: 'nextjs',
        category: 'dev',
        subcategory: 'frameworks',
        definition: 'React framework for production-grade applications',
        synonyms: ['next', 'next.js'],
        related: ['react', 'ssr', 'ssg', 'api routes'],
        priority: 'high',
        context: 'Full-stack React applications',
        examples: ['Server-side rendering', 'Static generation', 'API routes']
      },
      {
        keyword: 'nodejs',
        category: 'dev',
        subcategory: 'frameworks',
        definition: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
        synonyms: ['node', 'node.js'],
        related: ['npm', 'express', 'backend', 'javascript'],
        priority: 'high',
        context: 'Backend development',
        examples: ['Express.js', 'NPM packages', 'Server-side JavaScript']
      },
      {
        keyword: 'express',
        category: 'dev',
        subcategory: 'frameworks',
        definition: 'Fast, unopinionated, minimalist web framework for Node.js',
        synonyms: ['expressjs'],
        related: ['nodejs', 'middleware', 'api', 'rest'],
        priority: 'high',
        context: 'Backend API development',
        examples: ['REST API', 'Middleware', 'Routing']
      }
    ]
  },
  {
    name: 'Development Practices',
    description: 'Software development methodologies and practices',
    keywords: [
      {
        keyword: 'agile',
        category: 'dev',
        subcategory: 'methodology',
        definition: 'Iterative approach to project management and software development',
        synonyms: ['scrum', 'kanban'],
        related: ['sprints', 'backlog', 'standup', 'retrospective'],
        priority: 'high',
        context: 'Project management',
        examples: ['Sprint planning', 'Daily standups', 'Sprint retrospectives']
      },
      {
        keyword: 'tdd',
        category: 'dev',
        subcategory: 'testing',
        definition: 'Test-Driven Development - writing tests before code',
        synonyms: ['test driven development'],
        related: ['unit testing', 'integration testing', 'jest', 'cypress'],
        priority: 'high',
        context: 'Software testing',
        examples: ['Unit tests', 'Test coverage', 'Red-Green-Refactor']
      },
      {
        keyword: 'ci/cd',
        category: 'dev',
        subcategory: 'devops',
        definition: 'Continuous Integration/Continuous Deployment',
        synonyms: ['continuous integration', 'continuous deployment'],
        related: ['github actions', 'jenkins', 'deployment', 'automation'],
        priority: 'high',
        context: 'DevOps and deployment',
        examples: ['GitHub Actions', 'Automated testing', 'Deployment pipelines']
      },
      {
        keyword: 'code review',
        category: 'dev',
        subcategory: 'collaboration',
        definition: 'Process of examining code changes before merging',
        synonyms: ['pull request', 'pr review'],
        related: ['git', 'github', 'branching', 'merge'],
        priority: 'high',
        context: 'Version control and collaboration',
        examples: ['Pull requests', 'Code quality', 'Peer review']
      }
    ]
  },
  {
    name: 'Database & Storage',
    description: 'Database technologies and storage solutions',
    keywords: [
      {
        keyword: 'postgresql',
        category: 'dev',
        subcategory: 'database',
        definition: 'Powerful, open source object-relational database system',
        synonyms: ['postgres', 'psql'],
        related: ['sql', 'database', 'orm', 'prisma'],
        priority: 'high',
        context: 'Relational databases',
        examples: ['SQL queries', 'Database schema', 'ORM integration']
      },
      {
        keyword: 'mongodb',
        category: 'dev',
        subcategory: 'database',
        definition: 'Document-oriented NoSQL database program',
        synonyms: ['mongo', 'nosql'],
        related: ['nosql', 'document database', 'aggregation'],
        priority: 'medium',
        context: 'NoSQL databases',
        examples: ['Document storage', 'Aggregation pipelines', 'Schema flexibility']
      },
      {
        keyword: 'redis',
        category: 'dev',
        subcategory: 'database',
        definition: 'In-memory data structure store, used as database, cache, and message broker',
        synonyms: ['caching'],
        related: ['cache', 'session storage', 'pub/sub'],
        priority: 'medium',
        context: 'Caching and session management',
        examples: ['Session storage', 'Caching', 'Pub/Sub messaging']
      }
    ]
  },
  {
    name: 'API & Integration',
    description: 'API design and integration technologies',
    keywords: [
      {
        keyword: 'rest api',
        category: 'dev',
        subcategory: 'api',
        definition: 'Representational State Transfer API design pattern',
        synonyms: ['restful', 'rest'],
        related: ['http', 'json', 'endpoints', 'crud'],
        priority: 'high',
        context: 'API design',
        examples: ['GET/POST/PUT/DELETE', 'HTTP status codes', 'JSON responses']
      },
      {
        keyword: 'graphql',
        category: 'dev',
        subcategory: 'api',
        definition: 'Query language for APIs and runtime for executing queries',
        synonyms: ['gql'],
        related: ['apollo', 'schema', 'queries', 'mutations'],
        priority: 'high',
        context: 'API design',
        examples: ['GraphQL schema', 'Queries and mutations', 'Apollo Server']
      },
      {
        keyword: 'webhook',
        category: 'dev',
        subcategory: 'integration',
        definition: 'HTTP callback that occurs when something happens',
        synonyms: ['callback', 'http callback'],
        related: ['events', 'notifications', 'integration'],
        priority: 'medium',
        context: 'System integration',
        examples: ['GitHub webhooks', 'Payment notifications', 'Event-driven architecture']
      }
    ]
  }
];

// Design Keywords Categories
export const DESIGN_KEYWORDS: KeywordCategory[] = [
  {
    name: 'Design Principles',
    description: 'Fundamental principles of design',
    keywords: [
      {
        keyword: 'hierarchy',
        category: 'design',
        subcategory: 'principles',
        definition: 'Arrangement of elements in order of importance',
        synonyms: ['visual hierarchy', 'typographic hierarchy'],
        related: ['contrast', 'scale', 'proximity', 'white space'],
        priority: 'high',
        context: 'Visual design',
        examples: ['Headline hierarchy', 'Visual flow', 'Information architecture']
      },
      {
        keyword: 'contrast',
        category: 'design',
        subcategory: 'principles',
        definition: 'Juxtaposition of different elements to create visual interest',
        synonyms: ['visual contrast'],
        related: ['color contrast', 'size contrast', 'typography'],
        priority: 'high',
        context: 'Visual design',
        examples: ['Light/dark contrast', 'Color combinations', 'Size relationships']
      },
      {
        keyword: 'balance',
        category: 'design',
        subcategory: 'principles',
        definition: 'Distribution of visual weight in a composition',
        synonyms: ['visual balance', 'symmetry'],
        related: ['symmetry', 'asymmetry', 'composition'],
        priority: 'high',
        context: 'Layout and composition',
        examples: ['Symmetrical balance', 'Asymmetrical balance', 'Visual weight']
      },
      {
        keyword: 'unity',
        category: 'design',
        subcategory: 'principles',
        definition: 'Sense of harmony and completeness in a design',
        synonyms: ['cohesion', 'harmony'],
        related: ['consistency', 'repetition', 'proximity'],
        priority: 'high',
        context: 'Overall design',
        examples: ['Color harmony', 'Consistent style', 'Unified theme']
      }
    ]
  },
  {
    name: 'Color & Typography',
    description: 'Color theory and typography concepts',
    keywords: [
      {
        keyword: 'color theory',
        category: 'design',
        subcategory: 'color',
        definition: 'Guidelines for color mixing and the visual effects of color combinations',
        synonyms: ['color harmony', 'color psychology'],
        related: ['palette', 'complementary colors', 'triadic colors'],
        priority: 'high',
        context: 'Visual design',
        examples: ['Color wheel', 'Color schemes', 'Brand colors']
      },
      {
        keyword: 'typography',
        category: 'design',
        subcategory: 'typography',
        definition: 'Art and technique of arranging type to make written language legible and appealing',
        synonyms: ['type design', 'font design'],
        related: ['font', 'typeface', 'kerning', 'leading', 'tracking'],
        priority: 'high',
        context: 'Text design',
        examples: ['Font pairing', 'Text hierarchy', 'Readability']
      },
      {
        keyword: 'white space',
        category: 'design',
        subcategory: 'layout',
        definition: 'Empty space in design that helps create focus and clarity',
        synonyms: ['negative space', 'breathing room'],
        related: ['minimalism', 'layout', 'spacing'],
        priority: 'high',
        context: 'Layout design',
        examples: ['Margins', 'Padding', 'Minimal design']
      }
    ]
  },
  {
    name: 'User Experience (UX)',
    description: 'User experience design concepts',
    keywords: [
      {
        keyword: 'user experience',
        category: 'design',
        subcategory: 'ux',
        definition: 'Overall experience a person has when using a product or system',
        synonyms: ['ux', 'user-centered design'],
        related: ['usability', 'user research', 'interaction design'],
        priority: 'high',
        context: 'Product design',
        examples: ['User journey', 'Usability testing', 'User personas']
      },
      {
        keyword: 'usability',
        category: 'design',
        subcategory: 'ux',
        definition: 'Ease of use and learnability of a product or system',
        synonyms: ['ease of use', 'user-friendliness'],
        related: ['accessibility', 'user testing', 'interface design'],
        priority: 'high',
        context: 'UX design',
        examples: ['Usability testing', 'User feedback', 'Interface simplicity']
      },
      {
        keyword: 'wireframe',
        category: 'design',
        subcategory: 'ux',
        definition: 'Basic visual guide used to suggest the structure of a design',
        synonyms: ['wireframing', 'low-fidelity mockup'],
        related: ['prototype', 'mockup', 'user flow'],
        priority: 'high',
        context: 'Design process',
        examples: ['Layout structure', 'Information architecture', 'User flow mapping']
      },
      {
        keyword: 'prototype',
        category: 'design',
        subcategory: 'ux',
        definition: 'Early sample or model of a product built for testing',
        synonyms: ['prototyping', 'interactive mockup'],
        related: ['wireframe', 'mockup', 'user testing'],
        priority: 'high',
        context: 'Design process',
        examples: ['Interactive prototypes', 'User testing', 'Design validation']
      }
    ]
  },
  {
    name: 'User Interface (UI)',
    description: 'User interface design concepts',
    keywords: [
      {
        keyword: 'user interface',
        category: 'design',
        subcategory: 'ui',
        definition: 'Space where interactions between humans and machines occur',
        synonyms: ['ui', 'interface design'],
        related: ['components', 'controls', 'navigation', 'layout'],
        priority: 'high',
        context: 'Interface design',
        examples: ['Button design', 'Navigation patterns', 'Form design']
      },
      {
        keyword: 'responsive design',
        category: 'design',
        subcategory: 'ui',
        definition: 'Design approach that makes web pages render well on various devices',
        synonyms: ['mobile-first', 'adaptive design'],
        related: ['breakpoints', 'flexbox', 'grid', 'media queries'],
        priority: 'high',
        context: 'Web design',
        examples: ['Mobile layouts', 'Tablet views', 'Desktop designs']
      },
      {
        keyword: 'accessibility',
        category: 'design',
        subcategory: 'ui',
        definition: 'Design of products, devices, services, or environments for people with disabilities',
        synonyms: ['a11y', 'inclusive design'],
        related: ['wcag', 'screen reader', 'keyboard navigation'],
        priority: 'high',
        context: 'Inclusive design',
        examples: ['WCAG compliance', 'Screen reader support', 'Keyboard navigation']
      }
    ]
  },
  {
    name: 'Design Tools & Software',
    description: 'Software and tools used in design',
    keywords: [
      {
        keyword: 'figma',
        category: 'design',
        subcategory: 'tools',
        definition: 'Collaborative interface design tool',
        synonyms: ['figma design'],
        related: ['prototyping', 'design systems', 'collaboration'],
        priority: 'high',
        context: 'UI/UX design',
        examples: ['Component libraries', 'Design systems', 'Collaborative design']
      },
      {
        keyword: 'sketch',
        category: 'design',
        subcategory: 'tools',
        definition: 'Digital design platform for UI/UX design',
        synonyms: ['sketch app'],
        related: ['symbols', 'libraries', 'plugins'],
        priority: 'medium',
        context: 'UI/UX design',
        examples: ['Symbol libraries', 'Plugin ecosystem', 'Design workflow']
      },
      {
        keyword: 'adobe creative suite',
        category: 'design',
        subcategory: 'tools',
        definition: 'Collection of graphic design, video editing, and web development applications',
        synonyms: ['adobe cc', 'creative cloud'],
        related: ['photoshop', 'illustrator', 'xd', 'after effects'],
        priority: 'high',
        context: 'Creative design',
        examples: ['Photoshop editing', 'Illustrator graphics', 'After Effects animation']
      }
    ]
  }
];

// Combined Keywords (Both Dev & Design)
export const COMBINED_KEYWORDS: KeywordCategory[] = [
  {
    name: 'Frontend Development',
    description: 'Keywords relevant to both development and design in frontend',
    keywords: [
      {
        keyword: 'component',
        category: 'both',
        subcategory: 'frontend',
        definition: 'Reusable piece of UI with its own logic and styling',
        synonyms: ['ui component', 'reusable component'],
        related: ['react', 'vue', 'angular', 'design system'],
        priority: 'high',
        context: 'Modern web development',
        examples: ['Button component', 'Card component', 'Form component']
      },
      {
        keyword: 'design system',
        category: 'both',
        subcategory: 'frontend',
        definition: 'Complete set of standards for design and code',
        synonyms: ['component library', 'ui library'],
        related: ['components', 'tokens', 'guidelines', 'documentation'],
        priority: 'high',
        context: 'Product development',
        examples: ['Material Design', 'Ant Design', 'Custom design systems']
      },
      {
        keyword: 'css',
        category: 'both',
        subcategory: 'frontend',
        definition: 'Cascading Style Sheets - language for styling web pages',
        synonyms: ['stylesheets', 'styling'],
        related: ['sass', 'scss', 'tailwind', 'css-in-js'],
        priority: 'high',
        context: 'Web styling',
        examples: ['CSS Grid', 'Flexbox', 'Animations', 'Responsive design']
      },
      {
        keyword: 'animation',
        category: 'both',
        subcategory: 'frontend',
        definition: 'Process of creating motion and change',
        synonyms: ['motion design', 'transitions'],
        related: ['css animations', 'javascript animations', 'ui animations'],
        priority: 'medium',
        context: 'Interactive design',
        examples: ['Page transitions', 'Loading animations', 'Micro-interactions']
      }
    ]
  },
  {
    name: 'Product Development',
    description: 'Keywords spanning both development and design in product creation',
    keywords: [
      {
        keyword: 'user story',
        category: 'both',
        subcategory: 'product',
        definition: 'Informal, general explanation of a software feature written from the perspective of the end user',
        synonyms: ['story', 'requirement'],
        related: ['agile', 'scrum', 'backlog', 'acceptance criteria'],
        priority: 'high',
        context: 'Product management',
        examples: ['As a user, I want...', 'Acceptance criteria', 'Story points']
      },
      {
        keyword: 'mvp',
        category: 'both',
        subcategory: 'product',
        definition: 'Minimum Viable Product - version of a new product with just enough features to be usable',
        synonyms: ['minimum viable product'],
        related: ['product launch', 'iteration', 'validation', 'lean startup'],
        priority: 'high',
        context: 'Product strategy',
        examples: ['Core features only', 'Market validation', 'Iterative development']
      },
      {
        keyword: 'iteration',
        category: 'both',
        subcategory: 'product',
        definition: 'Process of repeating a cycle of operations to improve a product',
        synonyms: ['iterative process', 'continuous improvement'],
        related: ['agile', 'sprints', 'feedback', 'refinement'],
        priority: 'high',
        context: 'Development process',
        examples: ['Design iterations', 'Development sprints', 'User feedback loops']
      },
      {
        keyword: 'feedback',
        category: 'both',
        subcategory: 'product',
        definition: 'Information about reactions to a product, person\'s performance of a task, etc.',
        synonyms: ['user feedback', 'reviews'],
        related: ['testing', 'validation', 'improvement', 'reviews'],
        priority: 'high',
        context: 'Product improvement',
        examples: ['User testing feedback', 'Code reviews', 'Design critiques']
      }
    ]
  }
];

// Complete keyword database
export const KEYWORD_DATABASE = {
  dev: DEV_KEYWORDS,
  design: DESIGN_KEYWORDS,
  both: COMBINED_KEYWORDS
};

// Helper functions for keyword search and management
export const searchKeywords = (query: string, category?: 'dev' | 'design' | 'both'): KeywordEntry[] => {
  const allKeywords: KeywordEntry[] = [];
  
  if (!category || category === 'dev') {
    DEV_KEYWORDS.forEach(cat => allKeywords.push(...cat.keywords));
  }
  if (!category || category === 'design') {
    DESIGN_KEYWORDS.forEach(cat => allKeywords.push(...cat.keywords));
  }
  if (!category || category === 'both') {
    COMBINED_KEYWORDS.forEach(cat => allKeywords.push(...cat.keywords));
  }
  
  const lowerQuery = query.toLowerCase();
  return allKeywords.filter(keyword => 
    keyword.keyword.includes(lowerQuery) ||
    keyword.synonyms.some(syn => syn.toLowerCase().includes(lowerQuery)) ||
    keyword.definition.toLowerCase().includes(lowerQuery) ||
    keyword.related.some(rel => rel.toLowerCase().includes(lowerQuery))
  );
};

export const getKeywordsByCategory = (category: 'dev' | 'design' | 'both'): KeywordCategory[] => {
  return KEYWORD_DATABASE[category];
};

export const getKeywordsBySubcategory = (subcategory: string): KeywordEntry[] => {
  const allKeywords: KeywordEntry[] = [];
  
  Object.values(KEYWORD_DATABASE).forEach(categories => {
    categories.forEach(cat => {
      if (cat.subcategory === subcategory) {
        allKeywords.push(...cat.keywords);
      }
    });
  });
  
  return allKeywords;
};

export const getHighPriorityKeywords = (): KeywordEntry[] => {
  const allKeywords: KeywordEntry[] = [];
  
  Object.values(KEYWORD_DATABASE).forEach(categories => {
    categories.forEach(cat => {
      allKeywords.push(...cat.keywords.filter(k => k.priority === 'high'));
    });
  });
  
  return allKeywords;
};

export const getRelatedKeywords = (keyword: string): KeywordEntry[] => {
  const allKeywords: KeywordEntry[] = [];
  
  Object.values(KEYWORD_DATABASE).forEach(categories => {
    categories.forEach(cat => {
      allKeywords.push(...cat.keywords);
    });
  });
  
  const foundKeyword = allKeywords.find(k => k.keyword === keyword.toLowerCase());
  if (!foundKeyword) return [];
  
  return allKeywords.filter(k => 
    foundKeyword.related.includes(k.keyword) ||
    k.related.includes(foundKeyword.keyword)
  );
};

// Export types and utilities
export type { KeywordEntry, KeywordCategory };
export default KEYWORD_DATABASE;
