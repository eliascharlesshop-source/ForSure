import fs from 'fs-extra'
import path from 'path'
import ora from 'ora'
import chalk from 'chalk'
import { Logger } from './logger'
import { ConfigManager } from './config-manager'

export interface TokenOptions {
  format?: 'css' | 'scss' | 'ts' | 'json'
  output?: string
  watch?: boolean
  theme?: string
}

export interface AuditOptions {
  report?: boolean
  fix?: boolean
  strict?: boolean
}

export interface ComponentOptions {
  name: string
  template?: string
  directory?: string
  typescript?: boolean
  test?: boolean
  story?: boolean
  quantum?: boolean
}

export interface HookOptions {
  name: string
  template?: string
  directory?: string
  typescript?: boolean
  test?: boolean
  quantum?: boolean
}

export interface UtilityOptions {
  name: string
  template?: string
  directory?: string
  typescript?: boolean
  test?: boolean
}

export interface AuditResult {
  issues: Array<{
    severity: 'error' | 'warning' | 'info'
    message: string
    file?: string
    line?: number
    column?: number
  }>
  summary: {
    total: number
    errors: number
    warnings: number
    info: number
  }
}

export class DesignSystemCLI {
  private logger: Logger
  private config: ConfigManager

  constructor() {
    this.logger = new Logger()
    this.config = new ConfigManager()
  }

  async generateTokens(options: TokenOptions): Promise<void> {
    const spinner = ora('Generating design tokens...').start()
    
    try {
      const format = options.format || 'css'
      const outputDir = options.output || './styles'
      const theme = options.theme || 'default'
      
      // Ensure output directory exists
      await fs.ensureDir(outputDir)
      
      // Read design tokens
      const tokensPath = path.resolve('lib/design-tokens.ts')
      if (!await fs.pathExists(tokensPath)) {
        throw new Error('Design tokens file not found at lib/design-tokens.ts')
      }
      
      // Generate tokens based on format
      switch (format) {
        case 'css':
          await this.generateCSSTokens(outputDir, theme)
          break
        case 'scss':
          await this.generateSCSSTokens(outputDir, theme)
          break
        case 'ts':
          await this.generateTypeScriptTokens(outputDir, theme)
          break
        case 'json':
          await this.generateJSONTokens(outputDir, theme)
          break
        default:
          throw new Error(`Unsupported format: ${format}`)
      }
      
      if (options.watch) {
        spinner.text = 'Watching for changes...'
        this.watchTokens(tokensPath, outputDir, format, theme)
      } else {
        spinner.succeed('Design tokens generated successfully!')
      }
    } catch (error) {
      spinner.fail('Failed to generate design tokens')
      throw error
    }
  }

