import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const src = 'C:\\Users\\WIND11\\.gemini\\antigravity-ide\\brain\\df5f654f-be3e-4c3d-8558-3fd0c126ff94\\media__1788534429882.png';
    const dest = path.join(process.cwd(), 'public', 'raw-logo.png');
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
