# Testing Guide

## Prerequisites

1. **Node.js 18+** installed
2. **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies
npm install
```

### 2. Configure Environment

The `.env` file is already configured with your API key, but you can verify:

```bash
cat backend/.env
```

Should show:
```
GEMINI_API_KEY=AIzaSyA1-bXOdeOrO8yS6UNd5nck2vS3M7BI7lo
```

### 3. Test Gemini API Connection

```bash
cd backend
npx ts-node test-gemini.ts
```

Expected output:
```
✅ SUCCESS! Gemini API is working!
📝 Response: Hello, Gemini is working!
🎉 Your Gemini API integration is ready!
```

### 4. Start Backend Server

```bash
# From project root
npm run dev:backend
```

Expected output:
```
🚀 Server running on port 5000
📝 Environment: development
🤖 Gemini API: Configured

Available endpoints:
  GET  /health
  GET  /api/upload/test
  POST /api/upload
```

### 5. Test Backend Endpoints

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Gemini Connection Test:**
```bash
curl http://localhost:5000/api/upload/test
```

**Upload Test (with curl):**
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "drawing=@path/to/your/drawing.jpg"
```

### 6. Start Frontend (Optional)

In a new terminal:

```bash
npm run dev:frontend
```

Then open http://localhost:3000 in your browser.

## Testing with Sample Images

### Using the Frontend

1. Go to http://localhost:3000
2. Click "Choose File" and select an engineering drawing
3. Click "Upload & Analyze"
4. View the AI analysis results and cost estimate

### Using Postman or Thunder Client

1. Create a POST request to `http://localhost:5000/api/upload`
2. Set body type to `form-data`
3. Add key `drawing` with type `File`
4. Select your image file
5. Send request

### Using cURL

```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "drawing=@/path/to/your/engineering-drawing.jpg" \
  | jq '.'
```

## Expected Response Format

```json
{
  "success": true,
  "documentId": "DOC-1234567890",
  "filename": "drawing-1234567890.jpg",
  "analysis": {
    "specs": {
      "dimensions": {
        "length": 100,
        "width": 50,
        "thickness": 5,
        "unit": "mm"
      },
      "material": {
        "type": "Steel SS400",
        "grade": "SS400",
        "aiConfidence": 0.95
      },
      "quantity": 10,
      "surfaceFinish": "Polishing",
      "manufacturingProcess": ["Cutting", "Bending", "Welding"]
    },
    "confidence": 0.92
  },
  "costing": {
    "material": 5000,
    "labor": 15000,
    "overhead": 4000,
    "total": 24000,
    "confidence": 0.85,
    "reasoning": "Based on material type and dimensions..."
  }
}
```

## Troubleshooting

### API Key Issues

If you see "GEMINI_API_KEY is not set":
- Check that `backend/.env` exists and contains your API key
- Restart the backend server after changing `.env`

### Network Errors

If you see "fetch failed" or "ECONNREFUSED":
- Check your internet connection
- Verify the API key is valid
- Try a different Gemini model in `.env`: `GEMINI_MODEL=gemini-1.5-pro`

### Model Not Found

If you see "model not found" error:
- The default model is `gemini-1.5-flash`
- You can try other models:
  - `gemini-1.5-pro` (more powerful)
  - `gemini-2.0-flash-exp` (experimental)

Add to `backend/.env`:
```
GEMINI_MODEL=gemini-1.5-pro
```

### File Upload Issues

If uploads fail:
- Check file size is under 10MB
- Ensure file is an image format (JPG, PNG, WebP)
- Check backend logs in `backend/logs/combined.log`

## Testing Different Scenarios

### Test 1: Simple Rectangular Part

Upload a drawing of a simple rectangular metal plate with dimensions clearly marked.

### Test 2: Complex Part with Tolerances

Upload a drawing with multiple dimensions, tolerances, and surface finish specifications.

### Test 3: Different Materials

Test with drawings specifying different materials:
- Steel (SS400, SUS304)
- Aluminum (6061, 7075)
- Brass, Copper, etc.

### Test 4: High Quantity

Test with different quantities to see how cost estimation scales.

## Performance Testing

### Response Time

Expected response times:
- Image preprocessing: < 1 second
- Gemini analysis: 3-10 seconds
- Cost estimation: 2-5 seconds
- **Total: 5-15 seconds**

### Concurrent Uploads

Test multiple simultaneous uploads to verify server stability.

## Logs

Check logs for debugging:

```bash
# Backend logs
tail -f backend/logs/combined.log

# Error logs only
tail -f backend/logs/error.log
```

## Next Steps

After successful testing:

1. ✅ Gemini API integration working
2. ⏭️ Add MongoDB for data persistence
3. ⏭️ Add Redis + Bull for background processing
4. ⏭️ Implement real-time updates with Socket.io
5. ⏭️ Add user authentication
6. ⏭️ Build admin dashboard
7. ⏭️ Implement quote PDF generation

## Support

If you encounter any issues:
1. Check the logs in `backend/logs/`
2. Verify API key is correct
3. Test network connectivity
4. Review error messages carefully
