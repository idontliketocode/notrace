export const env = {
	SUPABASE_URL: process.env.SUPABASE_URL || "",
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
	SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
	SUPABASE_BUCKET: process.env.SUPABASE_BUCKET || "notrace",
	NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
