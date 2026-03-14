# REST API Reference

This document provides comprehensive reference documentation for all REST API endpoints in the ForSure application.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Staging**: `https://staging.forsure.app/api`
- **Production**: `https://forsure.app/api`

## Authentication

All API endpoints (except authentication endpoints) require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Format

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "pagination": { ... },
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": { ... },
  "code": "ERROR_CODE"
}
```

## Rate Limiting

- **Authentication endpoints**: 5 requests per 15 minutes
- **General API endpoints**: 100 requests per 15 minutes
- **Upload endpoints**: 10 requests per hour
- **Search endpoints**: 50 requests per 15 minutes

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Endpoints

### Authentication

#### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "message": "Registration successful. Please check your email to verify your account."
  }
}
```

**Validation Errors (422):**

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": ["Invalid email format"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

#### POST /api/auth/login

Authenticate user and return session.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_at": 1640995200
    }
  }
}
```

#### POST /api/auth/logout

Logout current user session.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

#### GET /api/auth/me

Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "avatar_url": "https://...",
    "bio": "Full-stack developer",
    "company": "Tech Corp",
    "location": "San Francisco",
    "skills": ["JavaScript", "React", "Node.js"],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /api/auth/refresh

Refresh JWT token.

**Request Body:**

```json
{
  "refresh_token": "refresh-token"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "access_token": "new-jwt-token",
    "expires_at": 1640995200
  }
}
```

#### POST /api/auth/forgot-password

Request password reset email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  }
}
```

#### POST /api/auth/reset-password

Reset password with token.

**Request Body:**

```json
{
  "token": "reset-token",
  "new_password": "NewPassword123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "Password reset successful"
  }
}
```

### User Management

#### GET /api/users/profile

