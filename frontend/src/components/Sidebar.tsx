'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Upload Drawing (図面アップロード)', icon: '📤' },
    { href: '/invoices', label: 'Past Invoices (過去の見積)', icon: '📋' },
    { href: '/training', label: 'Training (トレーニング)', icon: '🎓' },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        style={{
          width: isOpen ? '280px' : '60px',
          height: '100vh',
          backgroundColor: '#1a1a2e',
          color: 'white',
          position: 'fixed',
          left: 0,
          top: 0,
          transition: 'width 0.3s ease',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {isOpen && (
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                EAD AI
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', opacity: 0.7 }}>
                製造見積システム
              </p>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
            aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Account Info */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {isOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#0070f3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                👤
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Tanaka-san (田中さん)
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                  Admin (管理者)
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#0070f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                margin: '0 auto',
              }}
            >
              👤
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: isOpen ? '1rem 1.5rem' : '1rem 0',
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  textDecoration: 'none',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  backgroundColor: isActive ? 'rgba(0,112,243,0.2)' : 'transparent',
                  borderLeft: isActive ? '4px solid #0070f3' : '4px solid transparent',
                  transition: 'all 0.2s',
                  fontSize: '0.95rem',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                  }
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div
            style={{
              padding: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.75rem',
              opacity: 0.5,
              textAlign: 'center',
            }}
          >
            © 2025 EAD AI MVP
          </div>
        )}
      </aside>

      {/* Spacer for content */}
      <div style={{ width: isOpen ? '280px' : '60px', flexShrink: 0 }} />
    </>
  );
}
