# ForSure CLI - Enhanced Interactive Mode

## Overview

The ForSure CLI now includes an enhanced interactive mode with colors, ASCII art, and a dual-panel interface for improved user experience.

## Installation

```bash
npm install
```

## Usage

### Standard CLI Mode

```bash
# Generate file structure
./bin/forsure generate project.forsure -o ./output

# Validate a ForSure file
./bin/forsure validate project.forsure

# Create a new ForSure file
./bin/forsure init my-project.forsure
```

### Interactive Mode

```bash
# Start the interactive CLI
./bin/forsure-interactive

# Or after npm install
npx forsure-interactive
```

## Interactive Mode Features

### 🎨 Visual Design

- **ASCII Art Banner**: Professional welcome screen with colored borders
- **Color-coded Interface**: Uses chalk for vibrant, readable output
- **Dark Theme**: Easy on the eyes terminal interface

### 📱 Dual-Panel Layout

#### Left Panel - Chat Dialogue (Long-term Tasks)

- **Purpose**: Manage ongoing conversations and long-running tasks
- **Features**:
  - Chat history with timestamps
  - Interactive commands for ForSure operations
  - Persistent conversation memory
  - Color-coded messages (cyan for user, yellow for bot)

#### Right Panel - Terminal/Continued Chat

- **Purpose**: Quick terminal interactions and immediate feedback
- **Features**:
  - Simulated terminal commands
  - Command history with timestamps
  - Quick command execution
  - Real-time output display

### ⌨️ Controls & Navigation

#### Keyboard Shortcuts

- **Tab**: Switch between left and right panels
- **Ctrl+C**: Exit the application
- **F1**: Show help modal
- **Enter**: Submit commands in active panel
- **Escape**: Close modals

#### Chat Panel Commands

- `help` - Show available commands
- `generate <file>` - Generate file structure from ForSure file
- `validate <file>` - Validate ForSure file syntax
- `init [filename]` - Create new ForSure file with template
- `clear` - Clear chat history
- `status` - Show current session status

#### Terminal Panel Commands

- `ls` / `dir` - Simulated directory listing
- `pwd` - Show current directory
- `clear` - Clear terminal output
- Any other commands show demo mode message

### 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start interactive mode**:

   ```bash
   ./bin/forsure-interactive
   ```

3. **Create your first ForSure file**:
   - Type in left panel: `init my-project.forsure`
   - The system will create a template file

4. **Generate file structure**:
   - Type in left panel: `generate my-project.forsure`
   - View the parsed structure in the chat

5. **Switch panels**:
   - Press Tab to move to the terminal panel
   - Try terminal commands like `ls` or `pwd`

### 🎯 Use Cases

#### Left Panel (Chat Dialogue)

- **Project Planning**: Long-term task management
- **File Generation**: Complex ForSure file processing
- **Error Handling**: Detailed error messages and solutions
- **Progress Tracking**: Step-by-step operation feedback

#### Right Panel (Terminal)

- **Quick Commands**: Immediate file system operations
- **Testing**: Rapid command testing
- **Monitoring**: Real-time output viewing
- **Debugging**: Quick diagnostic commands

### 🔧 Technical Details

#### Dependencies

- **chalk**: Terminal string styling
- **blessed**: Terminal interface library
- **inquirer**: Interactive command line prompts
- **commander**: Command line framework

#### Architecture

- **Event-driven**: Responsive to user input
- **Modular**: Separate components for panels and handlers
- **Extensible**: Easy to add new commands and features

### 📝 Development

#### Adding New Commands

To add new commands to the chat panel, modify the `processChatCommand` method in `bin/forsure-interactive`:

```javascript
case 'newcommand':
  // Handle the command
  this.addChatMessage('bot', 'Command executed!');
  break;
```

#### Customizing Colors

Modify the color schemes using chalk:

```javascript
const customColor = chalk.magenta('Your text here')
```

#### Panel Styling

Adjust panel properties in the `setupLayout` method to customize borders, colors, and dimensions.

### 🐛 Troubleshooting

#### Common Issues

1. **Dependencies not found**: Run `npm install`
2. **Permission denied**: Ensure the script is executable: `chmod +x bin/forsure-interactive`
3. **Terminal not supported**: Use a terminal that supports blessed (most modern terminals work)

#### Debug Mode

To enable debug output, modify the screen initialization:

```javascript
this.screen = blessed.screen({
  smartCSR: true,
  debug: true,
  // ... other options
})
```

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your enhancements
4. Test the interactive mode
5. Submit a pull request

### 📄 License

ISC License - See LICENSE file for details.
