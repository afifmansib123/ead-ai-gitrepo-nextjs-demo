'use client';

import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  stage?: 'uploading' | 'preprocessing' | 'analyzing' | 'costing';
}

export default function LoadingSpinner({ stage = 'uploading' }: LoadingSpinnerProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const stages = [
    {
      key: 'uploading',
      icon: '📤',
      label: 'ファイルアップロード中',
      labelEn: 'File upload received',
      color: '#0070f3',
    },
    {
      key: 'preprocessing',
      icon: '🔄',
      label: '画像前処理中',
      labelEn: 'Preprocessing image',
      color: '#0070f3',
    },
    {
      key: 'analyzing',
      icon: '🤖',
      label: 'AI分析中',
      labelEn: 'Starting AI analysis',
      color: '#0070f3',
    },
    {
      key: 'costing',
      icon: '💰',
      label: 'コスト計算中',
      labelEn: 'Starting cost estimation',
      color: '#0070f3',
    },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === stage);

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '3rem 2rem',
        textAlign: 'center',
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 2rem',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #0070f3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Current Stage */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {stages[currentStageIndex].icon}
        </div>
        <h2
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.5rem',
            color: '#1a1a2e',
          }}
        >
          {stages[currentStageIndex].label}
          {dots}
        </h2>
        <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>
          {stages[currentStageIndex].labelEn}
        </p>
      </div>

      {/* Progress Steps */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {stages.map((stageItem, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isPending = idx > currentStageIndex;

          return (
            <div
              key={stageItem.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted
                    ? '#4caf50'
                    : isCurrent
                    ? '#0070f3'
                    : '#e0e0e0',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s',
                  border: isCurrent ? '3px solid #0051bb' : 'none',
                }}
              >
                {isCompleted ? '✓' : stageItem.icon}
              </div>
              {idx < stages.length - 1 && (
                <div
                  style={{
                    width: '40px',
                    height: '2px',
                    backgroundColor: isCompleted ? '#4caf50' : '#e0e0e0',
                    transition: 'all 0.3s',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#666',
        }}
      >
        <p style={{ margin: 0 }}>
          ⏱️ 処理には通常15〜30秒かかります (Processing usually takes 15-30 seconds)
        </p>
      </div>

      {/* Log Messages */}
      <div
        style={{
          marginTop: '1.5rem',
          textAlign: 'left',
          maxHeight: '200px',
          overflowY: 'auto',
          padding: '1rem',
          backgroundColor: '#1a1a2e',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: '#00ff00',
        }}
      >
        {stage === 'uploading' && (
          <>
            <div>[INFO]: File upload received</div>
          </>
        )}
        {(stage === 'preprocessing' || currentStageIndex >= 1) && (
          <>
            <div>[INFO]: File upload received ✓</div>
            <div>[INFO]: Preprocessing image...</div>
            {stage !== 'preprocessing' && <div>[INFO]: Image preprocessed successfully ✓</div>}
          </>
        )}
        {(stage === 'analyzing' || currentStageIndex >= 2) && (
          <>
            <div>[INFO]: Starting AI analysis...</div>
            <div>[INFO]: Starting Gemini Vision analysis...</div>
            <div>[INFO]: Sending request to Gemini API...</div>
            {stage !== 'analyzing' && <div>[INFO]: Gemini Vision analysis completed ✓</div>}
          </>
        )}
        {(stage === 'costing' || currentStageIndex >= 3) && (
          <>
            <div>[INFO]: Starting cost estimation...</div>
            <div>[INFO]: Starting Gemini cost estimation...</div>
          </>
        )}
      </div>
    </div>
  );
}
