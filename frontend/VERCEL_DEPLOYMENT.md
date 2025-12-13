# Deploying to Vercel

This Next.js application is ready to deploy to Vercel with zero configuration.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A Gemini API key from Google AI Studio (https://makersuite.google.com/app/apikey)

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Run deployment:
   ```bash
   vercel
   ```

4. Follow the prompts to link your project

5. Set environment variables:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Then paste your Gemini API key when prompted.

6. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub

2. Go to https://vercel.com/new

3. Import your GitHub repository

4. Set the following configuration:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add environment variables:
   - Click "Environment Variables"
   - Add: `GEMINI_API_KEY` with your API key value
   - Add: `NODE_ENV` with value `production`

6. Click "Deploy"

## Environment Variables

Required environment variables for production:

- `GEMINI_API_KEY`: Your Google Gemini API key
- `NODE_ENV`: Set to `production`

## Post-Deployment

After deployment, your application will be available at:
- `https://your-project-name.vercel.app`

Test the API endpoints:
- Health check: `https://your-project-name.vercel.app/api/health`
- Upload test: `https://your-project-name.vercel.app/api/upload/test`

## Local Development

To run the application locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Add your Gemini API key to `.env`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Features

- **Serverless Architecture**: All backend logic runs as Next.js API routes
- **Zero Configuration**: Vercel automatically detects and deploys Next.js apps
- **Auto-scaling**: Serverless functions scale automatically
- **Global CDN**: Static assets served from edge locations worldwide
- **HTTPS**: Automatic SSL certificates

## Troubleshooting

### Build Failures

If the build fails, check:
1. All dependencies are listed in `package.json`
2. Environment variables are set correctly
3. No hardcoded localhost URLs in the code

### API Errors

If API routes return errors:
1. Verify `GEMINI_API_KEY` is set in Vercel dashboard
2. Check the Vercel function logs for detailed error messages
3. Ensure your Gemini API key has sufficient quota

### File Upload Issues

Note: Vercel's serverless functions have a 4.5MB payload limit for the Hobby plan.
If you need to handle larger files, consider:
- Upgrading to Vercel Pro
- Using client-side image compression before upload
- Implementing direct upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
