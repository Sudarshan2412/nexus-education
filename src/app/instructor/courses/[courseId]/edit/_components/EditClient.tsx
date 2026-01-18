"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { VideoUpload } from "@/components/VideoUpload";
import { Video, Trash2, Pencil, Upload } from "lucide-react";

interface EditClientProps {
    course: any;
}

export const EditClient = ({ course }: EditClientProps) => {
    const router = useRouter();
    const [videos, setVideos] = useState(course.videos || []);

    const onUploadComplete = async (url: string) => {
        try {
            const response = await axios.post(`/api/courses/${course.id}/videos`, {
                title: "New Video",
                url: url,
                duration: 0,
            });

            setVideos((current: any) => [...current, response.data]);
            router.refresh();
        } catch (error) {
            console.error("Failed to save video record", error);
            alert("Upload successful but failed to save to course. Please try again.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            <div className="glass-card p-6 fade-in">
                <div className="flex items-center gap-2 mb-6">
                    <Upload className="w-5 h-5 text-brand-blue" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Add New Video
                    </h3>
                </div>
                <VideoUpload courseId={course.id} onUploadComplete={onUploadComplete} />
            </div>

            {/* Videos List */}
            <div className="glass-card p-6 fade-in">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                    Uploaded Videos ({videos.length})
                </h3>

                <div className="space-y-3">
                    {videos.length === 0 && (
                        <p className="text-gray-500 italic text-sm text-center py-8 uppercase tracking-wider">
                            No videos uploaded yet
                        </p>
                    )}

                    {videos.map((video: any) => (
                        <div
                            key={video.id}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-brand-blue/30 transition-all group"
                        >
                            <div className="flex items-center gap-x-3">
                                <div className="p-2.5 bg-brand-blue/10 rounded-xl group-hover:bg-brand-blue/20 transition-colors">
                                    <Video className="w-5 h-5 text-brand-blue" />
                                </div>
                                <div>
                                    <p className="font-medium text-white text-sm">
                                        {video.title}
                                    </p>
                                    {video.duration > 0 && (
                                        <p className="text-xs text-gray-400 font-mono">
                                            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-x-2">
                                <button className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-brand-blue transition-colors">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-red-500/10 rounded-full text-gray-400 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
