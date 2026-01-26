"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Repeat, Sparkles } from "lucide-react";

interface TradeCourseOption {
  id: string;
  title: string;
}

interface CourseAccessActionsProps {
  courseId: string;
  price: number;
  isEnrolled: boolean;
  userCredits: number;
  userTradeCourses: TradeCourseOption[];
}

export function CourseAccessActions({
  courseId,
  price,
  isEnrolled,
  userCredits,
  userTradeCourses,
}: CourseAccessActionsProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState(
    userTradeCourses[0]?.id || "",
  );
  const [credits, setCredits] = useState(userCredits);

  const canTrade = useMemo(
    () => userTradeCourses.length > 0,
    [userTradeCourses],
  );

  const handleBuy = async () => {
    setProcessing(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/courses/${courseId}/purchase`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to purchase course");
      }
      setCredits(data.credits ?? credits);
      setMessage("Purchase successful. You now have access.");
      router.refresh();
    } catch (error: any) {
      setMessage(error.message || "Failed to purchase course");
    } finally {
      setProcessing(false);
    }
  };

  const handleTrade = async () => {
    if (!selectedCourseId) {
      setMessage("Select a course to offer");
      return;
    }
    setProcessing(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/trades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCourseId: courseId, offeredCourseId: selectedCourseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create trade");
      }
      setMessage("Trade request sent.");
    } catch (error: any) {
      setMessage(error.message || "Failed to send trade");
    } finally {
      setProcessing(false);
    }
  };

  if (isEnrolled) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Price: {price === 50 ? "50 credits" : "Free"}</span>
        <span>Your credits: {credits}</span>
      </div>

      {price === 50 ? (
        <div className="space-y-3">
          <button
            onClick={handleBuy}
            disabled={processing || credits < 50}
            className="w-full py-3 px-4 rounded-xl bg-primary text-black font-bold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Buy for 50 credits
          </button>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-widest">
              <Repeat className="w-4 h-4" /> Trade access with your course
            </div>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
              disabled={!canTrade || processing}
            >
              {userTradeCourses.length === 0 && (
                <option value="">No 50-credit published courses available</option>
              )}
              {userTradeCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleTrade}
              disabled={!canTrade || processing}
              className="w-full py-3 px-4 rounded-xl border border-border/50 text-white font-bold uppercase tracking-wider hover:border-primary/50 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Repeat className="w-4 h-4" />}
              Request Trade
            </button>
          </div>
        </div>
      ) : null}

      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
