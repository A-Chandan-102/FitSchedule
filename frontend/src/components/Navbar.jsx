import React, { useState } from 'react';

export default function Navbar({
  activeTab,
  setActiveTab,
  planCount,
  currentUser,
  onOpenAuth,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'planner', label: 'Workout Planner' },
    { id: 'my-workouts', label: 'My Workouts', count: planCount },
    { id: 'schedule', label: 'Weekly Schedule' },
    { id: 'exercises', label: 'Exercise Database' },
    { id: 'contact', label: 'Contact a Trainer' },
  ];

  // Add Trainer Portal tab if logged in as TRAINER
  if (currentUser && currentUser.role === 'TRAINER') {
    navItems.push({ id: 'trainer-portal', label: 'Trainer Portal', highlight: true });
  }

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-light)',
      padding: '0.85rem 0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Brand */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12" />
            </svg>
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Fit<span style={{ color: '#16a34a' }}>Schedule</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', gap: '0.35rem', alignItems: 'center' }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isHighlight = item.highlight;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? (isHighlight ? '#0369a1' : '#15803d') : (isHighlight ? '#0284c7' : '#475569'),
                  backgroundColor: isActive ? (isHighlight ? '#e0f2fe' : '#dcfce7') : 'transparent',
                  border: isActive ? `1px solid ${isHighlight ? '#bae6fd' : '#bbf7d0'}` : '1px solid transparent',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                {item.label}
                {item.count !== undefined && item.count > 0 && (
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '10px',
                    backgroundColor: isActive ? '#16a34a' : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#0f172a',
                    fontWeight: 700,
                  }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Auth Info / Login CTA */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="desktop-auth">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                  {currentUser.fullName}
                </div>
                <span className={`badge ${currentUser.role === 'TRAINER' ? 'badge-cyan' : 'badge-lime'}`} style={{ fontSize: '0.65rem' }}>
                  {currentUser.role === 'TRAINER' ? 'Certified Trainer' : 'Member'}
                </span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={onLogout}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={onOpenAuth}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Login / Sign Up
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            color: '#0f172a',
            backgroundColor: '#f1f5f9',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#15803d' : '#0f172a',
                  backgroundColor: isActive ? '#dcfce7' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="badge badge-lime">{item.count}</span>
                )}
              </button>
            );
          })}

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
            {currentUser ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{currentUser.fullName}</div>
                  <span className={`badge ${currentUser.role === 'TRAINER' ? 'badge-cyan' : 'badge-lime'}`}>
                    {currentUser.role}
                  </span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={onLogout}>
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                style={{ width: '100%' }}
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 960px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-hamburger-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}
