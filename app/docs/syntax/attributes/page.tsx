import { Badge } from '@/components/ui/forsure-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/forsure-card'
import DocsCodeBlock from '@/components/docs-code-block'

export default function AttributesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm font-medium">
            Syntax
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Attributes</h1>
        <p className="text-xl text-muted-foreground">
          Advanced attributes and properties for fine-tuning file generation.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>File Attributes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Control file permissions, encoding, and other properties.
            </p>
            <DocsCodeBlock
              code={`root:
  - Type: File
    - Name: script.sh
    - Permissions: 755
    - Encoding: utf-8
    - LineEnding: unix
    <content>
#!/bin/bash
echo "Hello World"
    </content>
    <description>
    Executable shell script
    </description>`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conditional Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use conditions to control when files should be created.
            </p>
            <DocsCodeBlock
              code={`root:
  - Type: File
    - Name: .gitignore
    - Condition: "git == true"
    <content>
node_modules/
dist/
.env
    </content>
    
  - Type: File
    - Name: Dockerfile
    - Condition: "docker == true"
    <content>
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
    </content>`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Template Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use variables to make templates more flexible.
            </p>
            <DocsCodeBlock
              code={`root:
  - Type: File
    - Name: package.json
    <content>
{
  "name": "\${PROJECT_NAME}",
  "version": "\${VERSION}",
  "description": "\${DESCRIPTION}",
  "author": "\${AUTHOR}",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}
    </content>
    <description>
    Package configuration with variables
    </description>`}
              language="forsure"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Attributes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Define custom attributes for specialized use cases.
            </p>
            <DocsCodeBlock
              code={`root:
  - Type: File
    - Name: config.json
    - Custom: ["env:production", "encrypted:true"]
    - Priority: high
    - Dependencies: ["database", "cache"]
    <content>
{
  "environment": "production",
  "encrypted": true,
  "priority": "high"
}
    </content>`}
              language="forsure"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
