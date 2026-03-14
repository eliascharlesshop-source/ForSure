import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DocsCodeBlock from '@/components/docs-code-block'

export default function FileStructurePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm font-medium">
            Syntax
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">File Structure</h1>
        <p className="text-xl text-muted-foreground">
          How to define hierarchical file and directory structures in ForSure.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Directory Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Directories are defined using indentation and the Type: Directory
              property.
            </p>
            <DocsCodeBlock
              code={`root:
  - Type: Directory
    - Name: src/
    <description>
    Main source directory
    </description>
    
    - Type: Directory
      - Name: components/
      <description>
      React components
      </description>
      
      - Type: File
        - Name: Button.jsx
        <description>
      Button component
      </description>`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Files are defined with Type: File and can include content
              templates.
            </p>
            <DocsCodeBlock
              code={`root:
  - Type: File
    - Name: package.json
    <content>
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js"
  }
}
    </content>
    <description>
    Package configuration
    </description>`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nested Structures</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create complex nested structures by combining directories and
              files.
            </p>
            <DocsCodeBlock
              code={`root:
  - Type: Directory
    - Name: web-app/
    <description>
    Full web application structure
    </description>
    
    - Type: File
      - Name: package.json
      <content>
{"name": "web-app", "version": "1.0.0"}
      </content>
      
    - Type: Directory
      - Name: public/
      <description>
      Static assets
      </description>
      
      - Type: Directory
      - Name: src/
      <description>
      Source code
      </description>
      
      - Type: File
        - Name: index.html
        <content>
<!DOCTYPE html>
<html>
<head><title>Web App</title></head>
<body><h1>Hello World</h1></body>
</html>
        </content>`}
              language="forsure"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
