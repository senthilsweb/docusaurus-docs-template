import React, { type ReactElement } from 'react';

interface ReleaseHeroProps {
  version: string;
  date: string;
  tagline: string;
  gradient?: string;
}

export default function ReleaseHero({ 
  version, 
  date, 
  tagline,
  gradient = 'linear-gradient(135deg, #4A2C5A 0%, #E94560 100%)'
}: ReleaseHeroProps): ReactElement {
  return (
    <div
      style={{
        background: gradient,
        borderRadius: '12px',
        padding: '32px 24px',
        marginBottom: '24px',
        marginTop: '16px',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(45, 27, 61, 0.15)',
      }}
    >
      {/* Decorative circles - Slack style (smaller) */}
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.06)',
        }}
      />
      
      {/* Version badge */}
      <div
        style={{
          display: 'inline-block',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '4px 12px',
          marginBottom: '12px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          textTransform: 'uppercase',
        }}
      >
        Release
      </div>
      
      {/* Version number */}
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          margin: '0 0 6px 0',
          letterSpacing: '-0.5px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
        }}
      >
        v{version}
      </h1>
      
      {/* Date */}
      <p
        style={{
          fontSize: '0.875rem',
          opacity: 0.9,
          margin: '0 0 10px 0',
          fontWeight: 400,
        }}
      >
        {date}
      </p>
      
      {/* Tagline */}
      <p
        style={{
          fontSize: '1rem',
          fontWeight: 500,
          margin: 0,
          opacity: 0.95,
          maxWidth: '400px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {tagline}
      </p>
      
      {/* Decorative dots - Slack style (smaller) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '16px',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F6C541' }} />
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF8C42' }} />
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E94560' }} />
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B794D4' }} />
      </div>
      
      {/* Back to Blog link */}
      <a
        href="/blog"
        style={{
          display: 'inline-block',
          marginTop: '16px',
          color: 'white',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 500,
          opacity: 0.9,
          padding: '6px 14px',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.15)',
          transition: 'background 0.2s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
      >
        ← Back to Blog
      </a>
    </div>
  );
}
