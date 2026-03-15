# Contributing to ForSure Quantum CLI

Thank you for your interest in contributing to the ForSure Quantum CLI! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Community](#community)

## Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- Git
- A code editor (we recommend VS Code with the ForSure extension)

### Quick Start

1. Fork the repository
2. Clone your fork locally
3. Install dependencies
4. Create a new branch for your feature
5. Make your changes
6. Run tests
7. Submit a pull request

```bash
# Clone your fork
git clone https://github.com/your-username/quantum-cli.git
cd quantum-cli

# Install dependencies
npm install

# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes...

# Run tests
npm test

# Submit your changes
git push origin feature/your-feature-name
```

## Development Setup

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Run linting**
   ```bash
   npm run lint
   npm run lint:fix
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run in development mode**
   ```bash
   npm run dev
   ```

### VS Code Setup

We recommend using VS Code with the following extensions:

- ForSure Design System extension
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Jest Runner

Install the recommended extensions by opening the command palette (`Ctrl+Shift+P`) and searching for "Extensions: Show Recommended Extensions".

## Project Structure

```
cli-quantum/
├── src/                          # Source code
│   ├── cli.ts                    # Main CLI entry point
│   ├── lib/                      # Library modules
│   │   ├── project-cli.ts        # Project management
│   │   ├── design-system-cli.ts  # Design system commands
│   │   ├── quantum-cli.ts        # Quantum computing commands
│   │   ├── config-manager.ts     # Configuration management
│   │   └── logger.ts             # Logging utilities
│   └── types/                    # TypeScript type definitions
├── tests/                        # Test files
│   ├── setup.ts                  # Jest setup
│   ├── cli.test.ts               # CLI tests
│   └── integration/              # Integration tests
├── docs/                         # Documentation
├── .github/                      # GitHub workflows
│   └── workflows/
│       └── ci.yml                 # CI/CD pipeline
├── templates/                    # Project templates
├── dist/                         # Build output
├── package.json                  # Package configuration
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc.json              # Prettier configuration
└── README.md                     # Project documentation
```

## Contributing Guidelines

### Types of Contributions

We welcome the following types of contributions:

1. **Bug fixes** - Fix issues reported in the bug tracker
2. **New features** - Add new functionality to the CLI
3. **Documentation** - Improve documentation and examples
4. **Tests** - Add or improve test coverage
5. **Performance** - Optimize existing code
6. **Quantum algorithms** - Add new quantum computing algorithms

### Before You Start

1. **Check existing issues** - Look for existing issues or pull requests
2. **Discuss your plans** - Open an issue to discuss major changes
3. **Follow the coding standards** - Use the established code style
4. **Write tests** - Ensure your changes are well-tested

### Code Style

We use ESLint and Prettier to maintain consistent code style:

```bash
# Check code style
npm run lint

# Auto-fix code style issues
npm run lint:fix

# Format code
npm run format
```

#### TypeScript Guidelines

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types when possible
- Use interfaces for object shapes
- Use enums for constants

#### Naming Conventions

- **Files**: kebab-case (`project-cli.ts`)
- **Classes**: PascalCase (`ProjectCLI`)
- **Functions**: camelCase (`createQuantumCircuit`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_QUBITS`)
- **Interfaces**: PascalCase with `I` prefix (`IQuantumCircuit`)

## Testing

### Test Structure

We use Jest for testing with the following structure:

```
tests/
├── setup.ts              # Global test setup
├── cli.test.ts           # CLI unit tests
├── lib/                  # Library tests
│   ├── project-cli.test.ts
│   ├── quantum-cli.test.ts
│   └── ...
└── integration/          # Integration tests
    ├── commands.test.ts
    └── workflows.test.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run performance tests
npm run test:performance
```

### Writing Tests

1. **Unit tests** - Test individual functions and classes
2. **Integration tests** - Test command workflows
3. **Performance tests** - Benchmark quantum operations
4. **Mock external dependencies** - Use mocks for file system, network, etc.

#### Example Test

```typescript
import { QuantumCLI } from '../src/lib/quantum-cli'

describe('QuantumCLI', () => {
  let quantumCLI: QuantumCLI

  beforeEach(() => {
    quantumCLI = new QuantumCLI()
  })

  describe('createCircuit', () => {
    it('should create a Bell state circuit', async () => {
      const result = await quantumCLI.createCircuit('bell-state', {
        algorithm: 'bell',
        format: 'ts'
      })

      expect(result.name).toBe('bell-state')
      expect(result.type).toBe('bell')
    })
  })
})
```

