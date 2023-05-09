import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cfaayqrkolakqvzyqruj.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYWF5cXJrb2xha3F2enlxcnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU1ODA4NzcsImV4cCI6MTk5MTE1Njg3N30.q-M6k-4Q8oj3AuFdskkkax_LnfmYlo8LEHgbXJz2bBo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
