'use client';

interface InvoiceProps {
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
  onSendInvoice?: () => void;
  onNewAnalysis?: () => void;
}

export default function Invoice({
  documentId,
  filename,
  analysis,
  costing,
  onSendInvoice,
  onNewAnalysis,
}: InvoiceProps) {
  const currentDate = new Date().toLocaleDateString('ja-JP');

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Invoice Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0070f3 0%, #0051bb 100%)',
          color: 'white',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
              見積書 (Invoice)
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
              {currentDate}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              文書番号 (Document ID)
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
              {documentId}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Body */}
      <div style={{ padding: '2rem' }}>
        {/* Company Info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem',
            paddingBottom: '2rem',
            borderBottom: '2px solid #f0f0f0',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.85rem' }}>
              請求元 (From)
            </h3>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>EAD AI Manufacturing</div>
            <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Tokyo, Japan
            </div>
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.85rem' }}>
              請求先 (To)
            </h3>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Tanaka-san (田中さん)</div>
            <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Customer Account
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              margin: '0 0 1rem 0',
              fontSize: '1.3rem',
              color: '#1a1a2e',
              borderBottom: '2px solid #0070f3',
              paddingBottom: '0.5rem',
            }}
          >
            仕様 (Specifications)
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                材料 (Material)
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                {analysis.specs.material.type}
                {analysis.specs.material.grade && ` (${analysis.specs.material.grade})`}
              </div>
            </div>
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                数量 (Quantity)
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                {analysis.specs.quantity} units
              </div>
            </div>
            {analysis.specs.surfaceFinish && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                  表面仕上げ (Surface Finish)
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {analysis.specs.surfaceFinish}
                </div>
              </div>
            )}
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                AI信頼度 (AI Confidence)
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#0070f3' }}>
                {(analysis.confidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
              製造プロセス (Manufacturing Processes)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {analysis.specs.manufacturingProcess.map((process, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#e8f4ff',
                    color: '#0070f3',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  {process}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              margin: '0 0 1rem 0',
              fontSize: '1.3rem',
              color: '#1a1a2e',
              borderBottom: '2px solid #0070f3',
              paddingBottom: '0.5rem',
            }}
          >
            見積詳細 (Cost Breakdown)
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    borderBottom: '2px solid #e0e0e0',
                    fontSize: '0.9rem',
                    color: '#666',
                  }}
                >
                  項目 (Item)
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'right',
                    borderBottom: '2px solid #e0e0e0',
                    fontSize: '0.9rem',
                    color: '#666',
                  }}
                >
                  金額 (Amount)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  材料費 (Material Cost)
                </td>
                <td
                  style={{
                    padding: '1rem',
                    textAlign: 'right',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  ¥{costing.material.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  人件費 (Labor Cost)
                </td>
                <td
                  style={{
                    padding: '1rem',
                    textAlign: 'right',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  ¥{costing.labor.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  諸経費 (Overhead)
                </td>
                <td
                  style={{
                    padding: '1rem',
                    textAlign: 'right',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  ¥{costing.overhead.toLocaleString()}
                </td>
              </tr>
              <tr style={{ backgroundColor: '#f0f8ff' }}>
                <td
                  style={{
                    padding: '1.5rem 1rem',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: '#1a1a2e',
                  }}
                >
                  合計 (Total)
                </td>
                <td
                  style={{
                    padding: '1.5rem 1rem',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    color: '#0070f3',
                  }}
                >
                  ¥{costing.total.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {costing.reasoning && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#f9f9f9',
                borderLeft: '4px solid #0070f3',
                borderRadius: '4px',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                AI推論 (AI Reasoning)
              </div>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{costing.reasoning}</div>
            </div>
          )}

          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              fontSize: '0.85rem',
            }}
          >
            <strong>信頼度 (Confidence):</strong> {(costing.confidence * 100).toFixed(1)}% - この見積は
            AI によって生成されました
          </div>
        </div>

        {/* Drawing Info */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            marginBottom: '2rem',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
            図面ファイル (Drawing File)
          </div>
          <div style={{ fontWeight: '500' }}>{filename}</div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={onSendInvoice}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0051bb';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,112,243,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0070f3';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            📧 見積を送信 (Send Invoice)
          </button>
          <button
            onClick={onNewAnalysis}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5a6268';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6c757d';
            }}
          >
            🔄 新しい分析 (New Analysis)
          </button>
        </div>
      </div>
    </div>
  );
}