Get current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "bio": "Full-stack developer",
    "avatar_url": "https://...",
    "company": "Tech Corp",
    "location": "San Francisco",
    "skills": ["JavaScript", "React", "Node.js"],
    "social_links": {
      "github": "https://github.com/username",
      "linkedin": "https://linkedin.com/in/username",
      "twitter": "https://twitter.com/username"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /api/users/profile

Update current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "John Smith",
  "bio": "Senior Full-stack developer",
  "company": "New Tech Corp",
  "location": "New York",
  "skills": ["JavaScript", "React", "Node.js", "Python"],
  "social_links": {
    "github": "https://github.com/newusername",
    "linkedin": "https://linkedin.com/in/newusername",
    "twitter": "https://twitter.com/newusername"
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Smith",
    "bio": "Senior Full-stack developer",
    "company": "New Tech Corp",
    "location": "New York",
    "skills": ["JavaScript", "React", "Node.js", "Python"],
    "social_links": {
      "github": "https://github.com/newusername",
      "linkedin": "https://linkedin.com/in/newusername",
      "twitter": "https://twitter.com/newusername"
    },
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /api/users/avatar

Upload user avatar.

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:**

- `file`: Image file (max 5MB, jpg/png/webp)

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "avatar_123.jpg",
    "file_url": "https://supabase-storage-url/avatar_123.jpg",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/users/[id]

Get public user profile by ID.

**Path Parameters:**

- `id`: User UUID

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "avatar_url": "https://...",
    "bio": "Full-stack developer",
    "company": "Tech Corp",
    "location": "San Francisco",
    "skills": ["JavaScript", "React", "Node.js"],
    "project_count": 5,
    "blog_post_count": 3,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Projects

#### GET /api/projects

Get user's projects with pagination and filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 50)
- `search` (string): Search in title and description
- `sort` (string): Sort field (default: created_at)
- `order` (string): Sort order - asc/desc (default: desc)
- `status` (string): Filter by status - active/archived/draft/completed
- `visibility` (string): Filter by visibility - public/private/unlisted

**Response (200):**

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "My Project",
        "description": "Project description",
        "slug": "my-project",
        "status": "active",
        "visibility": "private",
        "progress": 75,
        "owner_id": "uuid",
        "tech_stack": ["React", "Node.js"],
        "tags": ["web", "app"],
        "repository_url": "https://github.com/user/repo",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "profiles": {
          "name": "John Doe",
          "avatar_url": "https://..."
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### POST /api/projects

Create a new project.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "New Project",
  "description": "Project description",
  "tech_stack": ["React", "Node.js"],
  "tags": ["web", "app"],
  "visibility": "private",
  "repository_url": "https://github.com/user/repo"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "New Project",
    "description": "Project description",
    "slug": "new-project",
    "status": "active",
    "visibility": "private",
    "progress": 0,
    "owner_id": "uuid",
    "tech_stack": ["React", "Node.js"],
    "tags": ["web", "app"],
    "repository_url": "https://github.com/user/repo",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/projects/[id]

Get a specific project by ID.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**

- `id`: Project UUID

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Project",
    "description": "Project description",
    "slug": "my-project",
    "status": "active",
    "visibility": "private",
    "progress": 75,
    "owner_id": "uuid",
    "tech_stack": ["React", "Node.js"],
    "tags": ["web", "app"],
    "repository_url": "https://github.com/user/repo",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "profiles": {
      "name": "John Doe",
      "avatar_url": "https://..."
    },
    "collaborators": [
      {
        "user_id": "uuid",
        "name": "Jane Doe",
        "avatar_url": "https://...",
        "role": "editor"
      }
    ]
  }
}
```

#### PUT /api/projects/[id]

Update a project.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**

- `id`: Project UUID

**Request Body:**

```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "completed",
  "progress": 100,
  "tech_stack": ["React", "Node.js", "TypeScript"],
  "tags": ["web", "app", "typescript"]
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Project Name",
    "description": "Updated description",
    "status": "completed",
    "progress": 100,
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE /api/projects/[id]

Delete a project.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**

- `id`: Project UUID

**Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "Project deleted successfully"
  }
}
```

#### POST /api/projects/[id]/collaborators

Add a collaborator to a project.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**

- `id`: Project UUID

**Request Body:**

```json
{
  "user_email": "collaborator@example.com",
  "role": "editor"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "project_id": "uuid",
    "user_id": "uuid",
    "role": "editor",
    "joined_at": "2024-01-01T00:00:00Z"
  }
}
```

### Blog Posts

#### GET /api/blog

Get blog posts with pagination and filtering.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 50)
- `search` (string): Search in title and content
- `tag` (string): Filter by tag
- `author` (string): Filter by author ID
- `status` (string): Filter by status (published/draft/archived)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "Blog Post Title",
        "slug": "blog-post-title",
        "excerpt": "Post excerpt...",
        "cover_image": "https://...",
        "status": "published",
        "read_time": 5,
        "view_count": 150,
        "author_id": "uuid",
        "tags": ["react", "javascript"],
        "published_at": "2024-01-01T00:00:00Z",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "profiles": {
          "name": "John Doe",
          "avatar_url": "https://..."
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### POST /api/blog

Create a new blog post.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "title": "New Blog Post",
  "content": "Blog post content in markdown...",
  "excerpt": "Post excerpt",
  "cover_image": "https://...",
  "tags": ["react", "javascript"],
  "status": "draft"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "New Blog Post",
    "slug": "new-blog-post",
    "content": "Blog post content in markdown...",
    "excerpt": "Post excerpt",
    "cover_image": "https://...",
    "status": "draft",
    "read_time": 8,
    "author_id": "uuid",
    "tags": ["react", "javascript"],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/blog/[slug]

Get a blog post by slug.

**Path Parameters:**

- `slug`: Blog post slug

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Blog Post Title",
    "slug": "blog-post-title",
    "content": "Blog post content in markdown...",
    "excerpt": "Post excerpt",
    "cover_image": "https://...",
    "status": "published",
    "read_time": 5,
    "view_count": 151,
    "author_id": "uuid",
    "tags": ["react", "javascript"],
    "published_at": "2024-01-01T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "profiles": {
      "name": "John Doe",
      "avatar_url": "https://..."
    }
  }
}
```

