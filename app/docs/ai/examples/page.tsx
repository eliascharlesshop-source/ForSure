import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DocsCodeBlock from '@/components/docs-code-block'

export default function ExamplesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm font-medium">
            AI & Neural Network
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">AI Examples</h1>
        <p className="text-xl text-muted-foreground">
          Real-world examples of using AI with ForSure for intelligent project
          generation.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Smart Component Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use AI to generate React components based on requirements.
            </p>
            <DocsCodeBlock
              code={`# AI-powered component generator
root:
  - Type: Directory
    - Name: components/
    - AI: "generate-react-component"
    - Description: "Button component with variants"
    - Props: ["onClick", "variant", "size"]
    <ai-config>
      style: "modern"
      typescript: true
      testing: true
    </ai-config>`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intelligent API Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Generate API endpoints based on database schema.
            </p>
            <DocsCodeBlock
              code={`# AI-driven API generation
root:
  - Type: Directory
    - Name: api/
    - AI: "generate-crud-api"
    - Schema: "./database/schema.prisma"
    - Features: ["validation", "documentation", "testing"]
    
    - Type: Directory
      - Name: routes/
      - AI: "generate-endpoints"
      - Model: "User"
      - Operations: ["create", "read", "update", "delete"]`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Neural Network Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use neural networks to optimize project structure.
            </p>
            <DocsCodeBlock
              code={`# NN-optimized structure
root:
  - Type: Directory
    - AI: "optimize-structure"
    - Target: "performance"
    - Metrics: ["bundle-size", "load-time", "seo"]
    <optimization>
      algorithm: "genetic"
      generations: 1000
      fitness: ["speed", "memory", "maintainability"]
    </optimization>`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning from Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              AI learns from existing codebases to suggest improvements.
            </p>
            <DocsCodeBlock
              code={`# Learning mode
root:
  - Type: Directory
    - AI: "learn-from-examples"
    - Training-data: "./examples/"
    - Output-suggestions: true
    <learning>
      style: "transfer-learning"
      base-knowledge: "react-best-practices"
      adaptation: "project-specific"
    </learning>`}
              language="forsure"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
