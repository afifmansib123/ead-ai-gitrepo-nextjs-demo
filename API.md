# API Documentation

## Base URL

**Development:** `http://localhost:5000`
**Production:** `https://api.yourcompany.com`

## Authentication

Currently not implemented (MVP). All endpoints are public.

## Endpoints

### Health Check

Check if the API is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development",
  "service": "quotation-ai-backend"
}
```

---

### Test Gemini Connection

Test if Gemini API is connected and working.

**Endpoint:** `GET /api/upload/test`

**Response:**
```json
{
  "success": true,
  "geminiConnected": true,
  "message": "Gemini API is connected"
}
```

---

### Upload and Analyze Drawing

Upload an engineering drawing and get AI analysis with cost estimation.

**Endpoint:** `POST /api/upload`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| drawing | File | Yes | Image file (JPG, PNG, WebP, max 10MB) |

**Example Request (cURL):**

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "drawing=@path/to/drawing.jpg"
```

**Example Request (JavaScript):**

```javascript
const formData = new FormData();
formData.append('drawing', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "documentId": "DOC-1705315800000",
  "filename": "drawing-1705315800000.jpg",
  "analysis": {
    "specs": {
      "dimensions": {
        "length": 150,
        "width": 75,
        "height": null,
        "thickness": 10,
        "diameter": null,
        "unit": "mm"
      },
      "material": {
        "type": "Steel SS400",
        "grade": "SS400",
        "specifications": "Standard structural steel",
        "aiConfidence": 0.92
      },
      "quantity": 10,
      "surfaceFinish": "Polishing",
      "tolerances": ["+/- 0.1mm", "+/- 0.05mm on critical dimensions"],
      "manufacturingProcess": [
        "Laser Cutting",
        "Bending",
        "Welding",
        "Surface Treatment"
      ]
    },
    "confidence": 0.89
  },
  "costing": {
    "material": 8500,
    "labor": 22000,
    "overhead": 6100,
    "total": 36600,
    "confidence": 0.82,
    "reasoning": "Cost estimation based on SS400 steel at standard market rates, considering laser cutting complexity and surface finishing requirements. Labor hours estimated at 3.5 hours per unit with standard hourly rate of ¥6,300."
  },
  "message": "Drawing analyzed successfully"
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "No file uploaded"
}
```

**Error Response (500 Internal Server Error):**

```json
{
  "success": false,
  "error": "Failed to analyze drawing with Gemini: [error details]"
}
```

---

## Data Models

### DrawingSpecs

```typescript
{
  dimensions: {
    length?: number;           // in specified unit
    width?: number;            // in specified unit
    height?: number;           // in specified unit
    thickness?: number;        // in specified unit
    diameter?: number;         // in specified unit (for cylindrical parts)
    unit: 'mm' | 'cm' | 'inch' | 'm';  // measurement unit
  };
  material: {
    type: string;              // e.g., "Steel SS400", "Aluminum 6061"
    grade?: string;            // material grade if specified
    specifications?: string;   // additional material specs
    aiConfidence: number;      // 0.0 to 1.0
  };
  quantity: number;            // number of units
  surfaceFinish?: string;      // e.g., "Polishing", "Painting", "Anodizing"
  tolerances?: string[];       // list of tolerances from drawing
  manufacturingProcess: string[]; // required processes
}
```

### CostEstimate

```typescript
{
  material: number;      // material cost in JPY
  labor: number;         // labor cost in JPY
  overhead: number;      // overhead cost in JPY
  total: number;         // total cost in JPY
  confidence: number;    // 0.0 to 1.0
  reasoning?: string;    // explanation of cost calculation
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Endpoint doesn't exist |
| 500 | Internal Server Error - Processing failed |

---

## Rate Limiting

Currently not implemented (MVP).

**Planned limits:**
- 100 requests per 15 minutes per IP
- 1000 requests per day per user

---

## File Constraints

**Supported formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

**File size limit:** 10MB

**Recommended:**
- Resolution: 1000x1000 to 3000x3000 pixels
- Clear, high-contrast images
- Well-lit, straight-on photos or scans
- Dimensions and text clearly visible

---

## Response Times

**Expected response times:**

| Operation | Time |
|-----------|------|
| Health check | < 100ms |
| Connection test | 1-3 seconds |
| Upload + Analysis | 5-15 seconds |

**Factors affecting response time:**
- Image size and complexity
- Gemini API response time
- Network latency
- Server load

---

## Best Practices

### Image Quality

✅ **Do:**
- Use high-resolution scans
- Ensure good lighting and contrast
- Include all dimension labels
- Capture material specifications
- Photograph/scan straight-on

❌ **Don't:**
- Use blurry or low-resolution images
- Submit drawings with poor contrast
- Include multiple drawings in one image
- Use photos taken at an angle
- Submit damaged or faded drawings

### API Usage

✅ **Do:**
- Handle errors gracefully
- Implement retry logic for network failures
- Show loading states to users
- Validate files before uploading
- Log API responses for debugging

❌ **Don't:**
- Upload non-image files
- Send files over 10MB
- Ignore error responses
- Retry infinitely on errors
- Store API responses without user consent

---

## WebSocket Events (Future)

Real-time processing updates via Socket.io:

```javascript
const socket = io('http://localhost:5000');

socket.on('job:update', (data) => {
  console.log('Progress:', data.progress);
  console.log('Step:', data.step);
});
```

**Event types:**
- `job:queued` - Job added to queue
- `job:processing` - Analysis started
- `job:completed` - Analysis complete
- `job:failed` - Analysis failed

---

## Changelog

### v1.0.0 (MVP) - 2024-01-15
- Initial release
- Gemini Vision API integration
- Drawing analysis endpoint
- Cost estimation
- Basic error handling

### Planned Features

**v1.1.0:**
- MongoDB integration
- Data persistence
- Historical quotations

**v1.2.0:**
- User authentication
- API key management
- Rate limiting

**v1.3.0:**
- Real-time processing updates
- Background job queue
- Retry mechanisms

**v2.0.0:**
- Quote PDF generation
- Email integration
- Admin dashboard

---

## Support

For API issues or questions:
- Check logs: `backend/logs/combined.log`
- Review this documentation
- Test with smaller/clearer images
- Verify API key is configured

## Example Integration

### React Component

```typescript
import { useState } from 'react';
import axios from 'axios';

function DrawingUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('drawing', file);

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/upload',
        formData
      );
      setResult(data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Analyzing...' : 'Upload'}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

### Node.js Example

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function analyzeDrawing(filePath) {
  const form = new FormData();
  form.append('drawing', fs.createReadStream(filePath));

  try {
    const response = await axios.post(
      'http://localhost:5000/api/upload',
      form,
      {
        headers: form.getHeaders(),
      }
    );
    console.log('Analysis result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
analyzeDrawing('./drawing.jpg');
```

### Python Example

```python
import requests

def analyze_drawing(file_path):
    url = 'http://localhost:5000/api/upload'

    with open(file_path, 'rb') as f:
        files = {'drawing': f}
        response = requests.post(url, files=files)

    if response.status_code == 200:
        result = response.json()
        print('Analysis successful!')
        print(f"Material: {result['analysis']['specs']['material']['type']}")
        print(f"Total cost: ¥{result['costing']['total']:,}")
        return result
    else:
        print(f"Error: {response.json()}")
        return None

# Usage
analyze_drawing('drawing.jpg')
```
