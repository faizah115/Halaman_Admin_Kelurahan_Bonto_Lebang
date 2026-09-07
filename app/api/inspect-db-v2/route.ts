import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  const log: string[] = [];

  log.push('--- Discovering Potensi Table Name ---');
  const potTables = ['potensi', 'potensi_desa', 'potensi_kelurahan', 'potensi_unggulan'];
  let validPotTable: string | null = null;
  let validPotSchema: string[] = [];

  for (const tbl of potTables) {
    const { data, error } = await supabase.from(tbl).select('*').limit(1);
    if (error) {
      log.push(`Table '${tbl}': FAIL -> ${error.message}`);
    } else {
      validPotTable = tbl;
      log.push(`Table '${tbl}': OK!`);
      const { data: insData, error: insErr } = await supabase.from(tbl).insert([{ judul: 'Test Minimal', deskripsi: 'Test' }]).select();
      if (!insErr && insData && insData.length > 0) {
        validPotSchema = Object.keys(insData[0]);
        log.push(`Table '${tbl}' insert SUCCESS! Valid columns: ${validPotSchema.join(', ')}`);
        await supabase.from(tbl).delete().eq('id', insData[0].id);
      } else {
        log.push(`Table '${tbl}' insert error: ${insErr?.message}`);
      }
      break;
    }
  }

  // Also check column names for umkm
  const { data: umkmData } = await supabase.from('umkm').select('*').limit(1);
  let umkmSample: any = null;
  if (umkmData && umkmData.length > 0) umkmSample = umkmData[0];

  return NextResponse.json({
    timestamp: Date.now(),
    log,
    validPotTable,
    validPotSchema,
    umkmSample,
  });
}
