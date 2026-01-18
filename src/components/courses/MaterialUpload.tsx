"use client";

import { useState } from "react";
import axios from "axios";
import { Upload, X, CheckCircle, FileText, AlertCircle } from "lucide-react";

interface MaterialUploadProps {
    courseId: string;
    onUploadComplete: (url: string, title: string, size: number, type: string) => void;
}

export const MaterialUpload = ({ courseId, onUploadComplete }: MaterialUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Max size 50MB for materials
            if (selectedFile.size > 50 * 1024 * 1024) {
                setError("File size should be less than 50MB");
                return;
            }

            setFile(selectedFile);
            setError(null);
            setSuccess(false);
            setProgress(0);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setUploading(true);
            setError(null);

            // 1. Get presigned URL
            const { data } = await axios.post("/api/upload", {
                filename: file.name,
                contentType: file.type || "application/octet-stream",
                courseId,
            });

            const { uploadUrl, publicUrl } = data;

            // 2. Upload to R2 directly
            await axios.put(uploadUrl, file, {
                headers: {
                    "Content-Type": file.type || "application/octet-stream",
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    }
                },
            });

            // 3. Determine Material Type
            let materialType = "OTHER";
            const ext = file.name.split(".").pop()?.toLowerCase();
            if (ext === "pdf") materialType = "PDF";
            else if (["doc", "docx", "txt", "rtf"].includes(ext || "")) materialType = "DOCUMENT";
            else if (["ppt", "pptx"].includes(ext || "")) materialType = "SLIDES";
            else if (["zip", "rar", "js", "ts", "py", "html", "css"].includes(ext || "")) materialType = "CODE";

            setSuccess(true);
            onUploadComplete(publicUrl, file.name, file.size, materialType);

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data || "Something went wrong during upload");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setError(null);
        setSuccess(false);
        setProgress(0);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col items-center justify-center w-full">
                {!file ? (
                    <label
                        htmlFor="dropzone-material"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-primary transition-colors">
                            <Upload className="w-10 h-10 mb-3" />
                            <p className="mb-2 text-sm font-bold uppercase tracking-wider">
                                Click to upload material
                            </p>
                            <p className="text-xs opacity-70 uppercase tracking-widest">
                                PDF, DOCX, ZIP (MAX. 50MB)
                            </p>
                        </div>
                        <input
                            id="dropzone-material"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                ) : (
                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="p-2.5 bg-primary/10 rounded-xl">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex flex-col truncate">
                                    <span className="text-sm font-medium text-white truncate max-w-[180px]">
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </span>
                                </div>
                            </div>
                            {!uploading && !success && (
                                <button
                                    onClick={handleRemove}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                                </button>
                            )}
                        </div>

                        {uploading && (
                            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/10">
                                <div
                                    className="bg-primary h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center text-sm text-red-500 gap-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wider">{error}</span>
                            </div>
                        )}

                        {success ? (
                            <div className="flex items-center justify-center p-4 text-sm text-neon-green bg-neon-green/10 border border-neon-green/20 rounded-2xl gap-2">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-bold uppercase tracking-wider text-xs">Upload Complete!</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-200 uppercase tracking-wider text-xs
                                ${uploading
                                        ? "bg-primary/50 cursor-not-allowed"
                                        : "bg-primary hover:bg-primary/80 button-glow active:scale-[0.98]"
                                    }`}
                            >
                                {uploading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Uploading {progress}%...
                                    </span>
                                ) : (
                                    "Upload Material"
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
