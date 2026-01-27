import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Verde Manager - Austin FC Analytics & Roster Tools';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {/* Tree Icon */}
        <svg width="200" height="200" viewBox="0 0 32 32">
          <g fill="#00B140">
            {/* Tree crown */}
            <path d="M16 6 L22 14 L10 14 Z"/>
            <path d="M16 11 L24 20 L8 20 Z"/>
            <path d="M16 16 L26 26 L6 26 Z"/>
            {/* Tree trunk */}
            <rect x="14" y="24" width="4" height="6" rx="0.5"/>
          </g>
        </svg>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#fff',
            marginTop: 40,
            letterSpacing: '0.05em',
          }}
        >
          VERDE MANAGER
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: '#00B140',
            marginTop: 16,
          }}
        >
          Austin FC Analytics & Roster Tools
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