  private async generateCSSTokens(outputDir: string, theme: string): Promise<void> {
    const cssContent = `
/* ForSure Design System Tokens - ${theme} theme */
/* Generated automatically - do not edit directly */

:root {
  /* Brand Colors */
  --forsure-color-primary-50: #f0fdf4;
  --forsure-color-primary-100: #dcfce7;
  --forsure-color-primary-200: #bbf7d0;
  --forsure-color-primary-300: #86efac;
  --forsure-color-primary-400: #4ade80;
  --forsure-color-primary-500: #22c55e;
  --forsure-color-primary-600: #16a34a;
  --forsure-color-primary-700: #15803d;
  --forsure-color-primary-800: #166534;
  --forsure-color-primary-900: #14532d;
  
  --forsure-color-secondary-50: #f8fafc;
  --forsure-color-secondary-100: #f1f5f9;
  --forsure-color-secondary-200: #e2e8f0;
  --forsure-color-secondary-300: #cbd5e1;
  --forsure-color-secondary-400: #94a3b8;
  --forsure-color-secondary-500: #64748b;
  --forsure-color-secondary-600: #475569;
  --forsure-color-secondary-700: #334155;
  --forsure-color-secondary-800: #1e293b;
  --forsure-color-secondary-900: #0f172a;
  
  /* Semantic Colors */
  --forsure-color-success-50: #f0fdf4;
  --forsure-color-success-500: #22c55e;
  --forsure-color-success-900: #14532d;
  
  --forsure-color-warning-50: #fffbeb;
  --forsure-color-warning-500: #f59e0b;
  --forsure-color-warning-900: #78350f;
  
  --forsure-color-error-50: #fef2f2;
  --forsure-color-error-500: #ef4444;
  --forsure-color-error-900: #7f1d1d;
  
  --forsure-color-info-50: #eff6ff;
  --forsure-color-info-500: #3b82f6;
  --forsure-color-info-900: #1e3a8a;
  
  /* Typography */
  --forsure-font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --forsure-font-family-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  
  --forsure-font-size-xs: 0.75rem;
  --forsure-font-size-sm: 0.875rem;
  --forsure-font-size-base: 1rem;
  --forsure-font-size-lg: 1.125rem;
  --forsure-font-size-xl: 1.25rem;
  --forsure-font-size-2xl: 1.5rem;
  --forsure-font-size-3xl: 1.875rem;
  --forsure-font-size-4xl: 2.25rem;
  
  --forsure-font-weight-normal: 400;
  --forsure-font-weight-medium: 500;
  --forsure-font-weight-semibold: 600;
  --forsure-font-weight-bold: 700;
  
  --forsure-line-height-tight: 1.25;
  --forsure-line-height-normal: 1.5;
  --forsure-line-height-relaxed: 1.75;
  
  /* Spacing */
  --forsure-spacing-0: 0;
  --forsure-spacing-1: 0.25rem;
  --forsure-spacing-2: 0.5rem;
  --forsure-spacing-3: 0.75rem;
  --forsure-spacing-4: 1rem;
  --forsure-spacing-5: 1.25rem;
  --forsure-spacing-6: 1.5rem;
  --forsure-spacing-8: 2rem;
  --forsure-spacing-10: 2.5rem;
  --forsure-spacing-12: 3rem;
  --forsure-spacing-16: 4rem;
  --forsure-spacing-20: 5rem;
  --forsure-spacing-24: 6rem;
  
  /* Border Radius */
  --forsure-border-radius-none: 0;
  --forsure-border-radius-sm: 0.125rem;
  --forsure-border-radius-base: 0.25rem;
  --forsure-border-radius-md: 0.375rem;
  --forsure-border-radius-lg: 0.5rem;
  --forsure-border-radius-xl: 0.75rem;
  --forsure-border-radius-2xl: 1rem;
  --forsure-border-radius-full: 9999px;
  
  /* Shadows */
  --forsure-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --forsure-shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --forsure-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --forsure-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --forsure-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Z-Index */
  --forsure-z-index-dropdown: 1000;
  --forsure-z-index-sticky: 1020;
  --forsure-z-index-fixed: 1030;
  --forsure-z-index-modal-backdrop: 1040;
  --forsure-z-index-modal: 1050;
  --forsure-z-index-popover: 1060;
  --forsure-z-index-tooltip: 1070;
  
  /* Transitions */
  --forsure-transition-duration-fast: 150ms;
  --forsure-transition-duration-base: 200ms;
  --forsure-transition-duration-slow: 300ms;
  
  --forsure-transition-timing-ease: cubic-bezier(0.4, 0, 0.2, 1);
  --forsure-transition-timing-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --forsure-transition-timing-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --forsure-transition-timing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark theme overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --forsure-color-background: #0f172a;
    --forsure-color-foreground: #f8fafc;
    --forsure-color-muted: #1e293b;
    --forsure-color-muted-foreground: #94a3b8;
    --forsure-color-border: #334155;
    --forsure-color-input: #1e293b;
  }
}
`
    
    const outputPath = path.join(outputDir, `tokens-${theme}.css`)
    await fs.writeFile(outputPath, cssContent.trim())
  }

