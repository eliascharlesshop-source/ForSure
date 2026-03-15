import Link from 'next/link'
import DocsCodeBlock from '@/components/docs-code-block'

export default function CLIConfigurationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          CLI Configuration
        </h1>
        <p className="text-lg text-muted-foreground">
          Configure the ForSure CLI to match your project needs and preferences.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Configuration File</h2>
        <p>
          The ForSure CLI can be configured using a <code className="bg-muted px-1 rounded">.forsurerc.json</code> file in your project root.
          This file allows you to customize default behavior, templates, and output settings.
        </p>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Basic Configuration Example:</h4>
          <DocsCodeBlock
            code={`{
  "defaultOutput": "./output",
  "ignorePatterns": [
    "node_modules",
    ".git",
    "dist"
  ],
  "attributes": {
    "defaultPermissions": "644",
    "encoding": "utf8"
  },
  "templates": {
    "directory": "./templates",
    "defaultTemplate": "basic"
  }
}`}
            language="json"
            fileName=".forsurerc.json"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Complete Configuration Schema</h2>
        <p>Here's a comprehensive configuration file with all available options:</p>

        <DocsCodeBlock
          code={`{
  // Global settings
  "version": "1.0.0",
  "defaultOutput": "./output",
  "ignorePatterns": [
    "node_modules",
    ".git",
    "dist",
    "*.log",
    ".env*"
  ],
  
  // File and directory settings
  "files": {
    "encoding": "utf8",
    "defaultPermissions": "644",
    "directoryPermissions": "755",
    "overwriteExisting": false,
    "preserveGitIgnore": true
  },
  
  // Template configuration
  "templates": {
    "directory": "./templates",
    "defaultTemplate": "basic",
    "customTemplates": {
      "react-component": "./templates/react/",
      "vue-component": "./templates/vue/",
      "api-endpoint": "./templates/api/"
    }
  },
  
  // Design system settings
  "designTokens": {
    "input": "./lib/design-tokens.ts",
    "output": "./styles/tokens.css",
    "format": "css",
    "watch": false,
    "themes": ["light", "dark"],
    "customProperties": true
  },
  
  // Component generation
  "components": {
    "directory": "./components/ui",
    "prefix": "forsure-",
    "typescript": true,
    "test": true,
    "storybook": true,
    "defaultExports": true,
    "cssModules": false
  },
  
  // Build configuration
  "build": {
    "outputDirectory": "./dist",
    "minify": true,
    "sourcemap": true,
    "target": "es2020",
    "bundle": false,
    "cleanOutput": true
  },
  
  // Testing configuration
  "testing": {
    "framework": "jest",
    "coverage": true,
    "coverageThreshold": 80,
    "testEnvironment": "jsdom",
    "setupFiles": ["./jest.setup.js"]
  },
  
  // Publishing settings
  "publishing": {
    "registry": "npm",
    "defaultTag": "latest",
    "access": "public",
    "changelog": true,
    "gitTag": true
  },
  
  // Development settings
  "development": {
    "port": 3000,
    "hotReload": true,
    "openBrowser": true,
    "verbose": false
  },
  
  // Integration settings
  "integrations": {
    "vscode": {
      "enabled": true,
      "snippets": true,
      "intellisense": true
    },
    "git": {
      "hooks": true,
      "autoCommit": false,
      "branchProtection": false
    },
    "ci": {
      "github": true,
      "gitlab": false,
      "jenkins": false
    }
  }
}`}
          language="json"
          fileName=".forsurerc.json"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Configuration Sections</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">Files & Directories</h3>
            <p>Control how files and directories are created:</p>
            <DocsCodeBlock
              code={`{
  "files": {
    "encoding": "utf8",           // File encoding
    "defaultPermissions": "644",  // Default file permissions
    "directoryPermissions": "755", // Default directory permissions
    "overwriteExisting": false,   // Whether to overwrite existing files
    "preserveGitIgnore": true,    // Keep existing .gitignore files
    "backupOnOverwrite": true     // Create backups before overwriting
  }
}`}
              language="json"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Templates</h3>
            <p>Configure template locations and defaults:</p>
            <DocsCodeBlock
              code={`{
  "templates": {
    "directory": "./templates",           // Custom templates directory
    "defaultTemplate": "basic",           // Default template to use
    "fallbackTemplate": "minimal",        // Fallback if default not found
    "customTemplates": {                   // Named custom templates
      "react-component": "./templates/react/",
      "vue-component": "./templates/vue/",
      "api-endpoint": "./templates/api/"
    },
    "templateVariables": {                // Global template variables
      "author": "Your Name",
      "license": "MIT",
      "version": "1.0.0"
    }
  }
}`}
              language="json"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Design Tokens</h3>
            <p>Configure design token generation:</p>
            <DocsCodeBlock
              code={`{
  "designTokens": {
    "input": "./lib/design-tokens.ts",    // Input tokens file
    "output": "./styles/tokens.css",      // Output file
    "format": "css",                      // Output format (css, scss, ts, json)
    "watch": false,                       // Watch for changes
    "themes": ["light", "dark"],          // Available themes
    "customProperties": true,             // Generate CSS custom properties
    "compress": true,                     // Minify output
    "sourcemap": false                    // Generate source maps
  }
}`}
              language="json"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Components</h3>
            <p>Configure component generation settings:</p>
            <DocsCodeBlock
              code={`{
  "components": {
    "directory": "./components/ui",       // Output directory
    "prefix": "forsure-",                 // Component name prefix
    "typescript": true,                   // Generate TypeScript files
    "test": true,                         // Generate test files
    "storybook": true,                    // Generate Storybook stories
    "defaultExports": true,               // Use default exports
    "cssModules": false,                  // Use CSS modules
    "propTypes": false,                   // Generate PropTypes (JS)
    "forwardRef": true,                   // Forward refs in components
    "memo": false                         // Wrap components in React.memo
  }
}`}
              language="json"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Environment-Specific Configuration</h2>
        <p>You can have different configurations for different environments:</p>

        <DocsCodeBlock
          code={`{
  // Base configuration
  "defaultOutput": "./output",
  "templates": {
    "defaultTemplate": "basic"
  },
  
  // Environment-specific overrides
  "environments": {
    "development": {
      "files": {
        "overwriteExisting": true
      },
      "development": {
        "port": 3001,
        "verbose": true
      }
    },
    "production": {
      "build": {
        "minify": true,
        "sourcemap": false
      },
      "files": {
        "overwriteExisting": false
      }
    },
    "test": {
      "testing": {
        "coverage": true,
        "coverageThreshold": 90
      }
    }
  }
}`}
          language="json"
        />

        <p className="text-sm text-muted-foreground">
          Use the <code className="bg-muted px-1 rounded">FORSURE_ENV</code> environment variable to specify which environment to use:
        </p>
        <DocsCodeBlock
          code={`export FORSURE_ENV=production
forsure generate project.forsure`}
          language="bash"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Configuration Precedence</h2>
        <p>The ForSure CLI loads configuration in the following order (later options override earlier ones):</p>

        <ol className="list-decimal pl-6 space-y-2">
          <li>Built-in defaults</li>
          <li>Global configuration file (<code className="bg-muted px-1 rounded">~/.forsurerc.json</code>)</li>
          <li>Project configuration file (<code className="bg-muted px-1 rounded">.forsurerc.json</code>)</li>
          <li>Environment-specific configuration</li>
          <li>Command-line options</li>
          <li>Environment variables</li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Validation</h2>
        <p>You can validate your configuration file:</p>
        <DocsCodeBlock
          code={`forsure config validate
forsure config validate --file ./custom-config.json`}
          language="bash"
        />

        <p>Common validation errors and their solutions:</p>
        <div className="space-y-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h5 className="font-medium text-yellow-800">Invalid JSON</h5>
            <p className="text-sm text-yellow-700">Check for syntax errors in your configuration file</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h5 className="font-medium text-yellow-800">Unknown property</h5>
            <p className="text-sm text-yellow-700">Remove or rename invalid configuration properties</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h5 className="font-medium text-yellow-800">Invalid path</h5>
            <p className="text-sm text-yellow-700">Ensure all file paths exist and are accessible</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Configuration Templates</h2>
        <p>ForSure provides pre-defined configuration templates for common setups:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h5 className="font-medium mb-2">React Project</h5>
            <DocsCodeBlock
              code={`forsure config init --template react`}
              language="bash"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Optimized for React projects with TypeScript and testing
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h5 className="font-medium mb-2">Next.js Project</h5>
            <DocsCodeBlock
              code={`forsure config init --template nextjs`}
              language="bash"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Configured for Next.js with app router and design system
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h5 className="font-medium mb-2">Node.js API</h5>
            <DocsCodeBlock
              code={`forsure config init --template node-api`}
              language="bash"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Set up for Node.js API projects with Express/Fastify
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h5 className="font-medium mb-2">Design System</h5>
            <DocsCodeBlock
              code={`forsure config init --template design-system`}
              language="bash"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Optimized for design system development with Storybook
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Next Steps</h2>
        <p>Learn more about using the ForSure CLI:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/docs/cli/options" className="text-primary hover:underline">
              CLI Options Reference →
            </Link>
          </li>
          <li>
            <Link href="/docs/cli" className="text-primary hover:underline">
              Back to CLI Reference →
            </Link>
          </li>
          <li>
            <Link href="/docs/examples" className="text-primary hover:underline">
              See practical examples →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
