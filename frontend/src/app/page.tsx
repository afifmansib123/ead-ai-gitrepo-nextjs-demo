'use client';

import { useState } from 'react';
import axios from 'axios';

// Use relative URL for API routes (Next.js API routes)
const API_URL = '';

interface AnalysisResult {
  success: boolean;
  documentId: string;
  filename: string;
  analysis: {
    specs: {
      dimensions: any;
      material: {
        type: string;
        grade?: string;
        aiConfidence: number;
      };
      quantity: number;
      surfaceFinish?: string;
      manufacturingProcess: string[];
    };
    confidence: number;
  };
  costing: {
    material: number;
    labor: number;
    overhead: number;
    total: number;
    confidence: number;
    reasoning?: string;
  };
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('drawing', file);

      const { data } = await axios.post<AnalysisResult>(
        `${API_URL}/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        Manufacturing Quotation AI
      </h1>

      <div
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: '1rem' }}
        />
        {file && (
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Selected: {file.name}
          </p>
        )}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c00',
            marginBottom: '2rem',
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '2rem',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Analysis Results</h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3>Specifications</h3>
            <p>
              <strong>Material:</strong> {result.analysis.specs.material.type}{' '}
              {result.analysis.specs.material.grade &&
                `(${result.analysis.specs.material.grade})`}
            </p>
            <p>
              <strong>Quantity:</strong> {result.analysis.specs.quantity}
            </p>
            {result.analysis.specs.surfaceFinish && (
              <p>
                <strong>Surface Finish:</strong>{' '}
                {result.analysis.specs.surfaceFinish}
              </p>
            )}
            <p>
              <strong>Processes:</strong>{' '}
              {result.analysis.specs.manufacturingProcess.join(', ')}
            </p>
            <p>
              <strong>AI Confidence:</strong>{' '}
              {(result.analysis.confidence * 100).toFixed(1)}%
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3>Cost Estimate (JPY)</h3>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}
            >
              <tbody>
                <tr>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
                    Material
                  </td>
                  <td
                    style={{
                      padding: '0.5rem',
                      borderBottom: '1px solid #ddd',
                      textAlign: 'right',
                    }}
                  >
                    ¥{result.costing.material.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
                    Labor
                  </td>
                  <td
                    style={{
                      padding: '0.5rem',
                      borderBottom: '1px solid #ddd',
                      textAlign: 'right',
                    }}
                  >
                    ¥{result.costing.labor.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
                    Overhead
                  </td>
                  <td
                    style={{
                      padding: '0.5rem',
                      borderBottom: '1px solid #ddd',
                      textAlign: 'right',
                    }}
                  >
                    ¥{result.costing.overhead.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: '0.5rem',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    Total
                  </td>
                  <td
                    style={{
                      padding: '0.5rem',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    ¥{result.costing.total.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
            {result.costing.reasoning && (
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <strong>Reasoning:</strong> {result.costing.reasoning}
              </p>
            )}
          </div>

          <button
            onClick={() => {
              setFile(null);
              setResult(null);
            }}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Analyze Another Drawing
          </button>
        </div>
      )}
    </main>
  );
}
