import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data: existing } = await supabase.from('umkm').select('*');
    return NextResponse.json({ success: true, count: existing?.length || 0, data: existing });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
