'use client';

import { useState } from 'react';

interface DummyInvoice {
  id: string;
  date: string;
  filename: string;
  material: string;
  total: number;
  status: 'sent' | 'draft' | 'accepted';
  confidence: number;
}

export default function InvoicesPage() {
  const [dummyInvoices] = useState<DummyInvoice[]>([
    {
      id: 'DOC-1734157425660',
      date: '2025-12-13',
      filename: 'drawing-001.jpg',
      material: 'Steel (鋼)',
      total: 69500,
      status: 'sent',
      confidence: 0.75,
    },
    {
      id: 'DOC-1734071025660',
      date: '2025-12-12',
      filename: 'drawing-002.jpg',
      material: 'Aluminum (アルミニウム)',
      total: 52300,
      status: 'accepted',
      confidence: 0.82,
    },
    {
      id: 'DOC-1733984625660',
      date: '2025-12-11',
      filename: 'drawing-003.jpg',
      material: 'Steel (鋼)',
      total: 78900,
      status: 'sent',
      confidence: 0.71,
    },
    {
      id: 'DOC-1733898225660',
      date: '2025-12-10',
      filename: 'drawing-004.jpg',
      material: 'Brass (真鍮)',
      total: 45600,
      status: 'draft',
      confidence: 0.68,
    },
    {
      id: 'DOC-1733811825660',
      date: '2025-12-09',
      filename: 'drawing-005.jpg',
      material: 'Steel (鋼)',
      total: 95200,
      status: 'accepted',
      confidence: 0.88,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'sent' | 'draft' | 'accepted'>('all');

  const filteredInvoices =
    filter === 'all' ? dummyInvoices : dummyInvoices.filter((inv) => inv.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return { bg: '#e3f2fd', color: '#1976d2', label: '送信済み (Sent)' };
      case 'draft':
        return { bg: '#fff3e0', color: '#f57c00', label: '下書き (Draft)' };
      case 'accepted':
        return { bg: '#e8f5e9', color: '#388e3c', label: '承認済み (Accepted)' };
      default:
        return { bg: '#f5f5f5', color: '#666', label: status };
    }
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
          過去の見積 (Past Invoices)
        </h1>
        <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>
          これまでに生成された見積書の一覧 (List of previously generated invoices)
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #e0e0e0',
          flexWrap: 'wrap',
        }}
      >
        {[
          { key: 'all', label: 'すべて (All)' },
          { key: 'sent', label: '送信済み (Sent)' },
          { key: 'draft', label: '下書き (Draft)' },
          { key: 'accepted', label: '承認済み (Accepted)' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: 'transparent',
              color: filter === tab.key ? '#0070f3' : '#666',
              border: 'none',
              borderBottom: filter === tab.key ? '3px solid #0070f3' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: filter === tab.key ? 'bold' : 'normal',
              transition: 'all 0.2s',
              marginBottom: '-2px',
            }}
            onMouseEnter={(e) => {
              if (filter !== tab.key) {
                e.currentTarget.style.color = '#0070f3';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== tab.key) {
                e.currentTarget.style.color = '#666';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '2px solid #e3f2fd',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            総見積数 (Total Invoices)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' }}>
            {dummyInvoices.length}
          </div>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '2px solid #e8f5e9',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            承認済み (Accepted)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#388e3c' }}>
            {dummyInvoices.filter((i) => i.status === 'accepted').length}
          </div>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '2px solid #fff3e0',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            総額 (Total Value)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f57c00' }}>
            ¥{dummyInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #e0e0e0' }}>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#666',
                }}
              >
                文書ID (Document ID)
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#666',
                }}
              >
                日付 (Date)
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#666',
                }}
              >
                ファイル名 (Filename)
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#666',
                }}
              >
                材料 (Material)
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'right',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#666',
                }}
              >
                金額 (Amount)
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#666',
                }}
              >
                ステータス (Status)
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: '#666',
                }}
              >
                操作 (Actions)
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => {
              const statusStyle = getStatusColor(invoice.status);
              return (
                <tr
                  key={invoice.id}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9f9f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {invoice.id}
                  </td>
                  <td style={{ padding: '1rem' }}>{invoice.date}</td>
                  <td style={{ padding: '1rem', color: '#666' }}>{invoice.filename}</td>
                  <td style={{ padding: '1rem' }}>{invoice.material}</td>
                  <td
                    style={{
                      padding: '1rem',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#1a1a2e',
                    }}
                  >
                    ¥{invoice.total.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                      }}
                    >
                      {statusStyle.label}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.85rem',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginRight: '0.5rem',
                      }}
                      onClick={() => alert(`Viewing invoice ${invoice.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#0051bb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#0070f3';
                      }}
                    >
                      表示 (View)
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredInvoices.length === 0 && (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              color: '#666',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <div style={{ fontSize: '1.2rem' }}>
              該当する見積がありません (No invoices found)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
