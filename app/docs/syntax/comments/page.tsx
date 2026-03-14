import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DocsCodeBlock from '@/components/docs-code-block'

export default function CommentsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm font-medium">
            Syntax
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
        <p className="text-xl text-muted-foreground">
          How to add documentation and comments to your ForSure files.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Line Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use the # symbol to add single-line comments.
            </p>
            <DocsCodeBlock
              code={`# This is a comment explaining the structure
root:
  - Type: Directory
    - Name: src/        # Main source directory
    <description>
    Source code files
    </description>`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use &lt;description&gt; tags to add detailed documentation to
              files and directories.
            </p>
            <DocsCodeBlock
              code={`root:
  - Type: File
    - Name: README.md
    <description>
    This is the main README file for the project.
    It contains important information about setup,
    usage, and contribution guidelines.
    </description>
    <content>
# Project Name

## Description
A brief description of what this project does.

## Installation
\`\`\`bash
npm install
\`\`\`
    </content>`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inline Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Comments can be placed anywhere to clarify complex structures.
            </p>
            <DocsCodeBlock
              code={`# Configuration section
config:
  - Type: File
    - Name: .env.example
    <description>
    Environment variables template
    Copy this to .env and fill in your values
    </description>
    <content>
# Database configuration
DATABASE_URL=postgresql://user:pass@localhost/db
API_KEY=your-api-key-here
DEBUG=true
    </content>

# Source code structure
src:
  - Type: Directory
    - Name: components/     # UI components
    - Name: utils/          # Utility functions
    - Name: hooks/          # Custom React hooks`}
              language="forsure"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
