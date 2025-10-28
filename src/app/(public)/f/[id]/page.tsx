"use client";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

async function fetchMeta(id: string) {
	const res = await fetch(`/api/files/${id}`);
	if (!res.ok) throw new Error("Not found");
	return res.json();
}

export default function PublicFilePage({ params }: { params: { id: string } }) {
	const { id } = params;
	const [meta, setMeta] = useState<any>();
	const [password, setPassword] = useState("");
	const [err, setErr] = useState<string | null>(null);
	const [downloading, setDownloading] = useState(false);

	useEffect(() => {
		fetchMeta(id).then(setMeta).catch(()=>setErr("Not found"));
	}, [id]);

	const remaining = useMemo(() => {
		if (!meta?.expiresAt) return "";
		const d = dayjs(meta.expiresAt).diff(dayjs(), "second");
		if (d <= 0) return "Expired";
		const h = Math.floor(d/3600), m = Math.floor((d%3600)/60), s = d%60;
		return `${h}h ${m}m ${s}s`;
	}, [meta]);

	async function startDownload() {
		setErr(null);
		setDownloading(true);
		try {
			const res = await fetch(`/api/download/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: password || undefined }) });
			if (!res.ok) {
				const text = await res.text();
				throw new Error(text || "Failed");
			}
			const { url } = await res.json();
			window.location.href = url;
		} catch (e: any) {
			setErr(e.message || "Failed");
		} finally {
			setDownloading(false);
		}
	}

	if (err) return <div className="min-h-screen flex items-center justify-center bg-black text-zinc-200">{err}</div>;
	if (!meta) return <div className="min-h-screen flex items-center justify-center bg-black text-zinc-200">Loading…</div>;

	return (
		<div className="min-h-screen flex items-center justify-center bg-black text-zinc-200 p-4">
			<div className="w-full max-w-md p-6 rounded-2xl bg-zinc-900/60 backdrop-blur border border-white/5 space-y-3">
				<h1 className="text-lg font-medium">{meta.name}</h1>
				<p className="text-sm text-zinc-400">Size: {(meta.sizeBytes/1024/1024).toFixed(2)} MB</p>
				<p className="text-sm">Expires in: {remaining}</p>
				{meta.passwordProtected && (
					<input className="w-full rounded-md bg-zinc-800 px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
				)}
				<button disabled={downloading} onClick={startDownload} className="w-full rounded-md bg-white/10 hover:bg-white/20 py-2">{downloading?"Preparing…":"Download"}</button>
			</div>
		</div>
	);
}
