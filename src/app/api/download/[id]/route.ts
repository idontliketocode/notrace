import { prisma } from "@/lib/prisma";
import { getDownloadUrl } from "@/lib/s3";
import bcrypt from "bcrypt";

export async function POST(req: Request, { params }: { params: { id: string } }) {
	const { password } = await req.json().catch(() => ({ password: undefined }));
	const file = await prisma.file.findUnique({ where: { id: params.id } });
	if (!file) return new Response("Not found", { status: 404 });
	if (new Date() > file.expiresAt) return new Response("Expired", { status: 410 });
	if (file.maxDownloads && file.downloadCount >= file.maxDownloads) return new Response("Limit reached", { status: 410 });
	if (file.passwordHash) {
		if (!password) return new Response("Password required", { status: 401 });
		const ok = await bcrypt.compare(password, file.passwordHash);
		if (!ok) return new Response("Invalid password", { status: 401 });
	}
	await prisma.file.update({ where: { id: file.id }, data: { downloadCount: { increment: 1 } } });
	await prisma.download.create({ data: { fileId: file.id } });
	const url = await getDownloadUrl(file.storageKey, file.originalName);
	return Response.json({ url });
}
