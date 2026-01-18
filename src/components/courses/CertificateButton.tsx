"use client";

import { useState } from "react";
import { Download, Award, Loader2 } from "lucide-react";
import axios from "axios";
import { jsPDF } from "jspdf";
import confetti from "canvas-confetti";

interface CertificateButtonProps {
    courseId: string;
    courseName: string;
    isCompleted: boolean;
}

export const CertificateButton = ({
    courseId,
    courseName,
    isCompleted,
}: CertificateButtonProps) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setLoading(true);

            // 1. Trigger API to issue certificate
            const { data } = await axios.post(`/api/courses/${courseId}/certificate`);

            // 2. Confetti effect
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#22d3ee", "#818cf8", "#f472b6"],
            });

            // 3. Generate PDF
            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Background / Border
            doc.setFillColor(15, 15, 15);
            doc.rect(0, 0, pageWidth, pageHeight, "F");

            doc.setDrawColor(34, 211, 238); // Cyan border
            doc.setLineWidth(2);
            doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

            // Text
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(40);
            doc.text("CERTIFICATE OF COMPLETION", pageWidth / 2, 60, { align: "center" });

            doc.setFontSize(18);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(150, 150, 150);
            doc.text("THIS IS TO CERTIFY THAT", pageWidth / 2, 90, { align: "center" });

            doc.setFontSize(32);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(34, 211, 238);
            doc.text(data.userName.toUpperCase(), pageWidth / 2, 115, { align: "center" });

            doc.setFontSize(18);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(150, 150, 150);
            doc.text("HAS SUCCESSFULLY COMPLETED THE COURSE", pageWidth / 2, 140, { align: "center" });

            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.text(courseName.toUpperCase(), pageWidth / 2, 160, { align: "center" });

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 100, 100);
            doc.text(`ISSUED ON: ${new Date(data.issuedAt).toLocaleDateString()}`, pageWidth / 2, 185, { align: "center" });
            doc.text(`VERIFICATION ID: ${data.id}`, pageWidth / 2, 192, { align: "center" });

            // Branding
            doc.setTextColor(34, 211, 238);
            doc.setFontSize(20);
            doc.text("NEXUS EDUCATION", pageWidth / 2, 50, { align: "center" });

            // Download
            doc.save(`${courseName.replace(/\s+/g, "_")}_Certificate.pdf`);

        } catch (error) {
            console.error("Certificate generation error", error);
            alert("Could not generate certificate. Please ensure the course is 100% complete.");
        } finally {
            setLoading(false);
        }
    };

    if (!isCompleted) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-500 text-xs font-bold uppercase tracking-widest cursor-not-allowed">
                <Award className="w-4 h-4" />
                Complete Course to Unlock Certificate
            </div>
        );
    }

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-black rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all button-glow active:scale-[0.98]"
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                </>
            ) : (
                <>
                    <Award className="w-4 h-4" />
                    Download Certificate
                    <Download className="w-4 h-4 ml-1" />
                </>
            )}
        </button>
    );
};
