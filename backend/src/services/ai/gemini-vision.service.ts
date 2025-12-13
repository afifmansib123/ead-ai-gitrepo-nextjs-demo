import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../../utils/logger';

interface DrawingSpecs {
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
    thickness?: number;
    diameter?: number;
    unit: 'mm' | 'cm' | 'inch' | 'm';
  };
  material: {
    type: string;
    grade?: string;
    specifications?: string;
    aiConfidence: number;
  };
  quantity: number;
  surfaceFinish?: string;
  tolerances?: string[];
  manufacturingProcess: string[];
}

interface GeminiAnalysisResult {
  specs: DrawingSpecs;
  confidence: number;
  rawResponse: any;
}

interface CostEstimate {
  material: number;
  labor: number;
  overhead: number;
  total: number;
  confidence: number;
  reasoning?: string;
}

class GeminiVisionService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);

    // Use model from env or default to gemini-1.5-flash (most stable)
    // Options: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash-exp
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.model = this.genAI.getGenerativeModel({ model: modelName });

    logger.info(`Gemini Vision service initialized with model: ${modelName}`);
  }

  async analyzeDrawing(imageBuffer: Buffer): Promise<GeminiAnalysisResult> {
    try {
      logger.info('Starting Gemini Vision analysis...');

      const prompt = `You are an expert manufacturing engineer analyzing technical drawings.

Analyze this engineering drawing image and extract the following information in JSON format:

{
  "dimensions": {
    "length": <number or null>,
    "width": <number or null>,
    "height": <number or null>,
    "thickness": <number or null>,
    "diameter": <number or null>,
    "unit": "mm" | "cm" | "inch" | "m"
  },
  "material": {
    "type": "<material name, e.g., 'Steel SS400', 'Aluminum 6061', 'SUS304'>",
    "grade": "<grade if specified>",
    "specifications": "<any additional specs>",
    "confidence": <0.0 to 1.0>
  },
  "quantity": <number>,
  "surfaceFinish": "<e.g., 'Polishing', 'Painting', 'Anodizing', or null>",
  "tolerances": ["<tolerance 1>", "<tolerance 2>"],
  "manufacturingProcess": ["<process 1>", "<process 2>"],
  "overallConfidence": <0.0 to 1.0>
}

Important:
- Extract EXACT dimensions from the drawing
- If a dimension is not visible, use null
- Identify material type from notes or material callouts
- List all manufacturing processes implied (cutting, bending, welding, etc.)
- Set confidence based on image clarity and completeness
- Return ONLY valid JSON, no markdown formatting`;

      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: 'image/jpeg',
        },
      };

      logger.info('Sending request to Gemini API...');
      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      logger.info('Received response from Gemini API');

      // Clean and parse JSON
      let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      // Handle potential markdown code blocks
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
      }

      logger.info('Parsing Gemini response...');
      const parsed = JSON.parse(jsonText);

      logger.info('Gemini Vision analysis completed successfully', {
        confidence: parsed.overallConfidence,
        material: parsed.material?.type,
        hasQuantity: !!parsed.quantity,
      });

      return {
        specs: {
          dimensions: parsed.dimensions,
          material: parsed.material,
          quantity: parsed.quantity || 1,
          surfaceFinish: parsed.surfaceFinish,
          tolerances: parsed.tolerances || [],
          manufacturingProcess: parsed.manufacturingProcess || [],
        },
        confidence: parsed.overallConfidence || 0.5,
        rawResponse: parsed,
      };
    } catch (error) {
      logger.error('Gemini Vision analysis error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw new Error(`Failed to analyze drawing with Gemini: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async estimateCost(
    specs: DrawingSpecs,
    historicalData: any[] = []
  ): Promise<CostEstimate> {
    try {
      logger.info('Starting Gemini cost estimation...', {
        material: specs.material.type,
        quantity: specs.quantity,
      });

      const prompt = `You are a manufacturing cost estimation expert.

Given the following specifications and historical data, estimate the manufacturing cost:

CURRENT PROJECT:
${JSON.stringify(specs, null, 2)}

SIMILAR HISTORICAL PROJECTS:
${historicalData.length > 0 ? JSON.stringify(historicalData.slice(0, 5), null, 2) : 'No historical data available'}

Provide a detailed cost estimate in JSON format:
{
  "material": {
    "unitPrice": <price per unit in JPY>,
    "totalCost": <total material cost>,
    "reasoning": "<explanation>"
  },
  "labor": {
    "estimatedHours": <hours>,
    "hourlyRate": <JPY per hour>,
    "totalCost": <total labor cost>,
    "reasoning": "<explanation>"
  },
  "overhead": {
    "percentage": <overhead % of material+labor>,
    "amount": <overhead cost>
  },
  "total": {
    "cost": <total manufacturing cost>,
    "recommendedPrice": <suggested selling price>,
    "margin": <profit margin %>
  },
  "confidence": <0.0 to 1.0>,
  "reasoning": "<overall explanation>",
  "riskFactors": ["<risk 1>", "<risk 2>"]
}

Return ONLY valid JSON.`;

      logger.info('Sending cost estimation request to Gemini API...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean and parse JSON
      let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
      }

      logger.info('Parsing cost estimation response...');
      const cost = JSON.parse(jsonText);

      logger.info('Gemini cost estimation completed successfully', {
        total: cost.total.cost,
        confidence: cost.confidence,
      });

      return {
        material: cost.material.totalCost,
        labor: cost.labor.totalCost,
        overhead: cost.overhead.amount,
        total: cost.total.cost,
        confidence: cost.confidence,
        reasoning: cost.reasoning,
      };
    } catch (error) {
      logger.error('Gemini cost estimation error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw new Error(`Failed to estimate cost with Gemini: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      logger.info('Testing Gemini API connection...');
      const result = await this.model.generateContent('Hello, please respond with "OK"');
      const response = await result.response;
      const text = response.text();
      logger.info('Gemini API connection test successful', { response: text });
      return true;
    } catch (error) {
      logger.error('Gemini API connection test failed:', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }
}

export default new GeminiVisionService();
