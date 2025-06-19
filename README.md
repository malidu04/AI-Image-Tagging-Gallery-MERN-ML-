# Image Gallery Backend

A Node.js backend server for an AI-powered image gallery with automatic tagging using machine learning.

## Features

- 📸 **Image Upload**: Upload images with validation and size limits
- 🤖 **AI Tagging**: Automatic image analysis and tagging using ML service
- 🔍 **Search & Filter**: Search images by tags or filename
- 🏷️ **Tag Management**: View and manage image tags
- 📊 **Pagination**: Efficient pagination for large image collections
- 🗑️ **Delete Images**: Remove images and associated files
- ✏️ **Manual Tagging**: Update tags manually if needed

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer
- **HTTP Client**: Axios
- **ML Integration**: External Python ML service

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── imageController.js   # Business logic
├── middleware/
│   └── uploadMiddleware.js  # File upload handling
├── models/
│   └── Image.js            # Image schema
├── routes/
│   └── imageRoutes.js      # API routes
├── services/
│   └── mlService.js        # ML service integration
├── utils/
│   ├── fileUtils.js        # File system utilities
│   └── serverUtils.js      # Server utilities
├── uploads/                # Uploaded images directory
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js              # Main application entry point
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd image-gallery-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/image-gallery` |
| `ML_SERVICE_URL` | ML service endpoint | `http://localhost:5001` |
| `MAX_FILE_SIZE` | Maximum file size in bytes | `5242880` (5MB) |

## API Endpoints

### Upload Image
```http
POST /api/upload
Content-Type: multipart/form-data

Form data:
- image: File (required)
```

### Get Images
```http
GET /api/images?tag=<tag>&search=<query>&page=<page>&limit=<limit>
```

### Get Tags
```http
GET /api/tags
```

### Get Single Image
```http
GET /api/images/:id
```

### Delete Image
```http
DELETE /api/images/:id
```

### Update Image Tags
```http
PUT /api/images/:id/tags
Content-Type: application/json

{
  "tags": ["tag1", "tag2", "tag3"]
}
```

### Health Check
```http
GET /api/health
```

## ML Service Integration

The backend integrates with an external ML service running on port 5001. The ML service should provide:

- `POST /analyze` - Analyze uploaded image and return tags
- `GET /health` - Health check endpoint
- `GET /models` - Available models information

### Expected ML Service Response Format

```json
{
  "tags": ["cat", "animal", "pet"],
  "confidence": {
    "cat": 0.95,
    "animal": 0.89,
    "pet": 0.87
  }
}
```

## Database Schema

### Image Model
```javascript
{
  filename: String,        // Generated filename
  originalName: String,    // Original filename
  path: String,           // File path
  tags: [String],         // Image tags
  confidence: Object,     // Tag confidence scores
  uploadDate: Date,       // Upload timestamp
  fileSize: Number,       // File size in bytes
  mimeType: String       // MIME type
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "timestamp": "2025-06-15T10:30:00.000Z",
  "details": "Additional error details (development only)"
}
```

## File Upload Limits

- **Maximum file size**: 5MB
- **Allowed formats**: JPG, JPEG, PNG, GIF, BMP, WEBP
- **Single file upload only**

## Development

### Running in Development Mode
```bash
npm run dev
```

This uses nodemon for automatic server restart on file changes.

### Testing API Endpoints

You can use tools like Postman, curl, or HTTPie to test the API:

```bash
# Upload an image
curl -X POST \
  http://localhost:5000/api/upload \
  -
