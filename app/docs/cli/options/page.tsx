import Link from 'next/link'
import DocsCodeBlock from '@/components/docs-code-block'

export default function CLIOptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          CLI Options
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive reference for all ForSure CLI command options.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Global Options</h2>
        <p>These options can be used with any ForSure CLI command:</p>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Option</th>
              <th className="text-left py-2 px-4">Short</th>
              <th className="text-left py-2 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--help</td>
              <td className="py-2 px-4 font-mono text-sm">-h</td>
              <td className="py-2 px-4">Show help information for the command</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--verbose</td>
              <td className="py-2 px-4 font-mono text-sm">-v</td>
              <td className="py-2 px-4">Show detailed output and logging</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--config</td>
              <td className="py-2 px-4 font-mono text-sm">-c</td>
              <td className="py-2 px-4">Specify path to configuration file</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--version</td>
              <td className="py-2 px-4 font-mono text-sm">-V</td>
              <td className="py-2 px-4">Show CLI version information</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Generate Command Options</h2>
        <p>Options specific to the <code className="bg-muted px-1 rounded">generate</code> command:</p>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Option</th>
              <th className="text-left py-2 px-4">Short</th>
              <th className="text-left py-2 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--output</td>
              <td className="py-2 px-4 font-mono text-sm">-o</td>
              <td className="py-2 px-4">Specify the output directory</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--force</td>
              <td className="py-2 px-4 font-mono text-sm">-f</td>
              <td className="py-2 px-4">Overwrite existing files</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--dry-run</td>
              <td className="py-2 px-4 font-mono text-sm">-d</td>
              <td className="py-2 px-4">Show what would be generated without creating files</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--template</td>
              <td className="py-2 px-4 font-mono text-sm">-t</td>
              <td className="py-2 px-4">Use specific template for generation</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--ignore</td>
              <td className="py-2 px-4 font-mono text-sm">-i</td>
              <td className="py-2 px-4">Ignore files matching pattern</td>
            </tr>
          </tbody>
        </table>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Examples:</h4>
          <DocsCodeBlock
            code={`forsure generate project.forsure --output ./my-project --force
forsure generate project.forsure --dry-run --verbose
forsure generate project.forsure --template react --ignore "*.test.js"`}
            language="bash"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Gen Command Options</h2>
        <p>Options for code generation commands (<code className="bg-muted px-1 rounded">gen component</code>, <code className="bg-muted px-1 rounded">gen hook</code>, etc.):</p>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Option</th>
              <th className="text-left py-2 px-4">Short</th>
              <th className="text-left py-2 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--name</td>
              <td className="py-2 px-4 font-mono text-sm">-n</td>
              <td className="py-2 px-4">Specify the name for the generated item</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--template</td>
              <td className="py-2 px-4 font-mono text-sm">-t</td>
              <td className="py-2 px-4">Template type (basic, form, layout, data, api)</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--typescript</td>
              <td className="py-2 px-4 font-mono text-sm">-ts</td>
              <td className="py-2 px-4">Generate TypeScript files</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--test</td>
              <td className="py-2 px-4 font-mono text-sm"></td>
              <td className="py-2 px-4">Generate test files</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--storybook</td>
              <td className="py-2 px-4 font-mono text-sm">-sb</td>
              <td className="py-2 px-4">Generate Storybook stories</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--path</td>
              <td className="py-2 px-4 font-mono text-sm">-p</td>
              <td className="py-2 px-4">Output path for generated files</td>
            </tr>
          </tbody>
        </table>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Examples:</h4>
          <DocsCodeBlock
            code={`forsure gen component -n button --template basic --typescript --test --storybook
forsure gen hook -n use-api --template api --typescript --test
forsure gen page -n dashboard --template admin --typescript --path ./pages/admin`}
            language="bash"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Design System Options</h2>
        <p>Options for design system commands:</p>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Option</th>
              <th className="text-left py-2 px-4">Short</th>
              <th className="text-left py-2 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--format</td>
              <td className="py-2 px-4 font-mono text-sm">-f</td>
              <td className="py-2 px-4">Output format (css, scss, typescript, json)</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--watch</td>
              <td className="py-2 px-4 font-mono text-sm">-w</td>
              <td className="py-2 px-4">Watch for changes and auto-generate</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--theme</td>
              <td className="py-2 px-4 font-mono text-sm"></td>
              <td className="py-2 px-4">Generate specific theme</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--output</td>
              <td className="py-2 px-4 font-mono text-sm">-o</td>
              <td className="py-2 px-4">Output directory for generated files</td>
            </tr>
          </tbody>
        </table>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Examples:</h4>
          <DocsCodeBlock
            code={`forsure design tokens --format css --watch
forsure design tokens --format scss --theme dark --output ./themes/
forsure design tokens --format typescript --output ./types/`}
            language="bash"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Build & Test Options</h2>
        <p>Options for build and test commands:</p>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Option</th>
              <th className="text-left py-2 px-4">Short</th>
              <th className="text-left py-2 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--production</td>
              <td className="py-2 px-4 font-mono text-sm">-p</td>
              <td className="py-2 px-4">Build for production environment</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--coverage</td>
              <td className="py-2 px-4 font-mono text-sm">-c</td>
              <td className="py-2 px-4">Generate test coverage report</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--watch</td>
              <td className="py-2 px-4 font-mono text-sm">-w</td>
              <td className="py-2 px-4">Watch mode for tests</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--minify</td>
              <td className="py-2 px-4 font-mono text-sm"></td>
              <td className="py-2 px-4">Minify output files</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--sourcemap</td>
              <td className="py-2 px-4 font-mono text-sm">-s</td>
              <td className="py-2 px-4">Generate source maps</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Publish Options</h2>
        <p>Options for the publish command:</p>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Option</th>
              <th className="text-left py-2 px-4">Short</th>
              <th className="text-left py-2 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--registry</td>
              <td className="py-2 px-4 font-mono text-sm">-r</td>
              <td className="py-2 px-4">Package registry (npm, yarn, private)</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--tag</td>
              <td className="py-2 px-4 font-mono text-sm">-t</td>
              <td className="py-2 px-4">Release tag (latest, beta, alpha)</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--dry-run</td>
              <td className="py-2 px-4 font-mono text-sm">-d</td>
              <td className="py-2 px-4">Simulate publish without actually publishing</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">--access</td>
              <td className="py-2 px-4 font-mono text-sm">-a</td>
              <td className="py-2 px-4">Access level (public, private)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Environment Variables</h2>
        <p>ForSure CLI can be configured using environment variables:</p>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Variable</th>
              <th className="text-left py-2 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">FORSURE_CONFIG</td>
              <td className="py-2 px-4">Path to configuration file</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">FORSURE_OUTPUT_DIR</td>
              <td className="py-2 px-4">Default output directory</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">FORSURE_TEMPLATE_DIR</td>
              <td className="py-2 px-4">Custom templates directory</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">FORSURE_LOG_LEVEL</td>
              <td className="py-2 px-4">Logging level (error, warn, info, debug)</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-mono text-sm">FORSURE_REGISTRY</td>
              <td className="py-2 px-4">Default package registry</td>
            </tr>
          </tbody>
        </table>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Example Usage:</h4>
          <DocsCodeBlock
            code={`export FORSURE_CONFIG="./custom-config.json"
export FORSURE_OUTPUT_DIR="./dist"
export FORSURE_LOG_LEVEL="debug"

forsure generate project.forsure`}
            language="bash"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Next Steps</h2>
        <p>Learn more about configuring the ForSure CLI:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link
              href="/docs/cli/configuration"
              className="text-primary hover:underline"
            >
              CLI Configuration →
            </Link>
          </li>
          <li>
            <Link href="/docs/cli" className="text-primary hover:underline">
              Back to CLI Reference →
            </Link>
          </li>
          <li>
            <Link
              href="/docs/examples"
              className="text-primary hover:underline"
            >
              See more examples →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
