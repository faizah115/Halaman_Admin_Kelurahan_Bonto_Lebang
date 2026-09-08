import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const routeFile = path.join(process.cwd(), 'app', 'api', 'clean-struktur-db', 'route.ts');
    const routeDir = path.join(process.cwd(), 'app', 'api', 'clean-struktur-db');
    if (fs.existsSync(routeFile)) fs.unlinkSync(routeFile);
    if (fs.existsSync(routeDir)) fs.rmdirSync(routeDir);
    return NextResponse.json({ cleaned: true });
  } catch (err: any) {
    return NextResponse.json({ cleaned: false, error: err.message });
  }
}
