export interface DrawingSpecs {
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

export interface CostBreakdown {
  material: {
    unitPrice: number;
    totalCost: number;
    source: 'database' | 'supplier' | 'ai_estimate';
    priceDate: Date;
  };
  labor: {
    estimatedHours: number;
    hourlyRate: number;
    totalCost: number;
  };
  overhead: {
    percentage: number;
    amount: number;
  };
  total: {
    cost: number;
    margin: number;
    price: number;
    aiConfidence: number;
  };
}

export interface ProcessingJob {
  id: string;
  documentId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  currentStep?: string;
  progress: number;
  steps: {
    preprocessing?: JobStep;
    ocr?: JobStep;
    vision?: JobStep;
    costing?: JobStep;
    generation?: JobStep;
  };
  result?: {
    drawing: DrawingSpecs;
    costing: CostBreakdown;
    quoteUrl?: string;
  };
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobStep {
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  result?: any;
  error?: string;
}

export type QuotationStatus =
  | 'pending'
  | 'ai_processed'
  | 'under_review'
  | 'approved'
  | 'sent'
  | 'accepted'
  | 'rejected';

export interface Quotation {
  _id: string;
  quotationNumber: string;
  source: {
    type: 'fax' | 'email' | 'upload';
    originalFileUrl: string;
    processedFileUrl?: string;
    receivedAt: Date;
  };
  customer?: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  drawing?: DrawingSpecs;
  costing?: CostBreakdown;
  status: QuotationStatus;
  quote?: {
    generatedFileUrl: string;
    sentAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GeminiAnalysisResult {
  specs: DrawingSpecs;
  confidence: number;
  rawResponse: any;
}

export interface CostEstimate {
  material: number;
  labor: number;
  overhead: number;
  total: number;
  confidence: number;
  reasoning?: string;
}
