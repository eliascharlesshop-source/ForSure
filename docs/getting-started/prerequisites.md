# Prerequisites Guide

This guide outlines all the prerequisites needed to develop, deploy, and maintain the ForSure application. Ensure you have these tools and knowledge before getting started.

## System Requirements

### Minimum System Specifications

- **Operating System**:
  - macOS 10.15+ (Catalina or later)
  - Windows 10+ (64-bit)
  - Ubuntu 18.04+ or equivalent Linux distribution
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 10GB free disk space
- **Processor**: 64-bit processor with 2+ cores

### Recommended System Specifications

- **RAM**: 16GB or more
- **Storage**: SSD with 20GB+ free space
- **Processor**: 4+ cores for optimal development experience
- **Internet**: Stable broadband connection for package downloads and API calls

## Required Software

### Node.js

#### Version Requirements

- **Minimum**: Node.js 18.0.0
- **Recommended**: Node.js 20.x LTS
- **Maximum**: Node.js 21.x (latest stable)

#### Installation Methods

**Option 1: Using Node Version Manager (nvm) - Recommended**

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install and use Node.js 20 LTS
nvm install 20
nvm use 20

# Set as default
nvm alias default 20

# Verify installation
node --version
npm --version
```

**Option 2: Direct Download**

```bash
# macOS (using Homebrew)
brew install node@20

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
# Download from https://nodejs.org/en/download/
```

#### Verification

```bash
# Check Node.js version (should be 18.x or higher)
node --version

# Check npm version
npm --version

# Verify npm registry access
npm ping
```

### Package Manager

#### pnpm (Recommended)

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version

# Should show version 8.x or higher
```

#### npm (Alternative)

```bash
# npm comes with Node.js
# Verify version
npm --version

# Should show version 9.x or higher
```

#### Yarn (Alternative)

```bash
# Install Yarn
npm install -g yarn

# Verify installation
yarn --version

# Should show version 1.22.x or higher
```

### Git

#### Installation

```bash
# macOS (using Homebrew)
brew install git

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install git

# Windows
# Download from https://git-scm.com/download/win

# Verify installation
git --version
```

#### Configuration

```bash
# Set your identity
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Enable credential helper
git config --global credential.helper store

# Verify configuration
git config --list
```

## Cloud Services

### Supabase Account

#### Why Supabase?

- PostgreSQL database hosting
- Real-time subscriptions
- Authentication service
- File storage
- Edge functions

#### Account Setup