  private async generateSCSSTokens(outputDir: string, theme: string): Promise<void> {
    const scssContent = `
// ForSure Design System Tokens - ${theme} theme
// Generated automatically - do not edit directly

// Brand Colors
$primary-50: #f0fdf4;
$primary-100: #dcfce7;
$primary-200: #bbf7d0;
$primary-300: #86efac;
$primary-400: #4ade80;
$primary-500: #22c55e;
$primary-600: #16a34a;
$primary-700: #15803d;
$primary-800: #166534;
$primary-900: #14532d;

$secondary-50: #f8fafc;
$secondary-100: #f1f5f9;
$secondary-200: #e2e8f0;
$secondary-300: #cbd5e1;
$secondary-400: #94a3b8;
$secondary-500: #64748b;
$secondary-600: #475569;
$secondary-700: #334155;
$secondary-800: #1e293b;
$secondary-900: #0f172a;

// Semantic Colors
$success-50: #f0fdf4;
$success-500: #22c55e;
$success-900: #14532d;

$warning-50: #fffbeb;
$warning-500: #f59e0b;
$warning-900: #78350f;

$error-50: #fef2f2;
$error-500: #ef4444;
$error-900: #7f1d1d;

$info-50: #eff6ff;
$info-500: #3b82f6;
$info-900: #1e3a8a;

// Typography
$font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
$font-family-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;

$font-size-xs: 0.75rem;
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.125rem;
$font-size-xl: 1.25rem;
$font-size-2xl: 1.5rem;
$font-size-3xl: 1.875rem;
$font-size-4xl: 2.25rem;

$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;

// Spacing
$spacing-0: 0;
$spacing-1: 0.25rem;
$spacing-2: 0.5rem;
$spacing-3: 0.75rem;
$spacing-4: 1rem;
$spacing-5: 1.25rem;
$spacing-6: 1.5rem;
$spacing-8: 2rem;
$spacing-10: 2.5rem;
$spacing-12: 3rem;
$spacing-16: 4rem;
$spacing-20: 5rem;
$spacing-24: 6rem;

// Border Radius
$border-radius-none: 0;
$border-radius-sm: 0.125rem;
$border-radius-base: 0.25rem;
$border-radius-md: 0.375rem;
$border-radius-lg: 0.5rem;
$border-radius-xl: 0.75rem;
$border-radius-2xl: 1rem;
$border-radius-full: 9999px;

// Shadows
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

// Z-Index
$z-index-dropdown: 1000;
$z-index-sticky: 1020;
$z-index-fixed: 1030;
$z-index-modal-backdrop: 1040;
$z-index-modal: 1050;
$z-index-popover: 1060;
$z-index-tooltip: 1070;

// Transitions
$transition-duration-fast: 150ms;
$transition-duration-base: 200ms;
$transition-duration-slow: 300ms;

$transition-timing-ease: cubic-bezier(0.4, 0, 0.2, 1);
$transition-timing-ease-in: cubic-bezier(0.4, 0, 1, 1);
$transition-timing-ease-out: cubic-bezier(0, 0, 0.2, 1);
$transition-timing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

// Export variables as CSS custom properties
:root {
  @each $name, $value in (
    'primary-50': $primary-50,
    'primary-500': $primary-500,
    'primary-900': $primary-900,
    'secondary-50': $secondary-50,
    'secondary-500': $secondary-500,
    'secondary-900': $secondary-900,
    'font-family-sans': $font-family-sans,
    'font-size-base': $font-size-base,
    'spacing-4': $spacing-4,
    'border-radius-base': $border-radius-base,
    'shadow-base': $shadow-base
  ) {
    --forsure-color-#{$name}: #{$value};
  }
}
`
    
    const outputPath = path.join(outputDir, `tokens-${theme}.scss`)
    await fs.writeFile(outputPath, scssContent.trim())
  }

  private async generateTypeScriptTokens(outputDir: string, theme: string): Promise<void> {
    const tsContent = `
// ForSure Design System Tokens - ${theme} theme
// Generated automatically - do not edit directly

export interface DesignTokens {
  colors: {
    primary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    secondary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    success: {
      50: string;
      500: string;
      900: string;
    };
    warning: {
      50: string;
      500: string;
      900: string;
    };
    error: {
      50: string;
      500: string;
      900: string;
    };
    info: {
      50: string;
      500: string;
      900: string;
    };
  };
  typography: {
    fontFamily: {
      sans: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  shadows: {
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
  };
  zIndex: {
    dropdown: number;
    sticky: number;
    fixed: number;
    modalBackdrop: number;
    modal: number;
    popover: number;
    tooltip: number;
  };
  transitions: {
    duration: {
      fast: string;
      base: string;
      slow: string;
    };
    timing: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

export const tokens: DesignTokens = {
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      900: '#14532d'
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      900: '#78350f'
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      900: '#7f1d1d'
    },
    info: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    }
  },
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      mono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem'
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  },
  transitions: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms'
    },
    timing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
}

// Helper functions
export const getColorValue = (path: string): string => {
  const keys = path.split('.')
  let value: any = tokens
  
  for (const key of keys) {
    value = value?.[key]
  }
  
  return value || ''
}

export const getSpacingValue = (size: string): string => {
  return tokens.spacing[size as keyof typeof tokens.spacing] || '0'
}

export const getFontSize = (size: string): string => {
  return tokens.typography.fontSize[size as keyof typeof tokens.typography.fontSize] || '1rem'
}

export const getBorderRadius = (size: string): string => {
  return tokens.borderRadius[size as keyof typeof tokens.borderRadius] || '0'
}

export const getShadow = (size: string): string => {
  return tokens.shadows[size as keyof typeof tokens.shadows] || 'none'
}
`
    
    const outputPath = path.join(outputDir, `tokens-${theme}.ts`)
    await fs.writeFile(outputPath, tsContent.trim())
  }

