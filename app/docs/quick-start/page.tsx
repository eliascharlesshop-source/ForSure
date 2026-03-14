import Link from 'next/link'
import { ArrowRight, Terminal, Code } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DocsCodeBlock from '@/components/docs-code-block'

export default function QuickStartPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm font-medium">
            Getting Started
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Quick Start Guide</h1>
        <p className="text-xl text-muted-foreground">
          Get up and running with ForSure in just a few minutes.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Step 1: Create your first ForSure file
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create a new file with the .forsure extension and define your
                project structure.
              </p>
              <DocsCodeBlock
                code={`# project.forsure
root:
  - Type: Directory
    - Name: src/
    <description>
    Source code directory
    </description>
    
    - Type: File
      - Name: index.js
      <description>
    Main application file
    </description>`}
                language="forsure"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Step 2: Generate your project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Use the ForSure CLI to generate the actual files and
                directories.
              </p>
              <DocsCodeBlock
                code={`forsure generate project.forsure --output ./my-project`}
                language="bash"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Step 3: Verify the output
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Check that your project structure was created correctly.
              </p>
              <DocsCodeBlock
                code={`tree my-project
my-project/
└── src/
    └── index.js`}
                language="bash"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Next Steps</h2>
        <div className="grid gap-4">
          <Link
            href="/docs/syntax"
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <div>
              <h3 className="font-semibold">Learn the Syntax</h3>
              <p className="text-sm text-muted-foreground">
                Deep dive into ForSure's powerful syntax features
              </p>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/docs/examples"
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <div>
              <h3 className="font-semibold">View Examples</h3>
              <p className="text-sm text-muted-foreground">
                See real-world examples and use cases
              </p>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
