"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Bounty = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  status: "OPEN" | "CLOSED";
  createdAt: string | Date;
  createdBy: { id: string; name: string | null };
  fulfilledBy?: { id: string; name: string | null } | null;
  fulfilledCourse?: { id: string; title: string } | null;
};

type Course = { id: string; title: string };

type Props = {
  bounties: Bounty[];
  myCourses: Course[];
  canCreate: boolean;
};

export function BountiesClient({ bounties, myCourses, canCreate }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(50);
  const [submitting, setSubmitting] = useState(false);
  const [fulfillingId, setFulfillingId] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Record<string, string>>({});

  const refresh = () => router.refresh();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, amount }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create bounty");
      }

      setTitle("");
      setDescription("");
      setAmount(50);
      refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFulfill = async (bountyId: string) => {
    const courseId = selectedCourses[bountyId];
    if (!courseId) {
      alert("Select one of your published courses to fulfill this bounty");
      return;
    }
    setFulfillingId(bountyId);
    try {
      const res = await fetch(`/api/bounties/${bountyId}/fulfill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fulfill bounty");
      }

      setSelectedCourses((prev) => ({ ...prev, [bountyId]: "" }));
      refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setFulfillingId(null);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 space-y-8 relative z-10">
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Marketplace</p>
          <h1 className="text-3xl font-display font-bold text-white">Bounties</h1>
          <p className="text-sm text-muted-foreground">
            Post bounties by pre-funding credits. Fulfill a bounty with your published course to earn credits.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {bounties.length === 0 && (
            <div className="glass-card p-4 text-sm text-muted-foreground">
              No bounties yet. Be the first to post one.
            </div>
          )}
          {bounties.map((bounty) => (
            <div key={bounty.id} className="glass-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">{bounty.title}</h3>
                  {bounty.description && (
                    <p className="text-sm text-muted-foreground">{bounty.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Posted by {bounty.createdBy.name || "Unknown"}</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-semibold text-primary">{bounty.amount} credits</div>
                  <div
                    className={`text-xs font-semibold ${
                      bounty.status === "OPEN" ? "text-emerald-400" : "text-muted-foreground"
                    }`}
                  >
                    {bounty.status}
                  </div>
                </div>
              </div>

              {bounty.status === "OPEN" && (
                <div className="grid gap-3 md:grid-cols-[1fr_160px] items-center">
                  <select
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                    value={selectedCourses[bounty.id] || ""}
                    onChange={(e) =>
                      setSelectedCourses((prev) => ({ ...prev, [bounty.id]: e.target.value }))
                    }
                  >
                    <option value="">Select one of your published courses</option>
                    {myCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleFulfill(bounty.id)}
                    disabled={fulfillingId === bounty.id || myCourses.length === 0}
                    className="rounded-lg bg-primary text-black px-3 py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
                  >
                    {fulfillingId === bounty.id ? "Submitting..." : "Fulfill"}
                  </button>
                </div>
              )}

              {bounty.status === "CLOSED" && bounty.fulfilledCourse && (
                <p className="text-xs text-muted-foreground">
                  Fulfilled by {bounty.fulfilledBy?.name || "Unknown"} with "{bounty.fulfilledCourse.title}"
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="glass-card p-5 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Post a bounty</h2>
            {!canCreate && (
              <p className="text-sm text-muted-foreground mt-1">Sign in to post a bounty.</p>
            )}
          </div>
          <form className="space-y-3" onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!canCreate || submitting}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!canCreate || submitting}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              rows={3}
            />
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              disabled={!canCreate || submitting}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              placeholder="Amount (credits)"
              required
            />
            <button
              type="submit"
              disabled={!canCreate || submitting}
              className="w-full rounded-lg bg-primary text-black px-3 py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? "Posting..." : "Post bounty"}
            </button>
          </form>
          <p className="text-xs text-muted-foreground">
            Credits are deducted when you post. Fulfillment is automatic: the fulfiller is paid immediately and you receive course access.
          </p>
        </div>
      </div>
    </div>
  );
}
