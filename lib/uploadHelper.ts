import { supabase } from './supabaseClient';

/**
 * Uploads an image file to Supabase Storage bucket 'media'
 * Fallback to base64 Data URL if bucket is not created or permissions are missing.
 */
export async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }
  } catch (err) {
    console.warn('Supabase storage upload fallback activated:', err);
  }

  // Fallback: Read as Data URL (base64) so uploads always work seamlessly
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
