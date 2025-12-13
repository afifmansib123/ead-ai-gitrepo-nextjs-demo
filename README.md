# Manufacturing Quotation AI - MVP

AI-powered system for processing engineering drawings and generating cost quotations.

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: Next.js 14 + TypeScript
- **AI**: Google Gemini 2.0 Flash
- **Database**: MongoDB (planned)
- **Queue**: Bull + Redis (planned)

## Project Structure

```
quotation-ai-mvp/
├── backend/          # Express API server
├── frontend/         # Next.js application
└── shared/           # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env and add your API keys
```

### Development

```bash
# Start both backend and frontend
npm run dev

# Or run separately
npm run dev:backend
npm run dev:frontend
```

## Features (MVP)

- ✅ Upload engineering drawings (images)
- ✅ AI analysis with Gemini Vision API
- ✅ Extract specifications (dimensions, materials, processes)
- ✅ Cost estimation
- ⏳ Real-time processing status
- ⏳ Quote generation

## API Endpoints

- `POST /api/upload` - Upload drawing for processing
- `GET /api/quotations/:id` - Get quotation details
- `GET /health` - Health check

## License

Private - All rights reserved