## Documentation

### Types of Documentation

1. **Code documentation** - JSDoc comments for all public APIs
2. **README** - Project overview and getting started guide
3. **CLI documentation** - Command reference and examples
4. **API documentation** - Detailed API reference
5. **Examples** - Code examples and tutorials

### Writing Documentation

- Use clear, concise language
- Provide code examples
- Include error handling examples
- Document all public APIs
- Keep documentation up to date

#### JSDoc Example

```typescript
/**
 * Creates a quantum circuit with the specified parameters
 * @param name - The name of the circuit
 * @param options - Circuit creation options
 * @param options.qubits - Number of qubits in the circuit
 * @param options.gates - Array of quantum gates
 * @returns Promise that resolves to the created circuit
 * @throws {Error} When circuit parameters are invalid
 * @example
 * ```typescript
 * const circuit = await quantumCLI.createCircuit('bell-state', {
 *   qubits: 2,
 *   gates: ['H(0)', 'CNOT(0,1)']
 * })
 * ```
 */
async createCircuit(name: string, options: CircuitOptions): Promise<QuantumCircuit>
```

## Pull Request Process

### Before Submitting

1. **Run all tests** - Ensure all tests pass
2. **Update documentation** - Update relevant documentation
3. **Add tests** - Add tests for new functionality
4. **Check code style** - Run linting and formatting
5. **Update CHANGELOG** - Add your changes to the changelog

### Pull Request Template

```markdown
## Description
Brief description of your changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] Added new tests
- [ ] Updated existing tests

## Checklist
- [ ] Code follows the project's style guidelines
- [ ] Self-review of the code
- [ ] Code is commented appropriately
- [ ] Documentation is updated
- [ ] Changes are reflected in the CHANGELOG

## Issues
Closes #(issue number)
```

### Review Process

1. **Automated checks** - CI/CD pipeline runs tests and linting
2. **Code review** - Maintainers review your code
3. **Testing** - Your changes are tested on multiple environments
4. **Merge** - Once approved, your changes are merged

## Release Process

### Version Management

We use semantic versioning (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Update version** - Update package.json version
2. **Update CHANGELOG** - Add release notes
3. **Create tag** - Create git tag for the release
4. **Build and test** - Ensure everything works
5. **Publish** - Publish to npm
6. **Create release** - Create GitHub release

### Automated Releases

Releases are automated through GitHub Actions when:

- Code is merged to main branch
- All tests pass
- Version is updated

## Community

### Getting Help

- **GitHub Issues** - Report bugs and request features
- **Discussions** - Ask questions and discuss ideas
- **Discord** - Join our Discord community
- **Email** - Contact us at cli@forsure.com

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes
- Annual contributor awards
- Special contributor badges

## Development Tools

### Recommended Tools

- **VS Code** - Code editor with ForSure extension
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **Jest** - Testing framework
- **ESLint** - Linting tool
- **Prettier** - Code formatter

### Debugging

```bash
# Debug CLI commands
npm run dev -- debug

# Run with verbose logging
forsure-quantum --debug --verbose [command]

# Run tests in debug mode
npm run test:debug
```

### Performance Profiling

```bash
# Profile CLI performance
npm run test:performance

# Profile quantum operations
forsure-quantum quantum benchmark [circuit] --metrics all
```

## Quantum Computing Specifics

### Quantum Algorithm Contributions

When contributing quantum algorithms:

1. **Validate correctness** - Ensure algorithm implementation is correct
2. **Add tests** - Test with known quantum states
3. **Document** - Explain the algorithm and its use cases
4. **Benchmark** - Include performance benchmarks
5. **Examples** - Provide practical examples

### Quantum Circuit Standards

- Use standard quantum gate notation
- Follow quantum circuit diagram conventions
- Validate quantum state properties
- Include error analysis
- Provide fidelity calculations

## Security Considerations

### Security Guidelines

1. **Input validation** - Validate all user inputs
2. **File system access** - Use secure file operations
3. **Dependencies** - Keep dependencies updated
4. **Secrets** - Never commit secrets or API keys
5. **Audit** - Regular security audits

### Reporting Security Issues

For security issues, please email us at security@forsure.com rather than using public issues.

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have any questions about contributing, please:

1. Check existing issues and discussions
2. Create a new issue with your question
3. Join our Discord community
4. Email us at cli@forsure.com

Thank you for contributing to ForSure Quantum CLI! 🚀
