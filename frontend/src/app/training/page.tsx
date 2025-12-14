'use client';

import { useState } from 'react';

export default function TrainingPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          alert('トレーニング完了！ (Training completed!)');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const dummyMetrics = {
    currentAccuracy: 0.87,
    targetAccuracy: 0.95,
    trainingDatasets: 1247,
    lastTrained: '2025-12-10',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2.5rem',
            color: '#1a1a2e',
          }}
        >
          モデルトレーニング (Model Training)
        </h1>
        <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>
          AIモデルの精度を向上させるためのトレーニング (Train the AI model to improve accuracy)
        </p>
      </div>

      {/* Warning Banner */}
      <div
        style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '12px',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ fontSize: '2rem' }}>⚠️</div>
        <div>
          <strong>デモ機能 (Demo Feature)</strong>
          <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
            これはMVPのダミー機能です。実際のトレーニングは行われません。
            (This is a dummy feature for the MVP. No actual training will occur.)
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Column - Current Metrics */}
        <div>
          <h2
            style={{
              margin: '0 0 1.5rem 0',
              fontSize: '1.5rem',
              color: '#1a1a2e',
            }}
          >
            現在のメトリクス (Current Metrics)
          </h2>

          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: '2rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#666' }}>精度 (Accuracy)</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#0070f3' }}>
                  {(dummyMetrics.currentAccuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ width: '100%', height: '12px', backgroundColor: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${dummyMetrics.currentAccuracy * 100}%`,
                    height: '100%',
                    backgroundColor: '#0070f3',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#666' }}>目標精度 (Target Accuracy)</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#4caf50' }}>
                  {(dummyMetrics.targetAccuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ width: '100%', height: '12px', backgroundColor: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${dummyMetrics.targetAccuracy * 100}%`,
                    height: '100%',
                    backgroundColor: '#4caf50',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                  データセット (Datasets)
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a2e' }}>
                  {dummyMetrics.trainingDatasets.toLocaleString()}
                </div>
              </div>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                  最終トレーニング (Last Trained)
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1a1a2e' }}>
                  {dummyMetrics.lastTrained}
                </div>
              </div>
            </div>
          </div>

          {/* Training History */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: '2rem',
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
              トレーニング履歴 (Training History)
            </h3>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              {['2025-12-10: 精度 87% 達成', '2025-12-05: 精度 84% 達成', '2025-11-30: 精度 81% 達成'].map(
                (item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.75rem',
                      borderBottom: idx < 2 ? '1px solid #f0f0f0' : 'none',
                    }}
                  >
                    ✓ {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Training Interface */}
        <div>
          <h2
            style={{
              margin: '0 0 1.5rem 0',
              fontSize: '1.5rem',
              color: '#1a1a2e',
            }}
          >
            新しいトレーニング (New Training)
          </h2>

          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: '2rem',
            }}
          >
            {/* File Upload */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: '#1a1a2e',
                }}
              >
                トレーニングデータをアップロード (Upload Training Data)
              </label>
              <div
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ marginBottom: '1rem' }}
                  disabled={isTraining}
                />
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                  複数の図面画像をアップロードできます (You can upload multiple drawing images)
                </p>
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>
                  アップロード済みファイル (Uploaded Files): {uploadedFiles.length}
                </h3>
                <div
                  style={{
                    maxHeight: '150px',
                    overflowY: 'auto',
                    padding: '1rem',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                  }}
                >
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.5rem',
                        borderBottom: idx < uploadedFiles.length - 1 ? '1px solid #e0e0e0' : 'none',
                        fontSize: '0.9rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>📄 {file.name}</span>
                      <button
                        onClick={() => {
                          setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx));
                        }}
                        disabled={isTraining}
                        style={{
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: isTraining ? 'not-allowed' : 'pointer',
                        }}
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Training Progress */}
            {isTraining && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>トレーニング中... (Training...)</span>
                  <span style={{ fontWeight: 'bold', color: '#0070f3' }}>{trainingProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${trainingProgress}%`,
                      height: '100%',
                      backgroundColor: '#0070f3',
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Start Training Button */}
            <button
              onClick={handleStartTraining}
              disabled={uploadedFiles.length === 0 || isTraining}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                backgroundColor:
                  uploadedFiles.length === 0 || isTraining ? '#ccc' : '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: uploadedFiles.length === 0 || isTraining ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (uploadedFiles.length > 0 && !isTraining) {
                  e.currentTarget.style.backgroundColor = '#0051bb';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,112,243,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (uploadedFiles.length > 0 && !isTraining) {
                  e.currentTarget.style.backgroundColor = '#0070f3';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isTraining ? '🔄 トレーニング中... (Training...)' : '🚀 トレーニング開始 (Start Training)'}
            </button>
          </div>

          {/* Info Box */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#e3f2fd',
              border: '2px solid #0070f3',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#0051bb' }}>
              💡 ヒント (Tips)
            </div>
            <ul style={{ margin: '0.5rem 0 0 1.5rem', fontSize: '0.9rem', color: '#1a1a2e' }}>
              <li>高品質な図面画像を使用してください</li>
              <li>様々な種類の図面を含めることで精度が向上します</li>
              <li>トレーニングには5〜10分かかる場合があります</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
