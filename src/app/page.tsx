import Link from "next/link";

export default function Home() {
	return (
		<main className="min-h-screen grid place-items-center p-6">
			<div className="max-w-2xl text-center space-y-6">
				<h1 className="text-3xl font-semibold">Notrace</h1>
				<p className="text-zinc-400">Upload, Process, and Share. Vanish in 24 hours.</p>
				<div className="flex items-center justify-center gap-3">
					<Link href="/upload" className="rounded-md bg-white/10 hover:bg-white/20 px-4 py-2">Upload</Link>
					<Link href="/tools" className="rounded-md border border-white/10 hover:border-white/20 px-4 py-2">Tools</Link>
				</div>
			</div>
		</main>
	);
}
