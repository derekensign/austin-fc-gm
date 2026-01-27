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
        {/* Oak Tree Icon */}
        <svg width="200" height="200" viewBox="0 0 32 32">
          <g fill="#00B140">
            {/* Oak crown - multiple rounded lobes */}
            <path d="M16 4 C14 4 12 5 11 7 C10 6 8 6 7 8 C6 8 5 9 5 11 C4 12 4 14 5 15 C4 16 4 18 6 19 C6 20 7 21 8 21 C8 22 9 23 11 23 C12 24 14 24 16 23 C18 24 20 24 21 23 C23 23 24 22 24 21 C25 21 26 20 26 19 C28 18 28 16 27 15 C28 14 28 12 27 11 C27 9 26 8 25 8 C24 6 22 6 21 7 C20 5 18 4 16 4 Z"/>
            {/* Oak trunk */}
            <path d="M14 22 C14 22 13 23 13 24 L13 30 L19 30 L19 24 C19 23 18 22 18 22 L14 22 Z"/>
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
