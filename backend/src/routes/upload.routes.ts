import express, { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import geminiVision from '../services/ai/gemini-vision.service';
import logger from '../utils/logger';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'));
    }
  },
});

// Upload and analyze drawing endpoint
router.post('/', upload.single('drawing'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    logger.info('File upload received', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    // Preprocess image with sharp
    logger.info('Preprocessing image...');
    const processedImage = await sharp(req.file.buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    logger.info('Image preprocessed successfully', {
      originalSize: req.file.size,
      processedSize: processedImage.length,
    });

    // Save the original file
    const uploadsDir = path.join(__dirname, '../../uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const timestamp = Date.now();
    const filename = `drawing-${timestamp}.jpg`;
    const filepath = path.join(uploadsDir, filename);

    await fs.writeFile(filepath, processedImage);
    logger.info('File saved', { filepath });

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

    // Return results
    res.json({
      success: true,
      documentId: `DOC-${timestamp}`,
      filename: filename,
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

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload processing failed',
    });
  }
});

// Simple test endpoint
router.get('/test', async (req: Request, res: Response) => {
  try {
    const isConnected = await geminiVision.testConnection();
    res.json({
      success: true,
      geminiConnected: isConnected,
      message: 'Gemini API is ' + (isConnected ? 'connected' : 'not connected'),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed',
    });
  }
});

export default router;
