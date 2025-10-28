import Link from "next/link";

export default function ToolsPage() {
	const tools = [
		{ href: "/tools/compress", name: "File Compressor" },
		{ href: "/tools/convert", name: "File Converter" },
		{ href: "/tools/pdf", name: "PDF Merge & Split" },
		{ href: "/tools/metadata", name: "Metadata Stripper" },
		{ href: "/tools/rename", name: "File Renamer" },
	];
	return (
		<div className="min-h-screen bg-black text-zinc-200 p-6">
			<div className="max-w-3xl mx-auto space-y-4">
				<h1 className="text-xl font-semibold">Tools</h1>
				<ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{tools.map(t => (
						<li key={t.href} className="rounded-xl border border-white/5 bg-zinc-900/40 p-4">
							<Link href={t.href} className="hover:underline">{t.name}</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
