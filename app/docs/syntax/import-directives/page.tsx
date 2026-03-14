import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DocsCodeBlock from '@/components/docs-code-block'

export default function ImportDirectivesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm font-medium">
            Syntax
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Import Directives</h1>
        <p className="text-xl text-muted-foreground">
          How to import and reuse existing ForSure files and templates.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Import</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Import other ForSure files to reuse structures and templates.
            </p>
            <DocsCodeBlock
              code={`# Import common web app structure
@import "common/web-app.forsure"

# Import React component templates
@import "templates/react-components.forsure"

root:
  - Type: Directory
    - Name: my-project/
    <description>
    My custom project with imported structure
    </description>`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Namespace Import</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Import with namespaces to avoid naming conflicts.
            </p>
            <DocsCodeBlock
              code={`@import "templates/react.forsure" as react
@import "templates/vue.forsure" as vue

root:
  - Type: Directory
    - Name: components/
    
    # Use React component template
    - react:Button
      - Name: PrimaryButton.jsx
      - Props: { variant: "primary" }
      
    # Use Vue component template  
    - vue:Button
      - Name: PrimaryButton.vue
      - Props: { type: "primary" }`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selective Import</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Import only specific items from a ForSure file.
            </p>
            <DocsCodeBlock
              code={`# Import only specific templates
@import "templates/all.forsure" {
  ReactComponent,
  UtilityFile,
  ConfigFile
}

root:
  - Type: Directory
    - Name: src/
    
    # Use imported template
    - ReactComponent
      - Name: Header.jsx
      - Props: { title: "My App" }
      
    - UtilityFile
      - Name: helpers.js
      
    - ConfigFile
      - Name: app.config.js`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dynamic Import</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use variables and conditions in import statements.
            </p>
            <DocsCodeBlock
              code={`# Conditional imports
@import "templates/\${FRAMEWORK}.forsure"
@import "configs/\${ENVIRONMENT}.forsure" if ENVIRONMENT

# Variable-based imports
@import "user-templates/\${USER_TEMPLATE}.forsure"

root:
  - Type: Directory
    - Name: project/
    <description>
    Project structure with dynamic imports
    </description>`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              ForSure resolves imports in this order:
            </p>
            <DocsCodeBlock
              code={`# 1. Relative paths
@import "./local-template.forsure"

# 2. Project templates directory
@import "templates/web-app.forsure"

# 3. Global templates
@import "standard/react-app.forsure"

# 4. Remote templates (if available)
@import "https://templates.example.com/nextjs.forsure"`}
              language="forsure"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
