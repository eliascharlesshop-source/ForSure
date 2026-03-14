# ForSure CLI v2.0 - Unified Interactive Interface

## 🚀 Quick Start

### Installation

```bash
npm install --legacy-peer-deps
```

### Usage

#### **Default: Interactive Mode**

```bash
forsure
```

This launches the full interactive CLI with dual-panel interface, ASCII art, and all advanced features.

#### **Explicit Interactive Mode**

```bash
forsure interactive
# or
forsure ui
```

#### **Legacy Commands (Still Available)**

```bash
forsure generate project.forsure
forsure validate project.forsure
forsure init my-project.forsure
```

## 🎮 Interactive Mode Features

### Visual Design

- ✅ **Large ASCII Art Banner**: "FORSURE" text with styled Unicode characters
- ✅ **GitHub-Inspired Dark Theme**: Professional color scheme
- ✅ **Color-Coded Panels**: Blue for chat, green for terminal
- ✅ **Modern Styling**: Thick borders and visual depth

### Dual-Panel Layout

- ✅ **Left Panel (Chat)**: Long-term task management
- ✅ **Right Panel (Terminal)**: Quick commands and feedback
- ✅ **Independent Scrolling**: Separate histories for each panel

### Enhanced Commands

#### Chat Panel Commands

- `help` - Show comprehensive command list
- `generate <file>` - Parse and display ForSure files
- `validate <file>` - Validate file syntax with statistics
- `init [filename]` - Create modern project templates
- `list` - Find all ForSure files in directory
- `status` - Show session statistics
- `about` - Display CLI information
- `theme <name>` - Switch themes (dark/light/blue)
- `save <name>` - Save conversation
- `load <name>` - Load saved conversation
- `export` - Export history to JSON

#### Terminal Panel Commands

- `ls/dir` - Directory listing with emojis
- `pwd` - Current directory
- `echo <text>` - Text output
- `date` - Current date/time
- `whoami` - Current user
- `mkdir <dir>` - Create directory (simulated)
- `touch <file>` - Create file (simulated)
- `help` - Terminal command help

### Keyboard Shortcuts

- **Tab** - Switch between panels
- **F1** - Comprehensive help modal
- **F2** - Clear all panels
- **F3** - Save current session
- **F4** - Export history to file
- **Ctrl+C** - Exit with confirmation

## 🎯 Workflow Examples

### 1. Start Interactive CLI

```bash
forsure
```

### 2. Create a New Project

In the chat panel:

```
init my-new-app.forsure
```

### 3. Generate File Structure

```
generate my-new-app.forsure
```

### 4. Quick Terminal Operations

Switch to terminal panel (Tab) and:

```
ls
pwd
mkdir components
touch index.js
```

### 5. Save Your Work

```
save my-session
```

## 📁 File Structure

```
ForSure/
├── bin/
│   ├── forsure              # Main CLI binary (launches interactive by default)
│   └── forsure-interactive  # Interactive CLI module
├── cli-package.json         # CLI dependencies
├── demo.forsure           # Sample ForSure file
└── README-UNIFIED-CLI.md   # This documentation
```

## 🔧 Technical Details

### Version Information

- **CLI Version**: 2.0.0
- **Default Mode**: Interactive CLI
- **Legacy Support**: All v1.x commands maintained

### Dependencies

- `commander` - Command line framework
- `chalk` - Terminal colors
- `blessed` - Terminal UI
- `inquirer` - Interactive prompts

### Architecture

- **Unified Binary**: Single `forsure` command
- **Default Action**: Launch interactive interface
- **Fallback**: Legacy commands for compatibility

## 🆚 Version Comparison

### v1.x (Legacy)

```bash
forsure generate file.forsure
forsure validate file.forsure
forsure init project.forsure
```

### v2.0 (Current)

```bash
forsure                    # Interactive mode (default)
forsure interactive         # Explicit interactive
forsure generate file.forsure  # Still works (legacy)
```

## 🚨 Migration Notes

### For Existing Users

- All existing commands continue to work
- Interactive mode is now the default experience
- Legacy commands show helpful migration messages

### For New Users

- Simply run `forsure` to start
- Use Tab to switch between panels
- Type `help` in chat panel for commands

## 🎨 Themes

### Available Themes

- **dark** (default) - GitHub-inspired dark theme
- **light** - Clean light theme
- **blue** - Ocean blue theme

### Switching Themes

In chat panel:

```
theme light
theme blue
theme dark
```

## 💾 Session Management

### Save Session

```
save my-work
```

Creates `forsure-session-my-work.json`

### Load Session

```
load my-work
```

### Export History

```
export
```

Creates `forsure-export-YYYY-MM-DD-HH-MM-SS.json`

## 🔍 Troubleshooting

### CLI Doesn't Start

```bash
chmod +x ./bin/forsure
npm install chalk blessed inquirer --save --legacy-peer-deps
```

### Dependencies Missing

```bash
npm install --legacy-peer-deps
```

### Interactive Mode Issues

```bash
# Check dependencies
npm list chalk blessed inquirer

# Try explicit launch
forsure interactive
```

## 📱 Expected Experience

1. **Launch**: `forsure` shows ASCII art and interactive interface
2. **Navigation**: Smooth panel switching with visual feedback
3. **Interaction**: Responsive commands with colored output
4. **Professional Feel**: Modern development tool experience
5. **Backward Compatibility**: All legacy commands work

This unified CLI provides the best of both worlds - cutting-edge interactive interface with full backward compatibility.
