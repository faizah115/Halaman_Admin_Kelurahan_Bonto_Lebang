'use client';

// Nomor WA: 087890966692 → format internasional 6287890966692
const WA_NUMBER = '6287890966692';
const WA_MESSAGE = encodeURIComponent(
  'Halo, saya ingin menghubungi Kelurahan Bonto Lebang.'
);
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export default function WhatsAppFloatingButton() {
  return (
    <>
      {/* Floating WhatsApp Kontak Kelurahan Button */}
      <a
        href={WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Kontak Kelurahan via WhatsApp"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '24px',
          zIndex: 9999,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#25D366',
          color: '#ffffff',
          padding: '13px 22px',
          borderRadius: '50px',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(0,0,0,0.15)',
          fontFamily: "'Poppins', 'Inter', sans-serif",
          fontWeight: 700,
          fontSize: '15px',
          letterSpacing: '0.01em',
          textDecoration: 'none',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.transform = 'translateY(-3px) scale(1.04)';
          el.style.boxShadow = '0 8px 28px rgba(37, 211, 102, 0.55), 0 4px 12px rgba(0,0,0,0.18)';
          el.style.backgroundColor = '#20bb58';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.transform = 'translateY(0) scale(1)';
          el.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(0,0,0,0.15)';
          el.style.backgroundColor = '#25D366';
        }}
      >
        {/* Ikon WhatsApp (SVG resmi) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="22"
          height="22"
          fill="white"
          style={{ flexShrink: 0 }}
          aria-hidden="true"
        >
          <path d="M16.003 2C8.28 2 2 8.28 2 16.003c0 2.47.65 4.788 1.79 6.794L2 30l7.394-1.773A13.94 13.94 0 0 0 16.003 30C23.72 30 30 23.72 30 16.003 30 8.28 23.72 2 16.003 2zm0 25.6a11.54 11.54 0 0 1-5.89-1.61l-.422-.25-4.388 1.052 1.074-4.28-.275-.44A11.56 11.56 0 0 1 4.4 16.003c0-6.398 5.205-11.603 11.603-11.603 6.4 0 11.598 5.205 11.598 11.603 0 6.4-5.198 11.597-11.598 11.597zm6.362-8.686c-.35-.175-2.07-1.022-2.39-1.138-.32-.116-.554-.175-.787.175-.232.35-.9 1.138-1.104 1.371-.204.234-.408.263-.757.087-.35-.175-1.476-.544-2.81-1.735-1.038-.928-1.74-2.075-1.944-2.425-.204-.35-.022-.538.153-.713.158-.157.35-.41.524-.614.175-.204.233-.35.35-.583.116-.234.058-.438-.03-.614-.087-.175-.787-1.896-1.078-2.597-.284-.682-.572-.59-.787-.6l-.67-.012c-.233 0-.612.087-.932.438-.32.35-1.224 1.197-1.224 2.918 0 1.72 1.253 3.383 1.427 3.617.175.234 2.465 3.764 5.974 5.28.835.36 1.486.575 1.994.736.838.267 1.601.23 2.204.14.672-.1 2.07-.847 2.362-1.664.292-.817.292-1.518.204-1.664-.087-.146-.32-.233-.67-.408z" />
        </svg>

        {/* Label */}
        <span>Kontak Kelurahan</span>

        {/* Pulse ring animation */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50px',
            border: '2px solid #25D366',
            opacity: 0,
            animation: 'wa-pulse 2.4s ease-out infinite',
          }}
        />
      </a>

      {/* Keyframe animation */}
      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.22); opacity: 0;   }
          100% { transform: scale(1.22); opacity: 0;   }
        }
      `}</style>
    </>
  );
}
