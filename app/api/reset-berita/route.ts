import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Delete all records in Supabase 'berita' table
    const { error: deleteError } = await supabase
      .from('berita')
      .delete()
      .neq('id', 0); // deletes all rows

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ success: false, error: deleteError.message });
    }

    return NextResponse.json({ success: true, message: 'All berita successfully deleted from database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
