"use client";

import { useState } from "react";
import axios from "axios";
import { Upload, X, CheckCircle, FileVideo, AlertCircle } from "lucide-react";

interface VideoUploadProps {
    courseId: string;
    onUploadComplete: (url: string, duration?: number) => void;
}

export const VideoUpload = ({ courseId, onUploadComplete }: VideoUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.type.startsWith("video/")) {
                setError("Please upload a valid video file");
                return;
            }
            // Max size 500MB
            if (selectedFile.size > 500 * 1024 * 1024) {
                setError("File size should be less than 500MB");
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
                contentType: file.type,
                courseId,
            });

            const { uploadUrl, publicUrl } = data;

            // 2. Upload to R2 directly
            await axios.put(uploadUrl, file, {
                headers: {
                    "Content-Type": file.type,
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

            // 3. Success
            setSuccess(true);
            onUploadComplete(publicUrl);

        } catch (err) {
            console.error(err);
            setError("Something went wrong during upload");
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
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-brand-blue transition-colors">
                            <Upload className="w-10 h-10 mb-3" />
                            <p className="mb-2 text-sm font-bold uppercase tracking-wider">
                                Click to upload video
                            </p>
                            <p className="text-xs opacity-70 uppercase tracking-widest">
                                MP4, WebM or Ogg (MAX. 500MB)
                            </p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                ) : (
                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="p-2.5 bg-brand-blue/10 rounded-xl">
                                    <FileVideo className="w-5 h-5 text-brand-blue" />
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
                                    className="bg-brand-blue h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center text-sm text-red-400 gap-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wider">{error}</span>
                            </div>
                        )}

                        {success ? (
                            <div className="flex items-center justify-center p-4 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl gap-2">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-bold uppercase tracking-wider text-xs">Upload Complete!</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-200 uppercase tracking-wider text-xs
                  ${uploading
                                        ? "bg-brand-blue/50 cursor-not-allowed"
                                        : "bg-brand-blue hover:bg-blue-600 button-glow active:scale-[0.98]"
                                    }`}
                            >
                                {uploading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Uploading {progress}%...
                                    </span>
                                ) : (
                                    "Upload Video"
                                )}
                            </button>
                        )}

                        {success && (
                            <button
                                onClick={handleRemove}
                                className="w-full py-2 text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                            >
                                Upload another video
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
