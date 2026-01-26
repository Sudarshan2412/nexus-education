import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSignedUploadUrl } from "@/lib/r2";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { filename, contentType, courseId, folder } = body;

        if (!filename || !contentType || !courseId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { instructorId: true },
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        if (session.user.role !== "ADMIN" && course.instructorId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const targetFolder = folder === "materials" ? "materials" : "videos";

        // Sanitize filename and create unique path
        const fileExtension = filename.split(".").pop();
        const uniqueFilename = `${uuidv4()}.${fileExtension}`;
        const key = `courses/${courseId}/${targetFolder}/${uniqueFilename}`;

        const uploadUrl = await getSignedUploadUrl(key, contentType);

        return NextResponse.json({
            uploadUrl,
            key,
            publicUrl: `${process.env.R2_PUBLIC_URL}/${key}`,
        });
    } catch (error: any) {
        console.error("[UPLOAD_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
