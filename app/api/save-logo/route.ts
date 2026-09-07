import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { dataUrl } = await req.json();
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
    const filePath = path.join(process.cwd(), 'public', 'logo-kelurahan.png');
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    return NextResponse.json({ success: true, path: filePath });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
