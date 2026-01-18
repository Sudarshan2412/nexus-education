"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { VideoUpload } from "@/components/courses/VideoUpload";
import { MaterialUpload } from "@/components/courses/MaterialUpload";
import {
    Video,
    Trash2,
    Pencil,
    Upload,
    FileText,
    Plus,
    Play,
    CheckCircle,
    AlertCircle,
    BrainCircuit,
    ChevronDown,
    ChevronUp,
    Save,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EditClientProps {
    course: any;
}

type TabType = "videos" | "materials" | "exercises";

export const EditClient = ({ course }: EditClientProps) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("videos");
    const [videos, setVideos] = useState(course.videos || []);
    const [materials, setMaterials] = useState(course.materials || []);
    const [exercises, setExercises] = useState(course.exercises || []);

    // Video editing state
    const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
    const [editVideoTitle, setEditVideoTitle] = useState("");

    // Exercise creation state
    const [isCreatingExercise, setIsCreatingExercise] = useState(false);
    const [exerciseForm, setExerciseForm] = useState({
        title: "",
        type: "MCQ",
        question: "",
        points: 10,
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "A"
    });

    const onVideoUploadComplete = async (url: string) => {
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

    const onMaterialUploadComplete = async (url: string, title: string, size: number, type: string) => {
        try {
            const response = await axios.post(`/api/courses/${course.id}/materials`, {
                title,
                url,
                size,
                type,
            });

            setMaterials((current: any) => [...current, response.data]);
            router.refresh();
        } catch (error) {
            console.error("Failed to save material record", error);
            alert("Upload successful but failed to save to course.");
        }
    };

    const deleteVideo = async (id: string) => {
        if (!confirm("Are you sure you want to delete this video?")) return;
        try {
            await axios.delete(`/api/videos/${id}`);
            setVideos((current: any) => current.filter((v: any) => v.id !== id));
            router.refresh();
        } catch (error) {
            alert("Failed to delete video");
        }
    };

    const deleteMaterial = async (id: string) => {
        if (!confirm("Are you sure you want to delete this material?")) return;
        try {
            await axios.delete(`/api/materials/${id}`);
            setMaterials((current: any) => current.filter((m: any) => m.id !== id));
            router.refresh();
        } catch (error) {
            alert("Failed to delete material");
        }
    };

    const updateVideoTitle = async (id: string) => {
        try {
            const response = await axios.patch(`/api/videos/${id}`, {
                title: editVideoTitle
            });
            setVideos((current: any) =>
                current.map((v: any) => v.id === id ? response.data : v)
            );
            setEditingVideoId(null);
            router.refresh();
        } catch (error) {
            alert("Failed to update video");
        }
    };

    const createExercise = async () => {
        try {
            const response = await axios.post(`/api/courses/${course.id}/exercises`, exerciseForm);
            setExercises((current: any) => [...current, response.data]);
            setIsCreatingExercise(false);
            setExerciseForm({
                title: "",
                type: "MCQ",
                question: "",
                points: 10,
                options: { A: "", B: "", C: "", D: "" },
                correctAnswer: "A"
            });
            router.refresh();
        } catch (error) {
            alert("Failed to create exercise");
        }
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
                <button
                    onClick={() => setActiveTab("videos")}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "videos"
                            ? "bg-primary text-black shadow-lg shadow-primary/20"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    Videos
                </button>
                <button
                    onClick={() => setActiveTab("materials")}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "materials"
                            ? "bg-primary text-black shadow-lg shadow-primary/20"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    Materials
                </button>
                <button
                    onClick={() => setActiveTab("exercises")}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "exercises"
                            ? "bg-primary text-black shadow-lg shadow-primary/20"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    Exercises
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === "videos" && (
                        <motion.div
                            key="videos"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Upload Section */}
                            <div className="glass-card p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Upload className="w-5 h-5 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                        Add New Video
                                    </h3>
                                </div>
                                <VideoUpload courseId={course.id} onUploadComplete={onVideoUploadComplete} />
                            </div>

                            {/* Videos List */}
                            <div className="glass-card p-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                                    Uploaded Videos ({videos.length})
                                </h3>
                                <div className="space-y-3">
                                    {videos.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                                            <Play className="w-10 h-10 text-white/10 mx-auto mb-4" />
                                            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">
                                                No videos uploaded yet
                                            </p>
                                        </div>
                                    )}
                                    {videos.map((video: any, index: number) => (
                                        <div key={video.id} className="group relative">
                                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/50 transition-all">
                                                <div className="flex items-center gap-x-4">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                                                        {index + 1}
                                                    </div>
                                                    {editingVideoId === video.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                value={editVideoTitle}
                                                                onChange={(e) => setEditVideoTitle(e.target.value)}
                                                                className="bg-black/50 border border-primary/30 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-primary"
                                                                autoFocus
                                                            />
                                                            <button onClick={() => updateVideoTitle(video.id)} className="text-neon-green hover:scale-110 transition-transform">
                                                                <Save className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => setEditingVideoId(null)} className="text-red-400 hover:scale-110 transition-transform">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="font-bold text-white text-sm uppercase tracking-tight">
                                                                {video.title}
                                                            </p>
                                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                                                                {video.url.split('/').pop()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setEditingVideoId(video.id);
                                                            setEditVideoTitle(video.title);
                                                        }}
                                                        className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-primary transition-all"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteVideo(video.id)}
                                                        className="p-2 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-400 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "materials" && (
                        <motion.div
                            key="materials"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="glass-card p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                        Add Learning Materials
                                    </h3>
                                </div>
                                <MaterialUpload courseId={course.id} onUploadComplete={onMaterialUploadComplete} />
                            </div>

                            <div className="glass-card p-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                                    Course Materials ({materials.length})
                                </h3>
                                <div className="space-y-3">
                                    {materials.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                                            <FileText className="w-10 h-10 text-white/10 mx-auto mb-4" />
                                            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">
                                                No materials added yet
                                            </p>
                                        </div>
                                    )}
                                    {materials.map((material: any) => (
                                        <div key={material.id} className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/50 transition-all">
                                            <div className="flex items-center gap-x-4">
                                                <div className="p-2.5 bg-primary/10 rounded-xl">
                                                    <FileText className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm uppercase tracking-tight">
                                                        {material.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-primary px-1.5 py-0.5 bg-primary/10 rounded uppercase tracking-widest font-bold">
                                                            {material.type}
                                                        </span>
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                                                            {(material.size / (1024 * 1024)).toFixed(2)} MB
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteMaterial(material.id)}
                                                className="p-2 opacity-0 group-hover:opacity-100 bg-red-500/10 rounded-xl text-red-400 hover:bg-red-500/20 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "exercises" && (
                        <motion.div
                            key="exercises"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Create Exercise Button */}
                            <button
                                onClick={() => setIsCreatingExercise(!isCreatingExercise)}
                                className="w-full p-4 glass-card border-dashed border-white/20 hover:border-primary/50 hover:bg-primary/5 transition-all group flex items-center justify-center gap-3"
                            >
                                <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                                    <Plus className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                                    {isCreatingExercise ? "Cancel Creation" : "Create New Exercise"}
                                </span>
                            </button>

                            {/* Create Form */}
                            <AnimatePresence>
                                {isCreatingExercise && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="glass-card p-6 space-y-6 border-primary/20 bg-primary/5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Exercise Title</label>
                                                    <input
                                                        value={exerciseForm.title}
                                                        onChange={(e) => setExerciseForm({ ...exerciseForm, title: e.target.value })}
                                                        placeholder="e.g. Module 1 Assessment"
                                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Points</label>
                                                    <input
                                                        type="number"
                                                        value={exerciseForm.points}
                                                        onChange={(e) => setExerciseForm({ ...exerciseForm, points: parseInt(e.target.value) })}
                                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Question Content</label>
                                                <textarea
                                                    value={exerciseForm.question}
                                                    onChange={(e) => setExerciseForm({ ...exerciseForm, question: e.target.value })}
                                                    placeholder="Enter your question here..."
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all min-h-[100px]"
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Options & Correct Answer</label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {["A", "B", "C", "D"].map((key) => (
                                                        <div key={key} className="flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer transition-all ${exerciseForm.correctAnswer === key ? "bg-primary text-black" : "bg-white/5 text-gray-400"}`} onClick={() => setExerciseForm({ ...exerciseForm, correctAnswer: key })}>
                                                                {key}
                                                            </div>
                                                            <input
                                                                value={(exerciseForm.options as any)[key]}
                                                                onChange={(e) => {
                                                                    const newOptions = { ...exerciseForm.options, [key]: e.target.value };
                                                                    setExerciseForm({ ...exerciseForm, options: newOptions });
                                                                }}
                                                                placeholder={`Option ${key}`}
                                                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white p-0"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                onClick={createExercise}
                                                disabled={!exerciseForm.title || !exerciseForm.question}
                                                className="w-full py-3 bg-primary text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-primary/80 transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
                                            >
                                                Save Exercise
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Exercises List */}
                            <div className="space-y-3">
                                {exercises.length === 0 && !isCreatingExercise && (
                                    <div className="text-center py-20 glass-card">
                                        <BrainCircuit className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                        <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">
                                            No exercises created yet
                                        </p>
                                    </div>
                                )}
                                {exercises.map((exercise: any) => (
                                    <div key={exercise.id} className="glass-card p-5 group hover:border-primary/50 transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-xl">
                                                    <BrainCircuit className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white uppercase tracking-tight text-sm">{exercise.title}</h4>
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                                        {exercise.type} • {exercise.points} Points
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <p className="text-xs text-gray-400 leading-relaxed italic">
                                                "{exercise.question}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
