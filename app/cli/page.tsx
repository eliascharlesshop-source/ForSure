'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/forsure-button'
import {
  Terminal,
  ArrowRight,
  Copy,
  Check,
  Code,
  FileText,
  Settings,
  HelpCircle,
  Zap,
  BookOpen,
  Lightbulb,
} from 'lucide-react'
import CodeExample from '@/components/code-example'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/forsure-card'
import { Badge } from '@/components/ui/forsure-badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function CLIPage() {
  const [copied, setCopied] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>('installation')
  const terminalRef = useRef<HTMLDivElement>(null)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState<
    { command: string; output: string }[]
  >([])
  const [activeTip, setActiveTip] = useState(0)

  const tips = [
    'Use forsure dev to start the development server',
    'Run forsure test before committing changes',
    'Use forsure migrate to update database schema',
    'forsure build creates optimized production build',
    'forsure start runs the production server',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTip(prev => (prev + 1) % tips.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const copyInstallCommand = () => {
    navigator.clipboard.writeText('npm install -g forsure-cli')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null)
    } else {
      setOpenSection(section)
    }
  }

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!terminalInput.trim()) return

    let output = ''

    if (terminalInput === 'help' || terminalInput === 'forsure help') {
      output =
        'Available commands:\n  - forsure --version\n  - forsure dev\n  - forsure build\n  - forsure test\n  - forsure migrate\n  - forsure start'
    } else if (terminalInput === 'forsure --version') {
      output = 'forsure-cli v0.1.1'
    } else if (terminalInput.startsWith('forsure dev')) {
      output =
        'Starting development server...\n✅ Development server started on http://localhost:3000'
    } else if (terminalInput.startsWith('forsure build')) {
      output = 'Building project...\n✅ Build completed successfully'
    } else if (terminalInput.startsWith('forsure test')) {
      output = 'Running tests...\n✅ All tests passed'
    } else if (terminalInput.startsWith('forsure migrate')) {
      output = 'Running database migrations...\n✅ Migrations completed'
    } else if (terminalInput.startsWith('forsure start')) {
      output =
        'Starting production server...\n✅ Production server started on http://localhost:3000'
    } else if (terminalInput === 'clear') {
      setTerminalHistory([])
      setTerminalInput('')
      return
    } else {
      output = `Command not found: ${terminalInput}\nType 'help' for available commands`
    }

    setTerminalHistory(prev => [...prev, { command: terminalInput, output }])
    setTerminalInput('')

    // Scroll to bottom of terminal
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 0)
  }

  return (
    <div className="container py-6 md:py-12 max-w-5xl px-4 md:px-6">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 mb-6 md:mb-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                  ForSure CLI
                </h1>
              </div>
              <Badge variant="outline" className="w-fit">
                v0.1.1
              </Badge>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground">
              A command-line interface for ForSure project development tools.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="w-full sm:w-auto">
              <Link
                href="/download"
                className="flex items-center justify-center"
              >
                Download CLI <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link
                href="/docs/cli"
                className="flex items-center justify-center"
              >
                Documentation <FileText className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Start
              </CardTitle>
              <CardDescription>
                Get up and running with ForSure CLI in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    1. Install the CLI
                  </h3>
                  <div className="bg-secondary/20 dark:bg-secondary-dark/30 rounded-md p-4 flex items-center justify-between">
                    <code className="font-mono text-sm">
                      npm install -g forsure-cli
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyInstallCommand}
                      className="h-8 text-primary hover:text-white hover:bg-secondary shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    2. Start development
                  </h3>
                  <CodeExample
                    code={`forsure dev`}
                    language="bash"
                    className="mb-2"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    3. Build for production
                  </h3>
                  <CodeExample code={`forsure build`} language="bash" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                <p className="italic">Tip: {tips[activeTip]}</p>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Try It Out
              </CardTitle>
              <CardDescription>Interactive CLI simulator</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={terminalRef}
                className="bg-black rounded-md p-2 md:p-3 h-[180px] md:h-[220px] overflow-y-auto font-mono text-xs text-white"
              >
                <div className="mb-2 text-primary">ForSure CLI Simulator</div>
                <div className="mb-2 text-gray-400">
                  Type 'help' for available commands
                </div>

                {terminalHistory.map((entry, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex">
                      <span className="text-green-400 mr-1">$</span>
                      <span>{entry.command}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-gray-300 ml-2">
                      {entry.output}
                    </div>
                  </div>
                ))}

                <form
                  onSubmit={handleTerminalSubmit}
                  className="flex items-center"
                >
                  <span className="text-green-400 mr-1">$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={e => setTerminalInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none"
                    placeholder="Type a command..."
                  />
                </form>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
              Try: forsure --version, forsure dev, forsure build, forsure test,
              clear
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="commands" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4 h-auto">
            <TabsTrigger
              value="commands"
              className="flex items-center gap-1 text-xs md:text-sm py-2"
            >
              <Code className="h-3 w-3 md:h-4 md:w-4" />
              <span>Commands</span>
            </TabsTrigger>
            <TabsTrigger
              value="options"
              className="flex items-center gap-1 text-xs md:text-sm py-2"
            >
              <Settings className="h-3 w-3 md:h-4 md:w-4" />
              <span>Options</span>
            </TabsTrigger>
            <TabsTrigger
              value="examples"
              className="flex items-center gap-1 text-xs md:text-sm py-2"
            >
              <FileText className="h-3 w-3 md:h-4 md:w-4" />
              <span>Examples</span>
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="flex items-center gap-1 text-xs md:text-sm py-2"
            >
              <HelpCircle className="h-3 w-3 md:h-4 md:w-4" />
              <span>FAQ</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commands" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CLI Commands</CardTitle>
                <CardDescription>
                  Core commands available in the ForSure CLI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="dev">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 font-mono">
                          dev
                        </Badge>
                        <span>Start development server</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-4">
                        <p className="text-sm text-muted-foreground">
                          Starts the Next.js development server with hot reload.
                        </p>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Usage:</h4>
                          <CodeExample code={`forsure dev`} language="bash" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">
                            Example:
                          </h4>
                          <CodeExample code={`forsure dev`} language="bash" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="build">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 font-mono">
                          build
                        </Badge>
                        <span>Build the project</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-4">
                        <p className="text-sm text-muted-foreground">
                          Creates an optimized production build of the
                          application.
                        </p>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Usage:</h4>
                          <CodeExample code={`forsure build`} language="bash" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">
                            Example:
                          </h4>
                          <CodeExample code={`forsure build`} language="bash" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="test">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 font-mono">
                          test
                        </Badge>
                        <span>Run tests</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-4">
                        <p className="text-sm text-muted-foreground">
                          Runs the test suite using Jest.
                        </p>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Usage:</h4>
                          <CodeExample code={`forsure test`} language="bash" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">
                            Example:
                          </h4>
                          <CodeExample code={`forsure test`} language="bash" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="migrate">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 font-mono">
                          migrate
                        </Badge>
                        <span>Run database migrations</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-4">
                        <p className="text-sm text-muted-foreground">
                          Runs Prisma database migrations to update the schema.
                        </p>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Usage:</h4>
                          <CodeExample
                            code={`forsure migrate`}
                            language="bash"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">
                            Example:
                          </h4>
                          <CodeExample
                            code={`forsure migrate`}
                            language="bash"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="start">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 font-mono">
                          start
                        </Badge>
                        <span>Start production server</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-4">
                        <p className="text-sm text-muted-foreground">
                          Starts the production server after building the
                          project.
                        </p>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Usage:</h4>
                          <CodeExample code={`forsure start`} language="bash" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">
                            Example:
                          </h4>
                          <CodeExample code={`forsure start`} language="bash" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="options" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CLI Options</CardTitle>
                <CardDescription>
                  Common options that can be used with ForSure CLI commands
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="font-mono text-sm font-semibold">
                        --version
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Show CLI version
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="font-mono text-sm font-semibold">
                        --help
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Show help information
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Example Workflows</CardTitle>
                <CardDescription>
                  Common workflows and examples using the ForSure CLI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="development-workflow">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <span>Daily Development Workflow</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Typical workflow for developing the ForSure
                          application.
                        </p>
                        <CodeExample
                          code={`# Start development server
forsure dev

# Run tests before committing
forsure test

# Run database migrations if needed
forsure migrate`}
                          language="bash"
                          className="mb-4"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="deployment-workflow">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <span>Production Deployment</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Steps to deploy the application to production.
                        </p>
                        <CodeExample
                          code={`# Build for production
forsure build

# Start production server
forsure start`}
                          language="bash"
                          className="mb-4"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="testing-workflow">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <span>Testing Workflow</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Running tests and ensuring code quality.
                        </p>
                        <CodeExample
                          code={`# Run all tests
forsure test

# Run tests in watch mode during development
npm run test:watch`}
                          language="bash"
                          className="mb-4"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Common questions about the ForSure CLI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="what-is">
                    <AccordionTrigger className="hover:no-underline">
                      What is ForSure CLI?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        ForSure CLI is a command-line tool that allows you to
                        define project structures in a declarative way using
                        ForSure files. It can generate directories and files
                        based on these definitions, making it easy to scaffold
                        new projects or maintain consistent structures across
                        multiple projects.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="vs-others">
                    <AccordionTrigger className="hover:no-underline">
                      How is ForSure different from other scaffolding tools?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Unlike other scaffolding tools that focus on specific
                        frameworks or technologies, ForSure is
                        framework-agnostic and can be used for any type of
                        project. It also provides rich metadata and
                        documentation capabilities, allowing you to describe the
                        purpose and relationships of files and directories in
                        your project.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="templates">
                    <AccordionTrigger className="hover:no-underline">
                      Can I create and share templates?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Yes! ForSure CLI supports creating, sharing, and
                        applying templates. You can create a template from an
                        existing ForSure file using the{' '}
                        <code className="text-xs font-mono">
                          forsure template create
                        </code>{' '}
                        command, and then share it with others. Templates can be
                        applied using the{' '}
                        <code className="text-xs font-mono">
                          forsure template apply
                        </code>{' '}
                        command.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="existing">
                    <AccordionTrigger className="hover:no-underline">
                      Can I generate a ForSure file from an existing project?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Yes, you can use the{' '}
                        <code className="text-xs font-mono">
                          forsure export
                        </code>{' '}
                        command to generate a ForSure file from an existing
                        project structure. This is useful for documenting
                        existing projects or creating templates based on them.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="ci-cd">
                    <AccordionTrigger className="hover:no-underline">
                      Can I use ForSure in CI/CD pipelines?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Absolutely! ForSure CLI is designed to be used in
                        automated environments like CI/CD pipelines. You can use
                        it to validate project structures, generate scaffolding,
                        or ensure consistency across projects. The{' '}
                        <code className="text-xs font-mono">--dry-run</code>
                        option is particularly useful for validation without
                        making changes.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="bg-muted/50 rounded-lg p-4 md:p-6 mt-6 md:mt-8">
          <div className="flex flex-col gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Learn More
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Explore our comprehensive documentation to learn all about
                ForSure CLI and how to use it effectively.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="w-full sm:w-auto">
                <Link
                  href="/docs/cli"
                  className="flex items-center justify-center"
                >
                  Full Documentation <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link
                  href="/examples"
                  className="flex items-center justify-center"
                >
                  View Examples <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
