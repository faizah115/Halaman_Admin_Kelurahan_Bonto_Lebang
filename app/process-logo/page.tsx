'use client';

import { useEffect, useState, useRef } from 'react';

export default function ProcessLogoPage() {
  const [status, setStatus] = useState('Initializing background removal...');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function processImage() {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = '/raw-logo.png?v=' + Date.now();

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = img.naturalWidth;
        const height = img.naturalHeight;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // BFS flood-fill from outer boundaries stopping strictly at the red pentagon edge
        const visited = new Uint8Array(width * height);
        const queue: number[] = [];

        // Add outer edge pixels
        for (let x = 0; x < width; x++) {
          queue.push(x, 0);
          queue.push(x, height - 1);
        }
        for (let y = 0; y < height; y++) {
          queue.push(0, y);
          queue.push(width - 1, y);
        }

        const isRedPentagonBorder = (r: number, g: number, b: number) => {
          // Red body of pentagon: high red, low green and blue
          return (r - g >= 45 && r - b >= 45 && r > 85);
        };

        let head = 0;
        while (head < queue.length) {
          const x = queue[head++];
          const y = queue[head++];
          if (x < 0 || x >= width || y < 0 || y >= height) continue;

          const idx = y * width + x;
          if (visited[idx]) continue;
          visited[idx] = 1;

          const p = idx * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];

          // If NOT the red pentagon body edge, make transparent & continue flooding
          if (!isRedPentagonBorder(r, g, b)) {
            data[p + 3] = 0; // Transparent

            if (x > 0) queue.push(x - 1, y);
            if (x < width - 1) queue.push(x + 1, y);
            if (y > 0) queue.push(x, y - 1);
            if (y < height - 1) queue.push(x, y + 1);
          }
        }

        ctx.putImageData(imgData, 0, 0);

        const dataUrl = canvas.toDataURL('image/png');

        const res = await fetch('/api/save-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl }),
        });

        const json = await res.json();
        if (json.success) {
          setStatus('✅ Transparent logo created successfully at public/logo-kelurahan.png');
        } else {
          setStatus('❌ Error: ' + json.error);
        }
      } catch (err: any) {
        setStatus('❌ Failed: ' + err.message);
      }
    }

    processImage();
  }, []);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-xl font-bold mb-4 font-sans">Background Removal Processing</h1>
      <p className="mb-4">{status}</p>
      <canvas ref={canvasRef} className="border border-gray-300 max-w-sm bg-gray-100" />
    </div>
  );
}
