"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationItem {
  id: string;
  seen: boolean;
  createdAt: string;
  bounty: {
    title: string;
    amount: number;
    fulfilledCourse?: { title: string } | null;
  };
}

export function BountyNotifications() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);

  const loadSummary = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/bounties/notifications?summary=1");
      if (res.ok) {
        const data = await res.json();
        setUnseenCount(data.unseenCount || 0);
      }
    } catch (error) {
      console.error("Failed to load bounty notification summary", error);
    }
  };

  const loadNotifications = async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/bounties/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to load bounty notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [session]);

  const markAllRead = async () => {
    try {
      await fetch("/api/bounties/notifications", { method: "POST" });
      setUnseenCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
    } catch (error) {
      console.error("Failed to mark bounty notifications read", error);
    }
  };

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      loadNotifications();
      markAllRead();
    }
  };

  if (!session?.user) return null;

  return (
    <div className="relative z-[200]">
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full hover:bg-secondary/50 transition-all"
      >
        <Bell className="w-6 h-6" />
        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-bold rounded-full px-2 py-0.5">
            {unseenCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-3 w-[360px] max-h-[70vh] overflow-hidden rounded-2xl border border-border/50 bg-background/95 shadow-xl backdrop-blur z-[201]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div>
                <p className="text-sm font-semibold text-foreground">Bounties</p>
                <p className="text-xs text-muted-foreground">Completed bounties you posted</p>
              </div>
              <button onClick={toggleOpen} className="p-1 hover:bg-secondary/40 rounded-lg">
                <Check className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No bounty completions yet.</p>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-border/50 bg-black/30"
                  >
                    <p className="text-sm text-foreground font-semibold">{item.bounty.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Completed · {item.bounty.amount} credits paid · Course: {item.bounty.fulfilledCourse?.title || "(course)"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
