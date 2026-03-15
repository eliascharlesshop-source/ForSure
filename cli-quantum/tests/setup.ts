// Jest setup file for ForSure Quantum CLI
import 'jest-extended'

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}

// Mock process.exit to prevent tests from exiting
const mockExit = jest.fn()
process.exit = mockExit as any

// Setup global test utilities
global.mockFs = {
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFile: jest.fn(),
  ensureDir: jest.fn(),
  writeJson: jest.fn(),
  readJson: jest.fn(),
  remove: jest.fn(),
}

// Mock ora spinner
jest.mock('ora', () => {
  return jest.fn(() => ({
    start: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
    text: '',
  }))
})

// Mock chalk
jest.mock('chalk', () => ({
  cyan: jest.fn((str: string) => str),
  green: jest.fn((str: string) => str),
  red: jest.fn((str: string) => str),
  yellow: jest.fn((str: string) => str),
  blue: jest.fn((str: string) => str),
  magenta: jest.fn((str: string) => str),
  gray: jest.fn((str: string) => str),
  level: 0,
}))

// Mock inquirer
jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}))

// Mock figlet
jest.mock('figlet', () => ({
  textSync: jest.fn((text: string) => text),
}))

// Mock boxen
jest.mock('boxen', () => jest.fn((text: string) => text))

// Mock child_process
jest.mock('child_process', () => ({
  spawn: jest.fn(),
  exec: jest.fn(),
}))

// Mock fs-extra
jest.mock('fs-extra', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFile: jest.fn(),
  ensureDir: jest.fn(),
  writeJson: jest.fn(),
  readJson: jest.fn(),
  remove: jest.fn(),
  copy: jest.fn(),
}))

// Mock path
jest.mock('path', () => ({
  resolve: jest.fn((...args: string[]) => args.join('/')),
  join: jest.fn((...args: string[]) => args.join('/')),
  dirname: jest.fn((path: string) => path.split('/').slice(0, -1).join('/')),
  basename: jest.fn((path: string) => path.split('/').pop()),
  extname: jest.fn((path: string) => '.' + path.split('.').pop()),
}))

// Mock chokidar
jest.mock('chokidar', () => ({
  watch: jest.fn(() => ({
    on: jest.fn(),
  })),
}))

// Mock glob
jest.mock('glob', () => ({
  __esModule: true,
  default: jest.fn((pattern: string, callback: Function) => {
    callback(null, [])
  }),
}))

// Mock ws
jest.mock('ws', () => ({
  WebSocket: jest.fn(),
}))

// Mock crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => Buffer.from('mock')),
  createHash: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn(() => 'mock-hash'),
  })),
}))

// Mock perf_hooks
jest.mock('perf_hooks', () => ({
  performance: {
    now: jest.fn(() => Date.now()),
  },
}))

// Mock os
jest.mock('os', () => ({
  cpus: jest.fn(() => Array(8).fill({ model: 'mock-cpu' })),
  totalmem: jest.fn(() => 8589934592),
  freemem: jest.fn(() => 4294967296),
}))

// Mock util
jest.mock('util', () => ({
  promisify: jest.fn((fn: Function) => fn),
}))

// Mock events
jest.mock('events', () => ({
  EventEmitter: jest.fn(),
}))

// Mock stream
jest.mock('stream', () => ({
  Readable: jest.fn(),
  Writable: jest.fn(),
  Transform: jest.fn(),
}))

// Mock zlib
jest.mock('zlib', () => ({
  gzipSync: jest.fn(),
  gunzipSync: jest.fn(),
}))

// Mock worker_threads
jest.mock('worker_threads', () => ({
  Worker: jest.fn(),
  isMainThread: true,
  workerData: null,
}))

// Mock cluster
jest.mock('cluster', () => ({
  isMaster: true,
  workers: [],
}))

// Setup test timeout
jest.setTimeout(30000)

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})
