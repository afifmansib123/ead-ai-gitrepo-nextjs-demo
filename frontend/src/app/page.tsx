'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Invoice from '@/components/Invoice';
import LoadingSpinner from '@/components/LoadingSpinner';

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

type LoadingStage = 'uploading' | 'preprocessing' | 'analyzing' | 'costing';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>('uploading');
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
      setError('ファイルを選択してください (Please select a file first)');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStage('uploading');

    try {
      const formData = new FormData();
      formData.append('drawing', file);

      // Simulate stage progression
      setTimeout(() => setLoadingStage('preprocessing'), 1000);
      setTimeout(() => setLoadingStage('analyzing'), 3000);
      setTimeout(() => setLoadingStage('costing'), 8000);

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
      setError(
        err.response?.data?.error ||
          'アップロードに失敗しました。もう一度お試しください。(Upload failed. Please try again.)'
      );
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvoice = () => {
    alert('見積を送信しました！ (Invoice sent successfully!)');
  };

  const handleNewAnalysis = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2.5rem',
            color: '#1a1a2e',
          }}
        >
          図面分析 (Drawing Analysis)
        </h1>
        <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>
          工学図面をアップロードして、AIによる分析と見積を取得
          (Upload engineering drawings for AI analysis and quotation)
        </p>
      </div>

      {/* Upload Section - Only show when not loading and no result */}
      {!loading && !result && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #0070f3 0%, #0051bb 100%)',
              color: 'white',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📐</div>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>
              工学図面をアップロード (Upload Engineering Drawing)
            </h2>
          </div>

          <div style={{ padding: '2rem' }}>
            <div
              style={{
                border: '3px dashed #0070f3',
                borderRadius: '12px',
                padding: '3rem 2rem',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  fontSize: '1rem',
                }}
                id="file-input"
              />
              <label
                htmlFor="file-input"
                style={{
                  display: 'block',
                  fontSize: '1.1rem',
                  color: '#666',
                  marginTop: '1rem',
                }}
              >
                JPEG, PNG, WebP形式の画像ファイルを選択 (Select JPEG, PNG, or WebP image file)
              </label>
              {file && (
                <div
                  style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '2px solid #0070f3',
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0070f3' }}>
                    ✓ 選択済み (Selected)
                  </div>
                  <div style={{ color: '#666', marginTop: '0.5rem' }}>{file.name}</div>
                  <div style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              style={{
                width: '100%',
                marginTop: '2rem',
                padding: '1.25rem 2rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: !file || loading ? '#ccc' : '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: !file || loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (file && !loading) {
                  e.currentTarget.style.backgroundColor = '#0051bb';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,112,243,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (file && !loading) {
                  e.currentTarget.style.backgroundColor = '#0070f3';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? '分析中... (Analyzing...)' : '🚀 アップロード & 分析 (Upload & Analyze)'}
            </button>

            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f0f8ff',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#666',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#0070f3' }}>
                💡 ヒント (Tips):
              </div>
              <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
                <li>高解像度の画像を使用するとより正確な分析が可能です</li>
                <li>ファイルサイズは10MB以下にしてください</li>
                <li>分析には15〜30秒かかります</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#fee',
            border: '2px solid #fcc',
            borderRadius: '12px',
            color: '#c00',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '2rem' }}>⚠️</div>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
              エラー (Error)
            </div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && <LoadingSpinner stage={loadingStage} />}

      {/* Invoice Display */}
      {result && (
        <Invoice
          documentId={result.documentId}
          filename={result.filename}
          analysis={result.analysis}
          costing={result.costing}
          onSendInvoice={handleSendInvoice}
          onNewAnalysis={handleNewAnalysis}
        />
      )}
    </main>
  );
}
