import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getStats(userId: string) {
	const [uploads, downloads] = await Promise.all([
		prisma.file.count({ where: { userId } }),
		prisma.download.count({ where: { file: { userId } } }),
	]);
	const totalSize = await prisma.file.aggregate({ _sum: { sizeBytes: true }, where: { userId } });
	return { uploads, downloads, storageUsed: totalSize._sum.sizeBytes || 0 };
}

export default async function DashboardPage() {
	const session = await auth();
	if (!session?.user?.id) return <div className="min-h-screen flex items-center justify-center bg-black text-zinc-200">Unauthorized</div>;
	const [files, stats] = await Promise.all([
		prisma.file.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 20 }),
		getStats(session.user.id),
	]);
	async function deleteFile(id: string) {
		"use server";
		await prisma.download.deleteMany({ where: { fileId: id } });
		await prisma.file.delete({ where: { id } });
	}
	async function extendFile(id: string) {
		"use server";
		const f = await prisma.file.findUnique({ where: { id } });
		if (!f) return;
		await prisma.file.update({ where: { id }, data: { expiresAt: new Date(f.expiresAt.getTime() + 24*60*60*1000) } });
	}
	return (
		<div className="min-h-screen bg-black text-zinc-200 p-6">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-semibold">Dashboard</h1>
					<Link href="/upload" className="rounded-md bg-white/10 hover:bg-white/20 px-3 py-2">Upload</Link>
				</div>
				<div className="grid grid-cols-3 gap-3">
					<div className="rounded-xl border border-white/5 bg-zinc-900/40 p-4"><div className="text-xs text-zinc-400">Total uploads</div><div className="text-lg font-medium">{stats.uploads}</div></div>
					<div className="rounded-xl border border-white/5 bg-zinc-900/40 p-4"><div className="text-xs text-zinc-400">Total downloads</div><div className="text-lg font-medium">{stats.downloads}</div></div>
					<div className="rounded-xl border border-white/5 bg-zinc-900/40 p-4"><div className="text-xs text-zinc-400">Storage used</div><div className="text-lg font-medium">{(stats.storageUsed/1024/1024).toFixed(2)} MB</div></div>
				</div>
				<ul className="divide-y divide-white/5 rounded-xl overflow-hidden border border-white/5 bg-zinc-900/40">
					{files.map(f => (
						<li key={f.id} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
							<div>
								<div className="font-medium">{f.originalName}</div>
								<div className="text-xs text-zinc-400">{(f.sizeBytes/1024/1024).toFixed(2)} MB • expires {f.expiresAt.toLocaleString()}</div>
							</div>
							<div className="text-sm text-zinc-300 truncate">{`${process.env.NEXT_PUBLIC_SITE_URL || ""}/f/${f.id}`}</div>
							<div className="flex gap-2 justify-end">
								<Link href={`/f/${f.id}`} className="rounded-md bg-white/10 hover:bg-white/20 px-3 py-2 text-sm">Open</Link>
								<form action={async()=>{ await extendFile(f.id); }}><button className="rounded-md bg-white/10 hover:bg-white/20 px-3 py-2 text-sm">Extend +24h</button></form>
								<form action={async()=>{ await deleteFile(f.id); }}><button className="rounded-md bg-red-500/20 hover:bg-red-500/30 px-3 py-2 text-sm">Delete</button></form>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
