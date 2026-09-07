import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Check if we can select and update 'views' column in 'berita'
    const { data, error } = await supabase.from('berita').select('id, views').limit(1);
    if (error) {
      return NextResponse.json({ success: false, error: error.message });
    }
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
