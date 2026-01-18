import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSignedUploadUrl } from "@/lib/r2";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { filename, contentType, courseId } = body;

        if (!filename || !contentType || !courseId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Sanitize filename and create unique path
        const fileExtension = filename.split(".").pop();
        const uniqueFilename = `${uuidv4()}.${fileExtension}`;
        const key = `courses/${courseId}/videos/${uniqueFilename}`;

        const uploadUrl = await getSignedUploadUrl(key);

        return NextResponse.json({
            uploadUrl,
            key,
            publicUrl: `${process.env.R2_PUBLIC_URL}/${key}`,
        });
    } catch (error) {
        console.error("[UPLOAD_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
