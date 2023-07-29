import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://qrwnfofnreoksztmwnki.supabase.co';

const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyd25mb2ZucmVva3N6dG13bmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkxNDE5NjcsImV4cCI6MjAwNDcxNzk2N30.1UnDGyEv2KPm67mJttCpH9-0xbbFtM3NmhYD9kk6kvI';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
