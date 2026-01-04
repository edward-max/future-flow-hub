
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hhzobaybzdiijwjfdhkw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoem9iYXliemRpaWp3amZkaGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NjI0OTQsImV4cCI6MjA4MzAzODQ5NH0.7eGq-R-JnLTLOW1cx2wFbwOLtugAfes-kbleAV97rp8';

/**
 * Production-ready Supabase client.
 * Uses project import map.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Helper to upload a file to Supabase Storage
 */
export const uploadFile = async (file: File, bucket: string = 'blog-assets') => {
  // Clean file name to avoid issues with special characters
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  
  // Attempt upload
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error("Supabase Storage Error:", error);
    
    // Check for RLS specifically
    if (error.message.includes('row-level security') || (error as any).status === 403 || (error as any).statusCode === 403) {
      throw new Error(`Permission denied (RLS). You need to run the 'Master Fix' SQL in your Supabase dashboard to allow uploads.`);
    }
    
    // Check if bucket exists
    if (error.message.includes('not found')) {
      throw new Error(`Bucket '${bucket}' not found. Please create it in Supabase Storage.`);
    }
    
    throw error;
  }

  // Generate the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
};
