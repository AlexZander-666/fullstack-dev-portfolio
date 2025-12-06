# API Documentation

Base URL: `http://localhost:5000/api`

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Authentication

- JWT Bearer token in `Authorization` header
- Format: `Authorization: Bearer <token>`
- Token obtained via `/api/auth/login`

## Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/login` | Public | Admin login |
| GET | `/me` | Private | Get current user |
| POST | `/refresh` | Private | Refresh token |

### Posts (`/api/posts`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | List posts (paginated) |
| GET | `/:slug` | Public | Get post by slug |
| POST | `/` | Admin | Create post |
| PUT | `/:id` | Admin | Update post |
| DELETE | `/:id` | Admin | Delete post |

Query params for GET `/`:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `tag` - Filter by tag
- `search` - Search in title/content
- `published` - Filter by status (admin only)

### Projects (`/api/projects`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | List all projects |
| GET | `/:id` | Public | Get project by ID |
| POST | `/` | Admin | Create project |
| PUT | `/:id` | Admin | Update project |
| DELETE | `/:id` | Admin | Delete project |

Query params for GET `/`:
- `featured` - Filter featured projects (`true`)

### Contact (`/api/contact`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Public | Submit contact message |
| GET | `/` | Admin | List all messages |
| PATCH | `/:id/read` | Admin | Mark as read |

## Validation

- All request bodies validated with Zod schemas
- Validation errors return 400 with field-specific messages
- Schemas located in `/backend/src/schemas/`

## Error Codes

- `400` - Validation error
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Internal server error