### File Upload

#### POST /api/upload

Upload a file to Supabase Storage.

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:**

- `file`: File to upload
- `bucket`: Storage bucket name (optional, default: uploads)
- `path`: File path in bucket (optional)

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "file-123.jpg",
    "original_filename": "my-image.jpg",
    "file_size": 1024000,
    "mime_type": "image/jpeg",
    "file_url": "https://supabase-storage-url/file-123.jpg",
    "bucket": "uploads",
    "path": "user-uuid/file-123.jpg",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE /api/upload/[id]

Delete a file.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**

- `id`: File UUID

**Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "File deleted successfully"
  }
}
```

### Search

#### GET /api/search

Global search across projects, blog posts, and users.

**Query Parameters:**

- `q` (string): Search query (required)
- `type` (string): Search type - all/projects/blog/users (default: all)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "results": {
      "projects": [
        {
          "id": "uuid",
          "title": "Project Name",
          "description": "Project description...",
          "type": "project",
          "relevance_score": 0.95
        }
      ],
      "blog_posts": [
        {
          "id": "uuid",
          "title": "Blog Post Title",
          "excerpt": "Post excerpt...",
          "type": "blog_post",
          "relevance_score": 0.87
        }
      ],
      "users": [
        {
          "id": "uuid",
          "name": "John Doe",
          "bio": "User bio...",
          "type": "user",
          "relevance_score": 0.72
        }
      ]
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

### Health Check

#### GET /api/health

Check API and database health status.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0",
    "services": {
      "database": "ok",
      "storage": "ok",
      "auth": "ok"
    },
    "uptime": 86400
  }
}
```

## Error Codes

| Code | Description                                           |
| ---- | ----------------------------------------------------- |
| 400  | Bad Request - Invalid request data                    |
| 401  | Unauthorized - Missing or invalid authentication      |
| 403  | Forbidden - Insufficient permissions                  |
| 404  | Not Found - Resource not found                        |
| 409  | Conflict - Resource already exists                    |
| 422  | Unprocessable Entity - Validation errors              |
| 429  | Too Many Requests - Rate limit exceeded               |
| 500  | Internal Server Error - Server error                  |
| 503  | Service Unavailable - Service temporarily unavailable |

## SDK Examples

### JavaScript/TypeScript

```typescript
// API client setup
const API_BASE = 'http://localhost:3000/api'

class ForSureAPI {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    }

    const response = await fetch(url, { ...options, headers })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'API request failed')
    }

    return data
  }

  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    this.setToken(data.data.session.access_token)
    return data
  }

  async getProjects(params: any = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/projects?${query}`)
  }

  async createProject(projectData: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
  }
}

// Usage
const api = new ForSureAPI()
await api.login('user@example.com', 'password')
const projects = await api.getProjects({ page: 1, limit: 10 })
```

### cURL Examples

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'

# Get projects (with token)
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"New Project","description":"Project description"}'

# Upload file
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/file.jpg"
```

## Testing

### Using Postman Collection

Import the provided Postman collection to test all endpoints:

1. Download `forsure-api.postman_collection.json`
2. Import into Postman
3. Set environment variables for `base_url` and `token`
4. Run requests

### Using Thunder Client

Use the Thunder Client VS Code extension with the provided `.thunder-client` configuration file.

## Changelog

### v1.0.0 (2024-01-01)

- Initial API release
- Authentication endpoints
- User management
- Project CRUD operations
- Blog system
- File upload functionality
- Search functionality
- Health check endpoint

### v1.1.0 (Planned)

- Real-time WebSocket endpoints
- Advanced filtering and sorting
- Bulk operations
- Analytics endpoints
- Webhook support
