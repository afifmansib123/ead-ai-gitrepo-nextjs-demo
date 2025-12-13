import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import * as geminiVision from '@/lib/services/gemini-vision.service';
import logger from '@/lib/utils/logger';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET /api/upload/test - Test endpoint
export async function GET() {
  try {
    const isConnected = await geminiVision.testConnection();
    return NextResponse.json({
      success: true,
      geminiConnected: isConnected,
      message: 'Gemini API is ' + (isConnected ? 'connected' : 'not connected'),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Test failed',
      },
      { status: 500 }
    );
  }
}

// POST /api/upload - Upload and analyze drawing
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('drawing') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file uploaded',
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Only image files (JPEG, PNG, WebP) are allowed',
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: 'File size must be less than 10MB',
        },
        { status: 400 }
      );
    }

    logger.info('File upload received', {
      filename: file.name,
      size: file.size,
      mimetype: file.type,
    });

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Preprocess image with sharp
    logger.info('Preprocessing image...');
    const processedImage = await sharp(buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    logger.info('Image preprocessed successfully', {
      originalSize: buffer.length,
      processedSize: processedImage.length,
    });

    // Save the file (optional - for Vercel, you might want to use cloud storage instead)
    try {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      const timestamp = Date.now();
      const filename = `drawing-${timestamp}.jpg`;
      const filepath = path.join(uploadsDir, filename);

      await writeFile(filepath, processedImage);
      logger.info('File saved', { filepath });
    } catch (saveError) {
      // On Vercel, the filesystem is read-only except for /tmp
      // So we'll log the error but continue with the analysis
      logger.warn('File save failed (expected on Vercel)', {
        error: saveError instanceof Error ? saveError.message : String(saveError),
      });
    }

    // Analyze drawing with Gemini
    logger.info('Starting AI analysis...');
    const analysisResult = await geminiVision.analyzeDrawing(processedImage);

    logger.info('AI analysis completed', {
      confidence: analysisResult.confidence,
      material: analysisResult.specs.material.type,
    });

    // Estimate cost
    logger.info('Starting cost estimation...');
    const costEstimate = await geminiVision.estimateCost(analysisResult.specs);

    logger.info('Cost estimation completed', {
      total: costEstimate.total,
      confidence: costEstimate.confidence,
    });

    const timestamp = Date.now();

    // Return results
    return NextResponse.json({
      success: true,
      documentId: `DOC-${timestamp}`,
      filename: `drawing-${timestamp}.jpg`,
      analysis: {
        specs: analysisResult.specs,
        confidence: analysisResult.confidence,
      },
      costing: {
        material: costEstimate.material,
        labor: costEstimate.labor,
        overhead: costEstimate.overhead,
        total: costEstimate.total,
        confidence: costEstimate.confidence,
        reasoning: costEstimate.reasoning,
      },
      message: 'Drawing analyzed successfully',
    });
  } catch (error) {
    logger.error('Upload processing error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Upload processing failed',
      },
      { status: 500 }
    );
  }
}
