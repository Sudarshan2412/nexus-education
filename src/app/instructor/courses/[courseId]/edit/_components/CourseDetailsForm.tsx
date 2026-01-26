"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseDetailsFormProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    level: string | null;
    published: boolean;
    price: number | null;
  };
}

const categories = [
  "General",
  "Web Development",
  "Data Science",
  "Mobile Apps",
  "Cloud Computing",
  "AI & Machine Learning",
  "DevOps",
];

const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export function CourseDetailsForm({ course }: CourseDetailsFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || "");
  const [category, setCategory] = useState(course.category || "General");
  const [level, setLevel] = useState(course.level || "BEGINNER");
  const [published, setPublished] = useState(!!course.published);
  const [price, setPrice] = useState(course.price === 50 ? 50 : 0);
  const [saving, setSaving] = useState(false);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/api/courses/${course.id}`, {
        title,
        description,
        category,
        level,
        price,
        published,
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to save course details", error);
      alert("Failed to save course details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSave} className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Course Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
          placeholder="Advanced Web Development"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary min-h-[120px]"
          placeholder="Describe what students will learn..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Pricing
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[0, 50].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPrice(value)}
              className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                price === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-white/10 bg-black/30 text-gray-300 hover:border-primary/40"
              }`}
            >
              {value === 0 ? "Free" : "50 Credits"}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Courses can be Free or priced at 50 credits. Only published courses are eligible for trades.
        </p>
      </div>

      <label className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4 accent-primary"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white">Publish course</span>
          <span className="text-xs text-gray-400">
            Published courses are visible and enrollable by students
          </span>
        </div>
      </label>

      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-primary text-black rounded-xl font-bold uppercase tracking-widest text-xs py-3 hover:bg-primary/90 disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