1. **Create Account**
   - Visit [supabase.com](https://supabase.com)
   - Click "Sign Up"
   - Use email or GitHub authentication

2. **Create Organization**
   - Choose organization name
   - Select billing tier (Free tier is sufficient for development)

3. **Create Project**
   - Click "New Project"
   - Choose database region (closest to your users)
   - Set strong database password
   - Wait for project initialization (2-3 minutes)

4. **Get API Credentials**
   - Navigate to **Settings** → **API**
   - Copy **Project URL**
   - Copy **anon public** key
   - Copy **service_role** key (keep secret)

#### Required Features

- [x] PostgreSQL database
- [x] Authentication providers (Email, Google, GitHub)
- [x] Storage buckets
- [x] Row Level Security (RLS)
- [x] Real-time subscriptions

### Optional Cloud Services

#### Vercel (for deployment)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link
```

#### Sentry (for error monitoring)

- Create account at [sentry.io](https://sentry.io)
- Create new project
- Get DSN for configuration

## Development Tools

### Code Editor

#### Visual Studio Code (Recommended)

```bash
# Download from https://code.visualstudio.com/
# Install using package manager:

# macOS
brew install --cask visual-studio-code

# Ubuntu
sudo snap install code --classic

# Windows
# Download installer from website
```

#### Essential VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "eamodio.gitlens",
    "humao.rest-client"
  ]
}
```

### Database Tools

#### TablePlus (Recommended)

- Download from [tableplus.com](https://tableplus.com/)
- Supports PostgreSQL
- Modern interface
- Paid (with free trial)

#### DBeaver (Free Alternative)

- Open-source database tool
- Cross-platform
- Extensive database support

#### Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to your account
supabase login

# Verify installation
supabase --version
```

### API Testing Tools

#### Thunder Client (VS Code Extension)

- Install within VS Code
- REST API testing
- GraphQL support

#### Postman

- Download from [postman.com](https://www.postman.com/downloads/)
- Comprehensive API testing
- Team collaboration features

## Browser Requirements

### Modern Browser

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Browser Extensions

- React Developer Tools
- Redux DevTools (if using Redux)
- Tailwind CSS DevTools
- JSON Viewer

## Knowledge Prerequisites

### Technical Skills

#### Frontend Development

- **HTML5**: Semantic markup, forms, accessibility
- **CSS3**: Flexbox, Grid, animations, responsive design
- **JavaScript (ES6+)**: Async/await, modules, destructuring
- **TypeScript**: Types, interfaces, generics
- **React**: Hooks, components, state management
- **Next.js**: App Router, API routes, SSR/SSG

#### Backend Development

- **REST APIs**: HTTP methods, status codes, authentication
- **Database**: SQL basics, relationships, indexing
- **Authentication**: JWT, OAuth, session management
- **File Handling**: Upload, validation, storage

#### Development Practices

- **Git**: Version control, branching, pull requests
- **Command Line**: Terminal usage, basic commands
- **Testing**: Unit tests, integration tests, E2E testing
- **Code Quality**: Linting, formatting, type checking

### Optional but Helpful

#### DevOps Knowledge

- **Docker**: Containerization basics
- **CI/CD**: Continuous integration/deployment concepts
- **Cloud Platforms**: Vercel, Netlify, AWS basics

#### Design Knowledge

- **UI/UX**: User interface design principles
- **Accessibility**: WCAG guidelines, screen readers
- **Performance**: Web performance optimization

## Network Requirements

### Internet Connection

- **Minimum**: 10 Mbps download speed
- **Recommended**: 50 Mbps+ download speed
- **Latency**: < 100ms for optimal development

### Firewall/Proxy

- **Outbound**: Ports 80, 443, 3000
- **Git**: Port 22 (if using SSH)
- **Supabase**: Access to supabase.co domains
- **Package Registries**: npm registry access

## System Configuration

### macOS Specific

#### Xcode Command Line Tools

```bash
# Install Xcode command line tools
xcode-select --install

# Verify installation
xcode-select -p
```

#### Homebrew

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add to PATH (Apple Silicon)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Verify installation
brew --version
```

### Windows Specific

#### Windows Subsystem for Linux (WSL)

```powershell
# Enable WSL
wsl --install

# Restart computer
# Install Ubuntu from Microsoft Store
```

#### Windows Terminal

```powershell
# Install from Microsoft Store
# Recommended for better terminal experience
```

### Linux Specific

#### Build Essentials (Ubuntu/Debian)

```bash
# Install build tools
sudo apt-get update
sudo apt-get install build-essential

# Install additional dependencies
sudo apt-get install python3 python3-pip
```

## Verification Checklist

### Software Installation

- [ ] Node.js 18+ installed and working
- [ ] Package manager (pnpm/npm/yarn) installed
- [ ] Git installed and configured
- [ ] Code editor installed and configured
- [ ] Browser with required extensions

### Cloud Services

- [ ] Supabase account created
- [ ] Supabase project initialized
- [ ] API credentials obtained
- [ ] Database schema understood

### Development Environment

- [ ] Terminal/command line working
- [ ] Network connectivity verified
- [ ] Firewall rules configured
- [ ] System permissions adequate

### Knowledge Assessment

- [ ] Basic web development concepts understood
- [ ] Git version control familiar
- [ ] Command line comfortable
- [ ] API development basics known

## Common Issues and Solutions

### Node.js Installation Issues

```bash
# Permission denied on macOS
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Alternative: Use nvm to avoid permission issues
```

### Git Permission Issues

```bash
# SSH key setup
ssh-keygen -t ed25519 -C "your.email@example.com"
cat ~/.ssh/id_ed25519.pub

# Add SSH key to GitHub/GitLab account
```

### Network Issues

```bash
# Configure npm registry (if behind proxy)
npm config set registry http://registry.npmjs.org/

# Configure Git proxy (if needed)
git config --global http.proxy http://proxy.company.com:8080
```

### Package Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Clear pnpm cache
pnpm store prune

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
pnpm install
```

## Getting Help

### Documentation

- [Node.js Documentation](https://nodejs.org/docs/)
- [pnpm Documentation](https://pnpm.io/)
- [Git Documentation](https://git-scm.com/doc)
- [Supabase Documentation](https://supabase.com/docs)

### Community

- [Stack Overflow](https://stackoverflow.com/)
- [GitHub Discussions](https://github.com/elicharlese/ForSure/discussions)
- [Discord/Slack Communities](https://supabase.com/community)

### Support

- [GitHub Issues](https://github.com/elicharlese/ForSure/issues)
- [Email Support](mailto:support@forsure.app)

Once you have all these prerequisites in place, you're ready to proceed with the [Installation Guide](./installation.md) and get the ForSure application running locally.
