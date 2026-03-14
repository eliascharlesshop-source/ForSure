import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DocsCodeBlock from '@/components/docs-code-block'

export default function AdvancedPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm font-medium">
            AI & Neural Network
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Advanced AI Features
        </h1>
        <p className="text-xl text-muted-foreground">
          Cutting-edge AI capabilities for intelligent project generation.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Multi-Model Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Combine multiple AI models for enhanced results.
            </p>
            <DocsCodeBlock
              code={`# Multi-model approach
root:
  - Type: Directory
    - AI: "multi-model"
    - Models: ["gpt-4", "claude-3", "gemini-pro"]
    - Voting: "consensus"
    - Confidence: 0.95
    
    - Type: File
      - Name: architecture.md
      - AI: "generate-documentation"
      - Input: "combined-model-analysis"
      - Format: "markdown"`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Neural Architecture Search</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use neural networks to find optimal project structures.
            </p>
            <DocsCodeBlock
              code={`# Neural architecture optimization
root:
  - Type: Directory
    - AI: "neural-search"
    - Search-space: "all-architectures"
    - Iterations: 1000
    - Fitness-function: "performance + maintainability"
    
    - Type: File
      - Name: optimal-structure.forsure
      - AI: "generate-best-match"
      - Criteria: ["scalability", "testability", "team-size"]`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adaptive Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              AI adapts to your coding style and preferences.
            </p>
            <DocsCodeBlock
              code={`# Adaptive learning system
root:
  - Type: Directory
    - AI: "adaptive-learning"
    - Profile: "./user-coding-style.json"
    - History: "./project-history/"
    - Adaptation-rate: 0.1
    
    - Type: File
      - Name: personalized-template.forsure
      - AI: "generate-custom"
      - Style: "learned-preference"
      - Patterns: "user-specific"`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predictive Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              AI suggests improvements and optimizations proactively.
            </p>
            <DocsCodeBlock
              code={`# Predictive assistance
root:
  - Type: Directory
    - AI: "predictive-analysis"
    - Context: "current-project + industry-trends"
    - Suggestions: ["performance", "security", "best-practices"]
    
    - Type: File
      - Name: recommendations.md
      - AI: "generate-insights"
      - Analysis: "code-review + dependency-analysis"
      - Priority: "high-impact-changes"`}
              language="forsure"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
