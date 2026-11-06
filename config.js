/* Marquee settings. These values are public by design (they end up in the browser).
   Fill them in to switch on real sign-in. See BACKEND.md, "Supabase setup".
   - supabaseUrl:     your Supabase "Project URL", e.g. https://abcd1234.supabase.co
   - supabaseAnonKey: your Supabase "anon public" key (NOT the service_role key)
   - apiBase:         leave '' when this site runs on Cloudflare Pages. On GitHub Pages,
                      put your Cloudflare address, e.g. https://marquee-prototype.pages.dev */
window.MARQUEE_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: '',
  apiBase: '',
};
