# ForSure Quantum CLI

A comprehensive CLI tool for the ForSure Design System with advanced quantum computing capabilities.

## Installation

```bash
npm install -g @forsure/quantum-cli
```

## Quick Start

```bash
# Initialize a new quantum project
forsure-quantum init --template quantum-app --name my-quantum-project

# Create a quantum circuit
forsure-quantum quantum circuit bell-state --qubits 2 --gates "H(0),CNOT(0,1)"

# Simulate the circuit
forsure-quantum quantum simulate bell-state --shots 1000

# Optimize the circuit
forsure-quantum quantum optimize bell-state --target depth
```

## Features

- **Project Management**: Initialize, build, test, and deploy ForSure projects
- **Design System**: Generate components, hooks, utilities, and design tokens
- **Quantum Computing**: Create, simulate, optimize, and validate quantum circuits
- **Code Generation**: Intelligent code generation with templates
- **Performance Analysis**: Benchmark and profile quantum circuits
- **Configuration Management**: Flexible configuration system

## Commands

### Project Commands

```bash
# Initialize new project
forsure-quantum init [options]

# Build project
forsure-quantum build [options]

# Start development server
forsure-quantum dev [options]

# Run tests
forsure-quantum test [options]

# Lint code
forsure-quantum lint [options]

# Clean build artifacts
forsure-quantum clean [options]
```

### Design System Commands

```bash
# Generate components
forsure-quantum gen component <name> [options]

# Generate hooks
forsure-quantum gen hook <name> [options]

# Generate utilities
forsure-quantum gen utility <name> [options]

# Generate design tokens
forsure-quantum design tokens [options]

# Audit design system
forsure-quantum design audit [options]
```

### Quantum Computing Commands

```bash
# Create quantum circuit
forsure-quantum quantum circuit <name> [options]

# Simulate quantum circuit
forsure-quantum quantum simulate <circuit> [options]

# Optimize quantum circuit
forsure-quantum quantum optimize <circuit> [options]

# Validate quantum circuit
forsure-quantum quantum validate <circuit> [options]

# Benchmark quantum circuit
forsure-quantum quantum benchmark <circuit> [options]

# Create superposition state
forsure-quantum quantum superposition [options]

# Create entanglement state
forsure-quantum quantum entanglement [options]

# Perform quantum measurement
forsure-quantum quantum measure <state> [options]
```

### Configuration Commands

```bash
# List configuration
forsure-quantum config --list

# Set configuration value
forsure-quantum config --set <key=value>

# Get configuration value
forsure-quantum config --get <key>

# Reset configuration
forsure-quantum config --reset
```

## Examples

### Creating a Bell State Circuit

```bash
# Create the circuit
forsure-quantum quantum circuit bell-state --algorithm bell

# Simulate with 1000 shots
forsure-quantum quantum simulate bell-state --shots 1000 --visualize

# Optimize for depth
forsure-quantum quantum optimize bell-state --target depth --rules "gate-fusion,gate-cancellation"

# Validate the circuit
forsure-quantum quantum validate bell-state --strict --warnings
```

### Building a Quantum Application

```bash
# Initialize project
forsure-quantum init --template quantum-app --name quantum-calculator

# Generate quantum components
forsure-quantum gen component quantum-calculator --quantum --test --story

# Generate quantum hooks
forsure-quantum gen hook use-quantum-circuit --quantum --test

# Build and run
forsure-quantum build
forsure-quantum dev --port 3000
```

### Design System Development

```bash
# Generate design tokens
forsure-quantum design tokens --format css --output ./styles --watch

# Generate component with test and story
forsure-quantum gen component button --template basic --test --story

# Audit design system
forsure-quantum design audit --report --fix
```

## Configuration

Create a `.forsurerc.json` file in your project root:

```json
{
  "designTokens": {
    "input": "./lib/design-tokens.ts",
    "output": "./styles/generated.css",
    "format": "css",
    "watch": false
  },
  "components": {
    "directory": "./components/ui",
    "prefix": "forsure-",
    "typescript": true,
    "test": true,
    "storybook": false
  },
  "quantum": {
    "maxQubits": 20,
    "precision": "medium",
    "enableExperimental": false,
    "simulationEngine": "state-vector",
    "optimizationLevel": "balanced"
  },
  "build": {
    "outputDirectory": "./dist",
    "minify": true,
    "sourcemap": true,
    "target": "es2020"
  }
}
```

## Templates

### Project Templates

- `quantum-app`: Full quantum application with circuits and simulation
- `design-system`: Design system project with tokens and components
- `component-library`: Component library with Storybook
- `web-app`: Standard web application
- `nextjs-app`: Next.js application
- `react-app`: React application
- `basic`: Basic project structure

### Component Templates

- `basic`: Simple component with props
- `form`: Form component with validation
- `layout`: Layout component with slots
- `data`: Data display component with loading states
- `quantum`: Quantum computing component

