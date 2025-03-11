
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://izidsxjebciwbjwclkju.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6aWRzeGplYmNpd2Jqd2Nsa2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTIwNjcsImV4cCI6MjA1NzI4ODA2N30.u60E9QGJmIhAFFVLiAxBjN3ycXanr-8oVZyFwZSeDMY";

export const supabase = createClient(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  {
    db: {
      schema: 'api' // Use the api schema for all queries
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
