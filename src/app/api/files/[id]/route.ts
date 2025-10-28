import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
	const file = await prisma.file.findUnique({ where: { id: params.id } });
	if (!file) return new Response("Not found", { status: 404 });
	return Response.json({
		id: file.id,
		name: file.originalName,
		sizeBytes: file.sizeBytes,
		mimeType: file.mimeType,
		expiresAt: file.expiresAt,
		passwordProtected: !!file.passwordHash,
	});
}
