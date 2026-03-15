import fs from 'fs-extra'
import path from 'path'
import { Logger } from './logger'

export interface Config {
  designTokens: {
    input: string
    output: string
    format: string
    watch: boolean
  }
  components: {
    directory: string
    prefix: string
    typescript: boolean
    test: boolean
    storybook: boolean
  }
  quantum?: {
    maxQubits: number
    precision: string
    enableExperimental: boolean
    simulationEngine: string
    optimizationLevel: string
  }
  build: {
    outputDirectory: string
    minify: boolean
    sourcemap: boolean
    target: string
  }
}

export class ConfigManager {
  private logger: Logger
  private configPath: string
  private defaultConfig: Config = {
    designTokens: {
      input: './lib/design-tokens.ts',
      output: './styles/generated.css',
      format: 'css',
      watch: false
    },
    components: {
      directory: './components/ui',
      prefix: 'forsure-',
      typescript: true,
      test: true,
      storybook: false
    },
    build: {
      outputDirectory: './dist',
      minify: true,
      sourcemap: true,
      target: 'es2020'
    }
  }

  constructor(configPath?: string) {
    this.logger = new Logger()
    this.configPath = configPath || '.forsurerc.json'
  }

  async load(): Promise<Config> {
    try {
      if (await fs.pathExists(this.configPath)) {
        const configData = await fs.readJson(this.configPath)
        return { ...this.defaultConfig, ...configData }
      }
      return this.defaultConfig
    } catch (error) {
      this.logger.warn('Failed to load config, using defaults:', error)
      return this.defaultConfig
    }
  }

  async save(config: Config): Promise<void> {
    try {
      await fs.writeJson(this.configPath, config, { spaces: 2 })
      this.logger.success('Configuration saved successfully')
    } catch (error) {
      this.logger.error('Failed to save configuration:', error)
      throw error
    }
  }

  async list(): Promise<Config> {
    return await this.load()
  }

  async get(key: string): Promise<any> {
    const config = await this.load()
    const keys = key.split('.')
    let value: any = config

    for (const k of keys) {
      value = value?.[k]
    }

    return value
  }

  async set(key: string, value: any): Promise<void> {
    const config = await this.load()
    const keys = key.split('.')
    let current: any = config

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!current[k]) {
        current[k] = {}
      }
      current = current[k]
    }

    current[keys[keys.length - 1]] = value
    await this.save(config)
  }

  async reset(): Promise<void> {
    await this.save(this.defaultConfig)
    this.logger.success('Configuration reset to defaults')
  }
}