  private async generateJSONTokens(outputDir: string, theme: string): Promise<void> {
    const jsonContent = {
      theme,
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      typography: {
        fontFamily: {
          sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          mono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace'
        },
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        }
      },
      spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem'
      }
    }
    
    const outputPath = path.join(outputDir, `tokens-${theme}.json`)
    await fs.writeJson(outputPath, jsonContent, { spaces: 2 })
  }

  private async watchTokens(tokensPath: string, outputDir: string, format: string, theme: string): Promise<void> {
    const chokidar = require('chokidar')
    
    const watcher = chokidar.watch(tokensPath)
    
    watcher.on('change', async () => {
      console.log(chalk.yellow('Design tokens changed, regenerating...'))
      
      try {
        switch (format) {
          case 'css':
            await this.generateCSSTokens(outputDir, theme)
            break
          case 'scss':
            await this.generateSCSSTokens(outputDir, theme)
            break
          case 'ts':
            await this.generateTypeScriptTokens(outputDir, theme)
            break
          case 'json':
            await this.generateJSONTokens(outputDir, theme)
            break
        }
        
        console.log(chalk.green('Design tokens regenerated!'))
      } catch (error) {
        console.error(chalk.red('Failed to regenerate design tokens:'), error)
      }
    })
  }

  async audit(options: AuditOptions): Promise<AuditResult> {
    const spinner = ora('Auditing design system...').start()
    
    try {
      const issues: AuditResult['issues'] = []
      
      // Check for design tokens file
      const tokensPath = path.resolve('lib/design-tokens.ts')
      if (!await fs.pathExists(tokensPath)) {
        issues.push({
          severity: 'error',
          message: 'Design tokens file not found',
          file: 'lib/design-tokens.ts'
        })
      }
      
      // Check for component consistency
      const componentsDir = path.resolve('components/ui')
      if (await fs.pathExists(componentsDir)) {
        const componentFiles = await fs.readdir(componentsDir)
        
        for (const file of componentFiles) {
          if (file.endsWith('.tsx')) {
            const componentPath = path.join(componentsDir, file)
            const content = await fs.readFile(componentPath, 'utf-8')
            
            // Check for proper TypeScript interfaces
            if (!content.includes('interface ') && !content.includes('type ')) {
              issues.push({
                severity: 'warning',
                message: `Component ${file} missing TypeScript interfaces`,
                file: componentPath
              })
            }
            
            // Check for accessibility attributes
            if (content.includes('<button') && !content.includes('aria-')) {
              issues.push({
                severity: 'warning',
                message: `Button component ${file} missing accessibility attributes`,
                file: componentPath
              })
            }
          }
        }
      }
      
      // Check for proper naming conventions
      const forsureFiles = await this.findFiles('**/forsure-*.tsx')
      for (const file of forsureFiles) {
        const content = await fs.readFile(file, 'utf-8')
        
        // Check for proper export structure
        if (!content.includes('export function') && !content.includes('export const')) {
          issues.push({
            severity: 'error',
            message: `Component ${file} missing proper export`,
            file
          })
        }
      }
      
      // Auto-fix issues if requested
      if (options.fix) {
        spinner.text = 'Auto-fixing issues...'
        await this.autoFixIssues(issues)
      }
      
      // Generate report if requested
      if (options.report) {
        await this.generateAuditReport(issues)
      }
      
      const summary = {
        total: issues.length,
        errors: issues.filter(i => i.severity === 'error').length,
        warnings: issues.filter(i => i.severity === 'warning').length,
        info: issues.filter(i => i.severity === 'info').length
      }
      
      spinner.succeed('Design system audit completed!')
      
      return {
        issues,
        summary
      }
    } catch (error) {
      spinner.fail('Design system audit failed')
      throw error
    }
  }

  private async findFiles(pattern: string): Promise<string[]> {
    const glob = require('glob')
    return new Promise((resolve, reject) => {
      glob(pattern, (err: any, files: string[]) => {
        if (err) reject(err)
        else resolve(files)
      })
    })
  }

  private async autoFixIssues(issues: AuditResult['issues']): Promise<void> {
    for (const issue of issues) {
      if (issue.severity === 'error' && issue.file) {
        // Auto-fix simple issues
        if (issue.message.includes('missing proper export')) {
          const content = await fs.readFile(issue.file, 'utf-8')
          const componentName = path.basename(issue.file, '.tsx')
          
          // Add proper export
          const fixedContent = content.replace(
            /function \w+\(/,
            `export function ${componentName.replace('forsure-', '')}(`
          )
          
          await fs.writeFile(issue.file, fixedContent)
        }
      }
    }
  }

  private async generateAuditReport(issues: AuditResult['issues']): Promise<void> {
    const reportContent = {
      timestamp: new Date().toISOString(),
      summary: {
        total: issues.length,
        errors: issues.filter(i => i.severity === 'error').length,
        warnings: issues.filter(i => i.severity === 'warning').length,
        info: issues.filter(i => i.severity === 'info').length
      },
      issues: issues.map(issue => ({
        ...issue,
        severity: issue.severity.toUpperCase()
      }))
    }
    
    await fs.writeJson('design-system-audit.json', reportContent, { spaces: 2 })
  }

  async generateComponent(name: string, options: ComponentOptions): Promise<void> {
    const spinner = ora(`Generating component: ${name}...`).start()
    
    try {
      const template = options.template || 'basic'
      const directory = options.directory || './components/ui'
      const componentName = `forsure-${name}`
      
      await fs.ensureDir(directory)
      
      // Generate component file
      const componentContent = this.getComponentTemplate(name, template, options)
      const componentPath = path.join(directory, `${componentName}.tsx`)
      await fs.writeFile(componentPath, componentContent)
      
      // Generate test file if requested
      if (options.test) {
        const testContent = this.getTestTemplate(name, template, options)
        const testPath = path.join(directory, `${componentName}.test.tsx`)
        await fs.writeFile(testPath, testContent)
      }
      
      // Generate Storybook story if requested
      if (options.story) {
        const storyContent = this.getStoryTemplate(name, template, options)
        const storyPath = path.join(directory, `${componentName}.stories.tsx`)
        await fs.writeFile(storyPath, storyContent)
      }
      
      spinner.succeed(`Component ${name} generated successfully!`)
    } catch (error) {
      spinner.fail(`Failed to generate component ${name}`)
      throw error
    }
  }

  private getComponentTemplate(name: string, template: string, options: ComponentOptions): string {
    const componentName = `forsure-${name}`
    const className = `Forsure${name.charAt(0).toUpperCase() + name.slice(1)}`
    
    const baseTemplate = `
import React from 'react'
import { cn } from '@/lib/utils'

export interface ${className}Props {
  className?: string
  children?: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const ${className}: React.FC<${className}Props> = ({
  className,
  children,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  return (
    <div
      className={cn(
        'forsure-${name}',
        \`forsure-${name}--\${variant}\`,
        \`forsure-${name}--\${size}\`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default ${className}
`
    
    // Add quantum-specific template if requested
    if (options.quantum) {
      return `
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { QuantumCircuit } from '@forsure/quantum'

export interface ${className}Props {
  className?: string
  children?: React.ReactNode
  quantumMode?: boolean
  circuit?: any
}

export const ${className}: React.FC<${className}Props> = ({
  className,
  children,
  quantumMode = false,
  circuit,
  ...props
}) => {
  const [quantumState, setQuantumState] = useState(null)

  useEffect(() => {
    if (quantumMode && circuit) {
      // Initialize quantum circuit
      setQuantumState(circuit)
    }
  }, [quantumMode, circuit])

  return (
    <div
      className={cn(
        'forsure-${name}',
        quantumMode && 'forsure-${name}--quantum',
        className
      )}
      {...props}
    >
      {quantumMode && quantumState ? (
        <QuantumCircuit circuit={quantumState} />
      ) : (
        children
      )}
    </div>
  )
}

export default ${className}
`
    }
    
    return baseTemplate
  }

  private getTestTemplate(name: string, template: string, options: ComponentOptions): string {
    const componentName = `forsure-${name}`
    const className = `Forsure${name.charAt(0).toUpperCase() + name.slice(1)}`
    
    return `
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ${className} } from './${componentName}'

describe('${className}', () => {
  it('renders correctly', () => {
    render(<${className}>Test</${className}>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<${className} variant="outline">Test</${className}>)
    const element = screen.getByText('Test')
    expect(element).toHaveClass('forsure-${name}--outline')
  })

  it('applies size classes', () => {
    render(<${className} size="lg">Test</${className}>)
    const element = screen.getByText('Test')
    expect(element).toHaveClass('forsure-${name}--lg')
  })

  it('applies custom className', () => {
    render(<${className} className="custom-class">Test</${className}>)
    const element = screen.getByText('Test')
    expect(element).toHaveClass('custom-class')
  })

  ${options.quantum ? `
  it('handles quantum mode', () => {
    render(<${className} quantumMode>Test</${className}>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
  ` : ''}
})
`
  }

  private getStoryTemplate(name: string, template: string, options: ComponentOptions): string {
    const componentName = `forsure-${name}`
    const className = `Forsure${name.charAt(0).toUpperCase() + name.slice(1)}`
    
    return `
import type { Meta, StoryObj } from '@storybook/react'
import { ${className} } from './${componentName}'

const meta: Meta<typeof ${className}> = {
  title: 'Components/${className}',
  component: ${className},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ${className}>

export const Default: Story = {
  args: {
    children: 'Default ${name}',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline ${name}',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost ${name}',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small ${name}',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large ${name}',
  },
}

${options.quantum ? `
export const Quantum: Story = {
  args: {
    quantumMode: true,
    children: 'Quantum ${name}',
  },
}
` : ''}
`
  }

  async generateHook(name: string, options: HookOptions): Promise<void> {
    const spinner = ora(`Generating hook: ${name}...`).start()
    
    try {
      const template = options.template || 'basic'
      const directory = options.directory || './hooks'
      const hookName = `use${name.charAt(0).toUpperCase() + name.slice(1)}`
      
      await fs.ensureDir(directory)
      
      // Generate hook file
      const hookContent = this.getHookTemplate(name, template, options)
      const hookPath = path.join(directory, `${hookName}.ts`)
      await fs.writeFile(hookPath, hookContent)
      
      // Generate test file if requested
      if (options.test) {
        const testContent = this.getHookTestTemplate(name, template, options)
        const testPath = path.join(directory, `${hookName}.test.ts`)
        await fs.writeFile(testPath, testContent)
      }
      
      spinner.succeed(`Hook ${name} generated successfully!`)
    } catch (error) {
      spinner.fail(`Failed to generate hook ${name}`)
      throw error
    }
  }

  private getHookTemplate(name: string, template: string, options: HookOptions): string {
    const hookName = `use${name.charAt(0).toUpperCase() + name.slice(1)}`
    
    if (options.quantum) {
      return `
import { useState, useEffect, useCallback } from 'react'
import { QuantumCircuit, QuantumSimulator } from '@forsure/quantum'

export interface ${hookName}Options {
  qubits?: number
  circuit?: any
  autoSimulate?: boolean
}

export interface ${hookName}Return {
  circuit: any
  results: any
  isSimulating: boolean
  error: string | null
  simulate: () => Promise<void>
  reset: () => void
}

export const ${hookName} = (options: ${hookName}Options = {}): ${hookName}Return => {
  const [circuit, setCircuit] = useState<any>(options.circuit || null)
  const [results, setResults] = useState<any>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const simulate = useCallback(async () => {
    if (!circuit) return
    
    setIsSimulating(true)
    setError(null)
    
    try {
      const simulator = new QuantumSimulator()
      const simulationResults = await simulator.simulate(circuit, {
        shots: 1000,
        precision: 'medium'
      })
      
      setResults(simulationResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed')
    } finally {
      setIsSimulating(false)
    }
  }, [circuit])

  const reset = useCallback(() => {
    setResults(null)
    setError(null)
    setIsSimulating(false)
  }, [])

  useEffect(() => {
    if (options.autoSimulate && circuit) {
      simulate()
    }
  }, [circuit, options.autoSimulate, simulate])

  return {
    circuit,
    results,
    isSimulating,
    error,
    simulate,
    reset
  }
}
`
    }
    
    return `
import { useState, useEffect, useCallback } from 'react'

export interface ${hookName}Options {
  initialValue?: any
  debounce?: number
}

export interface ${hookName}Return {
  value: any
  setValue: (value: any) => void
  reset: () => void
}

export const ${hookName} = (options: ${hookName}Options = {}): ${hookName}Return => {
  const [value, setValue] = useState(options.initialValue)

  const reset = useCallback(() => {
    setValue(options.initialValue)
  }, [options.initialValue])

  return {
    value,
    setValue,
    reset
  }
}
`
  }

  private getHookTestTemplate(name: string, template: string, options: HookOptions): string {
    const hookName = `use${name.charAt(0).toUpperCase() + name.slice(1)}`
    
    return `
import { renderHook, act } from '@testing-library/react'
import { ${hookName} } from './${hookName}'

describe('${hookName}', () => {
  it('returns initial value', () => {
    const { result } = renderHook(() => ${hookName}())
    
    expect(result.current.value).toBeDefined()
  })

  it('updates value correctly', () => {
    const { result } = renderHook(() => ${hookName}())
    
    act(() => {
      result.current.setValue('new value')
    })
    
    expect(result.current.value).toBe('new value')
  })

  it('resets to initial value', () => {
    const { result } = renderHook(() => ${hookName}({ initialValue: 'initial' }))
    
    act(() => {
      result.current.setValue('changed')
    })
    
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.value).toBe('initial')
  })

  ${options.quantum ? `
  it('handles quantum simulation', async () => {
    const mockCircuit = { name: 'test', qubits: 2, gates: [] }
    const { result } = renderHook(() => ${hookName}({ circuit: mockCircuit }))
    
    expect(result.current.circuit).toBe(mockCircuit)
    
    act(() => {
      result.current.simulate()
    })
    
    // Wait for simulation to complete
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(result.current.isSimulating).toBe(false)
    expect(result.current.results).toBeDefined()
  })
  ` : ''}
})
`
  }

  async generateUtility(name: string, options: UtilityOptions): Promise<void> {
    const spinner = ora(`Generating utility: ${name}...`).start()
    
    try {
      const template = options.template || 'basic'
      const directory = options.directory || './lib'
      
      await fs.ensureDir(directory)
      
      // Generate utility file
      const utilityContent = this.getUtilityTemplate(name, template, options)
      const utilityPath = path.join(directory, `${name}.ts`)
      await fs.writeFile(utilityPath, utilityContent)
      
      // Generate test file if requested
      if (options.test) {
        const testContent = this.getUtilityTestTemplate(name, template, options)
        const testPath = path.join(directory, `${name}.test.ts`)
        await fs.writeFile(testPath, testContent)
      }
      
      spinner.succeed(`Utility ${name} generated successfully!`)
    } catch (error) {
      spinner.fail(`Failed to generate utility ${name}`)
      throw error
    }
  }

  private getUtilityTemplate(name: string, template: string, options: UtilityOptions): string {
    return `
/**
 * ${name.charAt(0).toUpperCase() + name.slice(1)} utility function
 * @param args - Function arguments
 * @returns Result of the utility function
 */
export function ${name}(args: any): any {
  // TODO: Implement ${name} utility function
  console.log('${name} called with:', args)
  return args
}

/**
 * Type definition for ${name} function
 */
export type ${name.charAt(0).toUpperCase() + name.slice(1)}Args = any
export type ${name.charAt(0).toUpperCase() + name.slice(1)}Return = any
`
  }

  private getUtilityTestTemplate(name: string, template: string, options: UtilityOptions): string {
    return `
import { ${name} } from './${name}'

describe('${name}', () => {
  it('should return the input value', () => {
    const input = 'test'
    const result = ${name}(input)
    expect(result).toBe(input)
  })

  it('should handle different input types', () => {
    const stringResult = ${name}('string')
    const numberResult = ${name}(42)
    const objectResult = ${name}({ key: 'value' })
    
    expect(stringResult).toBe('string')
    expect(numberResult).toBe(42)
    expect(objectResult).toEqual({ key: 'value' })
  })
})
`
  }
}
