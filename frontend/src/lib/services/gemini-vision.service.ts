import { GoogleGenAI, Type } from '@google/genai';
import logger from '../utils/logger';

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

// Initialize with API key from environment
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({ apiKey });
};

export async function analyzeDrawing(imageBuffer: Buffer): Promise<GeminiAnalysisResult> {
  try {
    logger.info('Starting Gemini Vision analysis...');

    const ai = getAI();

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
- Return ONLY valid JSON`;

    const base64Data = imageBuffer.toString('base64');

    logger.info('Sending request to Gemini API...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dimensions: {
              type: Type.OBJECT,
              properties: {
                length: { type: Type.NUMBER },
                width: { type: Type.NUMBER },
                height: { type: Type.NUMBER },
                thickness: { type: Type.NUMBER },
                diameter: { type: Type.NUMBER },
                unit: { type: Type.STRING },
              },
            },
            material: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                grade: { type: Type.STRING },
                specifications: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
              },
            },
            quantity: { type: Type.INTEGER },
            surfaceFinish: { type: Type.STRING },
            tolerances: { type: Type.ARRAY, items: { type: Type.STRING } },
            manufacturingProcess: { type: Type.ARRAY, items: { type: Type.STRING } },
            overallConfidence: { type: Type.NUMBER },
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error('No response from Gemini API');
    }
    const parsed = JSON.parse(jsonText);

    logger.info('Gemini Vision analysis completed successfully', {
      confidence: parsed.overallConfidence,
      material: parsed.material?.type,
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
    throw new Error(
      `Failed to analyze drawing with Gemini: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function estimateCost(
  specs: DrawingSpecs,
  historicalData: any[] = []
): Promise<CostEstimate> {
  try {
    logger.info('Starting Gemini cost estimation...');

    const ai = getAI();

    const prompt = `You are a manufacturing cost estimation expert.

Given the following specifications, estimate the manufacturing cost:

${JSON.stringify(specs, null, 2)}

Provide a detailed cost estimate in JSON format:
{
  "material": {
    "totalCost": <total material cost in JPY>
  },
  "labor": {
    "totalCost": <total labor cost in JPY>
  },
  "overhead": {
    "amount": <overhead cost in JPY>
  },
  "total": {
    "cost": <total manufacturing cost in JPY>
  },
  "confidence": <0.0 to 1.0>,
  "reasoning": "<explanation>"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            material: {
              type: Type.OBJECT,
              properties: {
                totalCost: { type: Type.NUMBER },
              },
            },
            labor: {
              type: Type.OBJECT,
              properties: {
                totalCost: { type: Type.NUMBER },
              },
            },
            overhead: {
              type: Type.OBJECT,
              properties: {
                amount: { type: Type.NUMBER },
              },
            },
            total: {
              type: Type.OBJECT,
              properties: {
                cost: { type: Type.NUMBER },
              },
            },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
          },
        },
      },
    });

    const costText = response.text;
    if (!costText) {
      throw new Error('No response from Gemini API');
    }
    const cost = JSON.parse(costText);

    logger.info('Gemini cost estimation completed', {
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
    });
    throw new Error(
      `Failed to estimate cost with Gemini: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    logger.info('Testing Gemini API connection...');
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [{ text: 'Say "OK"' }],
      },
    });
    const text = response.text || 'OK';
    logger.info('Gemini API connection test successful', { response: text });
    return true;
  } catch (error) {
    logger.error('Gemini API connection test failed:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
