"use client";
import { useState } from "react";

export default function UploadPage() {
	const [file, setFile] = useState<File | null>(null);
	const [note, setNote] = useState("");
	const [password, setPassword] = useState("");
	const [maxDownloads, setMaxDownloads] = useState<number | "">("");
	const [status, setStatus] = useState<string>("");
	const [shareLink, setShareLink] = useState<string>("");
	const [uploading, setUploading] = useState(false);

	async function startUpload() {
		if (!file) return;
		setUploading(true);
		setStatus("Uploading…");
		try {
			const form = new FormData();
			form.set("file", file);
			form.set("filename", file.name);
			form.set("mimeType", file.type || "application/octet-stream");
			form.set("sizeBytes", String(file.size));
			if (note) form.set("note", note);
			if (password) form.set("password", password);
			if (maxDownloads !== "") form.set("maxDownloads", String(maxDownloads));
			const res = await fetch("/api/upload", { method: "POST", body: form });
			if (!res.ok) throw new Error(await res.text());
			const data = await res.json();
			const link = `${window.location.origin}/f/${data.id}`;
			setShareLink(link);
			setStatus("Done");
		} catch (e: any) {
			setStatus(e.message || "Upload failed");
		} finally {
			setUploading(false);
		}
	}

	return (
		<div className="min-h-screen bg-black text-zinc-200 p-6">
			<div className="max-w-xl mx-auto space-y-4">
				<h1 className="text-xl font-semibold">Upload a file</h1>
				<div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-3">
					<input type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="w-full text-sm" />
					<input value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Optional note" className="w-full rounded-md bg-zinc-800 px-3 py-2" />
					<input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Optional password" className="w-full rounded-md bg-zinc-800 px-3 py-2" type="password" />
					<input value={maxDownloads} onChange={(e)=>setMaxDownloads(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Auto-delete after N downloads (optional)" className="w-full rounded-md bg-zinc-800 px-3 py-2" type="number" min={1} />
					<button disabled={!file || uploading} onClick={startUpload} className="w-full rounded-md bg-white/10 hover:bg-white/20 py-2">{uploading?"Uploading…":"Upload"}</button>
					{status && <p className="text-sm text-zinc-400">{status}</p>}
					{shareLink && (
						<div className="text-sm">
							Share link: <a className="underline" href={shareLink}>{shareLink}</a>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
