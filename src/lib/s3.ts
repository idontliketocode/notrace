import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY);

export async function getUploadUrl(key: string, contentType: string) {
	// Supabase signed URLs are for GET. For uploads, use upload via API route or a public upload policy.
	// We will return the object path and expect the client to PUT via a simple fetch to the upload endpoint.
	return { bucket: env.SUPABASE_BUCKET, path: key, contentType };
}

export async function uploadObject(bucket: string, path: string, file: ArrayBuffer, contentType: string) {
	const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType, upsert: false });
	if (error) throw error;
}

export async function getDownloadUrl(key: string, filename: string) {
	const { data, error } = await supabase.storage.from(env.SUPABASE_BUCKET).createSignedUrl(key, 60 * 5, { download: filename });
	if (error) throw error;
	return data.signedUrl;
}
