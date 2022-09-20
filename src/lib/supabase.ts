import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://rvdohsdtvhjtzgxsyffn.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZG9oc2R0dmhqdHpneHN5ZmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM2MDIwNDcsImV4cCI6MTk3OTE3ODA0N30.Yp8giZBS4In5Sc9Ngqw9zRGqjYBz1MNAhg7cJKurcbo'
);