### Hook Templates

- `basic`: Custom hook with state management
- `api`: API hook with caching and error handling
- `form`: Form hook with validation
- `storage`: Storage hook with persistence
- `quantum`: Quantum computing hook

### Utility Templates

- `basic`: Simple utility function
- `validation`: Input validation utilities
- `formatting`: Data formatting utilities
- `calculation`: Mathematical calculation utilities

## Quantum Algorithms

The CLI supports built-in templates for common quantum algorithms:

- **Bell State**: Creates entangled Bell states
- **GHZ State**: Creates Greenberger-Horne-Zeilinger states
- **Grover's Algorithm**: Quantum search algorithm
- **Quantum Fourier Transform**: QFT implementation
- **Quantum Teleportation**: Quantum teleportation protocol
- **Quantum Error Correction**: Basic error correction codes

## Performance Analysis

### Benchmarking

```bash
# Benchmark circuit performance
forsure-quantum quantum benchmark grover-circuit --metrics "fidelity,depth,time" --iterations 100

# Profile circuit execution
forsure-quantum quantum debug complex-circuit --step-by-step --visualize
```

### Optimization

```bash
# Optimize for different targets
forsure-quantum quantum optimize circuit --target depth
forsure-quantum quantum optimize circuit --target fidelity
forsure-quantum quantum optimize circuit --target gates

# Use specific optimization rules
forsure-quantum quantum optimize circuit --rules "gate-fusion,gate-cancellation,template-matching"
```

## Integration

### VS Code Extension

The CLI integrates seamlessly with the ForSure VS Code extension:

```bash
# Install VS Code extension
code --install-extension forsure.forsure-design-system

# Use CLI commands from VS Code
Ctrl+Shift+P → "ForSure: Generate Component"
Ctrl+Shift+P → "ForSure: Validate Quantum Circuit"
```

### CI/CD Integration

```yaml
# GitHub Actions example
name: ForSure CI/CD
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install ForSure CLI
        run: npm install -g @forsure/quantum-cli
      
      - name: Run tests
        run: forsure-quantum test --coverage
      
      - name: Lint code
        run: forsure-quantum lint --fix
      
      - name: Validate quantum circuits
        run: forsure-quantum quantum validate --strict
      
      - name: Build project
        run: forsure-quantum build --production
```

## Advanced Usage

### Custom Quantum Gates

```javascript
// Define custom quantum gate
const customGate = {
  name: 'CustomRotation',
  matrix: [
    [Math.cos(theta/2), -Math.sin(theta/2)],
    [Math.sin(theta/2), Math.cos(theta/2)]
  ],
  parameters: ['theta']
}

// Use in circuit
forsure-quantum quantum circuit custom-circuit --gates "CustomRotation(0,pi/4)"
```

### Batch Processing

```bash
# Process multiple circuits
for circuit in bell-state ghz-state grover-search; do
  forsure-quantum quantum simulate $circuit --shots 1000 --output results/$circuit.json
  forsure-quantum quantum optimize $circuit --output optimized/$circuit.json
done
```

### Plugin Development

```javascript
// Create custom CLI plugin
const plugin = {
  name: 'my-quantum-plugin',
  commands: {
    'my-command': async (args, options) => {
      // Custom command implementation
    }
  }
}

// Register plugin
forsure-quantum plugin register my-quantum-plugin
```

## Troubleshooting

### Common Issues

1. **Module not found errors**
   ```bash
   # Reinstall dependencies
   npm install
   
   # Clear cache
   forsure-quantum clean --all
   ```

2. **Quantum simulation too slow**
   ```bash
   # Reduce qubit count
   forsure-quantum quantum simulate large-circuit --max-qubits 10
   
   # Use lower precision
   forsure-quantum quantum simulate circuit --precision low
   ```

3. **Memory issues**
   ```bash
   # Use chunked simulation
   forsure-quantum quantum simulate huge-circuit --chunked --memory-limit 1GB
   ```

### Debug Mode

```bash
# Enable verbose logging
forsure-quantum --debug --verbose quantum simulate circuit

# Step-by-step execution
forsure-quantum quantum debug circuit --step-by-step --breakpoints
```

## Contributing

### Development Setup

```bash
# Clone repository
git clone https://github.com/forsure/quantum-cli.git
cd quantum-cli

# Install dependencies
npm install

# Setup development environment
npm run dev:setup

# Run tests
npm test

# Build
npm run build
```

### Adding New Commands

```javascript
// src/commands/my-command.js
export class MyCommand {
  async execute(args, options) {
    // Command implementation
  }
}

// Register command
cli.registerCommand('my-command', MyCommand)
```

## License

MIT License - see LICENSE file for details.

## Support

- **Documentation**: https://docs.forsure.com/cli
- **Issues**: https://github.com/forsure/quantum-cli/issues
- **Discord**: https://discord.gg/forsure
- **Email**: cli@forsure.com
