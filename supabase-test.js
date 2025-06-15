const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jspxykfdufkfrpnztkvb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzcHh5a2ZkdWZrZnJwbnp0a3ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMTAyNjEsImV4cCI6MjA2Mzc4NjI2MX0.JI4eok76n1nKbcKJc-JaqHH56Xoz9dLwMvPBqMVBlR8'
);

(async () => {
  try {
    const { data, error } = await supabase.from('messages').select('*').limit(1);
    console.log('Test select:', { data, error });
  } catch (err) {
    console.error('Exception during Supabase test select:', err);
  }
})();
