import Link from 'next/link'
import DocsCodeBlock from '@/components/docs-code-block'

export default function CLIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          CLI Reference
        </h1>
        <p className="text-lg text-muted-foreground">
          Learn how to use the ForSure command-line interface.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Basic Usage</h2>
        <p>
          The ForSure CLI provides commands for generating file structures from
          ForSure files:
        </p>
        <DocsCodeBlock code={`forsure [command] [options]`} language="bash" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Core Commands</h2>

        <h3 className="text-xl font-medium">generate</h3>
        <p>Generates a file structure from a ForSure file:</p>
        <DocsCodeBlock
          code={`forsure generate <file> --output <directory>`}
          language="bash"
        />
        <p>Example:</p>
        <DocsCodeBlock
          code={`forsure generate project.forsure --output ./my-project`}
          language="bash"
        />

        <h3 className="text-xl font-medium">validate</h3>
        <p>Validates a ForSure file without generating the structure:</p>
        <DocsCodeBlock code={`forsure validate <file>`} language="bash" />
        <p>Example:</p>
        <DocsCodeBlock
          code={`forsure validate project.forsure`}
          language="bash"
        />

        <h3 className="text-xl font-medium">init</h3>
        <p>Creates a new ForSure file with a basic structure:</p>
        <DocsCodeBlock code={`forsure init [filename]`} language="bash" />
        <p>Example:</p>
        <DocsCodeBlock
          code={`forsure init my-project.forsure`}
          language="bash"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Code Generation Commands</h2>

        <h3 className="text-xl font-medium">gen component</h3>
        <p>Generate a new React component with TypeScript support:</p>
        <DocsCodeBlock
          code={`forsure gen component -n my-button -t basic --typescript --test --storybook`}
          language="bash"
        />

        <h3 className="text-xl font-medium">gen hook</h3>
        <p>Generate a custom React hook:</p>
        <DocsCodeBlock
          code={`forsure gen hook -n use-data-fetcher -t api --typescript --test`}
          language="bash"
        />

        <h3 className="text-xl font-medium">gen utility</h3>
        <p>Generate a utility function:</p>
        <DocsCodeBlock
          code={`forsure gen utility -n format-currency --typescript --test`}
          language="bash"
        />

        <h3 className="text-xl font-medium">gen page</h3>
        <p>Generate a Next.js page:</p>
        <DocsCodeBlock
          code={`forsure gen page -n dashboard -t admin --typescript --test`}
          language="bash"
        />

        <h3 className="text-xl font-medium">gen layout</h3>
        <p>Generate a layout component:</p>
        <DocsCodeBlock
          code={`forsure gen layout -n main-layout -t default --typescript --test`}
          language="bash"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Design System Commands</h2>

        <h3 className="text-xl font-medium">design tokens</h3>
        <p>Generate CSS variables from design tokens:</p>
        <DocsCodeBlock
          code={`forsure design tokens --format css`}
          language="bash"
        />
        <p>Generate SCSS variables:</p>
        <DocsCodeBlock
          code={`forsure design tokens --format scss`}
          language="bash"
        />
        <p>Watch for changes and auto-generate:</p>
        <DocsCodeBlock
          code={`forsure design tokens --watch`}
          language="bash"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Project Management Commands</h2>

        <h3 className="text-xl font-medium">setup</h3>
        <p>Setup development environment:</p>
        <DocsCodeBlock
          code={`forsure setup`}
          language="bash"
        />

        <h3 className="text-xl font-medium">clean</h3>
        <p>Clean build artifacts:</p>
        <DocsCodeBlock
          code={`forsure clean`}
          language="bash"
        />

        <h3 className="text-xl font-medium">lint</h3>
        <p>Lint and fix code:</p>
        <DocsCodeBlock
          code={`forsure lint --fix`}
          language="bash"
        />

        <h3 className="text-xl font-medium">test</h3>
        <p>Run tests with coverage:</p>
        <DocsCodeBlock
          code={`forsure test --coverage`}
          language="bash"
        />

        <h3 className="text-xl font-medium">build</h3>
        <p>Build project for production:</p>
        <DocsCodeBlock
          code={`forsure build --production`}
          language="bash"
        />

        <h3 className="text-xl font-medium">publish</h3>
        <p>Publish package to registry:</p>
        <DocsCodeBlock
          code={`forsure publish --registry npm --tag latest`}
          language="bash"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Common Options
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Option</th>
              <th className="text-left py-2 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--output, -o</td>
              <td className="py-2 px-4">Specify the output directory</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--force, -f</td>
              <td className="py-2 px-4">Overwrite existing files</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--dry-run, -d</td>
              <td className="py-2 px-4">
                Show what would be generated without actually creating files
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--verbose, -v</td>
              <td className="py-2 px-4">Show detailed output</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--help, -h</td>
              <td className="py-2 px-4">Show help information</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Examples</h2>

        <h3 className="text-xl font-medium">Generate a project structure</h3>
        <DocsCodeBlock
          code={`forsure generate project.forsure --output ./my-project`}
          language="bash"
        />

        <h3 className="text-xl font-medium">Validate a ForSure file</h3>
        <DocsCodeBlock
          code={`forsure validate project.forsure`}
          language="bash"
        />

        <h3 className="text-xl font-medium">Generate with verbose output</h3>
        <DocsCodeBlock
          code={`forsure generate project.forsure --output ./my-project --verbose`}
          language="bash"
        />

        <h3 className="text-xl font-medium">Force overwrite existing files</h3>
        <DocsCodeBlock
          code={`forsure generate project.forsure --output ./my-project --force`}
          language="bash"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Configuration</h2>
        <p>You can configure the ForSure CLI using a configuration file:</p>
        <DocsCodeBlock
          code={`{
  "defaultOutput": "./output",
  "ignorePatterns": [
    "node_modules",
    ".git"
  ],
  "attributes": {
    "defaultPermissions": "644"
  }
}`}
          language="json"
          fileName=".forsurerc.json"
        />
        <p>Learn more about configuration options:</p>
        <Link
          href="/docs/cli/configuration"
          className="text-primary hover:underline"
        >
          CLI Configuration →
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Next Steps</h2>
        <p>Now that you understand the CLI, you can:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link
              href="/docs/cli/options"
              className="text-primary hover:underline"
            >
              Explore all CLI options
            </Link>
          </li>
          <li>
            <Link href="/docs/api" className="text-primary hover:underline">
              Learn about the programmatic API
            </Link>
          </li>
          <li>
            <Link
              href="/docs/examples"
              className="text-primary hover:underline"
            >
              See more examples
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
