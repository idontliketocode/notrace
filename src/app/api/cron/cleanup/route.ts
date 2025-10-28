import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/s3";

export async function POST() {
	const now = new Date();
	const candidates = await prisma.file.findMany({ where: { OR: [ { expiresAt: { lt: now } }, { AND: [ { maxDownloads: { not: null } }, { downloadCount: { gte: 1 } } ] } ] } });
	let deleted = 0;
	for (const f of candidates) {
		if (f.expiresAt < now || (f.maxDownloads && f.downloadCount >= f.maxDownloads)) {
			await prisma.download.deleteMany({ where: { fileId: f.id } });
			await prisma.file.delete({ where: { id: f.id } });
			await supabase.storage.from("notrace").remove([f.storageKey]);
			deleted++;
		}
	}
	return Response.json({ deleted });
}
