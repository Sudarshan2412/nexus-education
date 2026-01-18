import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToR2 } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const courseId = form.get("courseId") as string | null;
    const folder = (form.get("folder") as string | null) || "videos";

    if (!file || !courseId) {
      return NextResponse.json({ error: "Missing file or courseId" }, { status: 400 });
    }

    // Verify ownership unless admin
    if (session.user.role !== "ADMIN") {
      const courseOwner = await prisma.course.findUnique({
        where: {
          id: courseId,
          instructorId: session.user.id,
        },
      });

      if (!courseOwner) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = file.name.split(".").pop();
    const uniqueFilename = `${uuidv4()}.${ext ?? "bin"}`;
    const safeFolder = folder === "materials" ? "materials" : "videos";
    const key = `courses/${courseId}/${safeFolder}/${uniqueFilename}`;

    const publicUrl = await uploadToR2(buffer, key, file.type || "application/octet-stream");

    return NextResponse.json({ key, publicUrl });
  } catch (error) {
    console.error("[UPLOAD_PROXY_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}