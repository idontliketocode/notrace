import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadObject } from "@/lib/s3";
import { z } from "zod";
import bcrypt from "bcrypt";

const FieldsSchema = z.object({
	filename: z.string(),
	mimeType: z.string().optional(),
	sizeBytes: z.coerce.number().int().positive(),
	note: z.string().optional(),
	password: z.string().optional(),
	maxDownloads: z.coerce.number().int().positive().optional(),
});

export async function POST(req: Request) {
	const session = await auth();
	if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

	const contentType = req.headers.get("content-type") || "";
	if (!contentType.includes("multipart/form-data")) {
		return new Response("Expected multipart/form-data", { status: 400 });
	}

	const form = await req.formData();
	const fileBlob = form.get("file");
	if (!(fileBlob instanceof Blob)) {
		return new Response("Missing file", { status: 400 });
	}
	const fields = FieldsSchema.safeParse({
		filename: String(form.get("filename") || (fileBlob as File).name || "file"),
		mimeType: String((fileBlob as File).type || form.get("mimeType") || "application/octet-stream"),
		sizeBytes: Number(form.get("sizeBytes") || (fileBlob as File).size || 0),
		note: form.get("note") ? String(form.get("note")) : undefined,
		password: form.get("password") ? String(form.get("password")) : undefined,
		maxDownloads: form.get("maxDownloads") ? Number(form.get("maxDownloads")) : undefined,
	});
	if (!fields.success) return new Response("Invalid fields", { status: 400 });

	const { filename, mimeType = "application/octet-stream", sizeBytes, note, password, maxDownloads } = fields.data;
	const key = `u/${session.user.id}/${crypto.randomUUID()}`;
	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

	const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

	const arrayBuffer = await (fileBlob as Blob).arrayBuffer();
	await uploadObject("notrace", key, arrayBuffer, mimeType);

	const file = await prisma.file.create({
		data: {
			userId: session.user.id,
			originalName: filename,
			mimeType,
			sizeBytes,
			storageKey: key,
			note,
			passwordHash,
			maxDownloads,
			expiresAt,
		},
	});

	return Response.json({ id: file.id, expiresAt });
}
