"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Check, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Trade = {
  id: string;
  status: string;
  requesterCourse: { id: string; title: string };
  recipientCourse: { id: string; title: string };
};

type BountyNotification = {
  id: string;
  seen: boolean;
  createdAt: string;
  bounty: {
    title: string;
    amount: number;
    fulfilledCourse?: { title: string } | null;
  };
};

export function Notifications() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [loadingBounties, setLoadingBounties] = useState(false);
  const [incoming, setIncoming] = useState<Trade[]>([]);
  const [outgoing, setOutgoing] = useState<Trade[]>([]);
  const [incomingCount, setIncomingCount] = useState(0);
  const [bountyNotifications, setBountyNotifications] = useState<BountyNotification[]>([]);
  const [bountyUnseenCount, setBountyUnseenCount] = useState(0);

  const loadTradeSummary = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/trades?summary=1");
      if (res.ok) {
        const data = await res.json();
        setIncomingCount(data.incomingCount || 0);
      }
    } catch (error) {
      console.error("Failed to load trade summary", error);
    }
  };

  const loadTrades = async () => {
    if (!session?.user) return;
    setLoadingTrades(true);
    try {
      const res = await fetch("/api/trades");
      if (res.ok) {
        const data = await res.json();
        setIncoming(data.incoming || []);
        setOutgoing(data.outgoing || []);
      }
    } catch (error) {
      console.error("Failed to load trades", error);
    } finally {
      setLoadingTrades(false);
    }
  };

  const loadBountySummary = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/bounties/notifications?summary=1");
      if (res.ok) {
        const data = await res.json();
        setBountyUnseenCount(data.unseenCount || 0);
      }
    } catch (error) {
      console.error("Failed to load bounty summary", error);
    }
  };

  const loadBountyNotifications = async () => {
    if (!session?.user) return;
    setLoadingBounties(true);
    try {
      const res = await fetch("/api/bounties/notifications");
      if (res.ok) {
        const data = await res.json();
        setBountyNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to load bounty notifications", error);
    } finally {
      setLoadingBounties(false);
    }
  };

  const markBountiesRead = async () => {
    try {
      await fetch("/api/bounties/notifications", { method: "POST" });
      setBountyUnseenCount(0);
      setBountyNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
    } catch (error) {
      console.error("Failed to mark bounty notifications read", error);
    }
  };

  useEffect(() => {
    loadTradeSummary();
    loadBountySummary();
  }, [session]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      loadTrades();
      loadBountyNotifications();
      markBountiesRead();
    }
  };

  const respond = async (tradeId: string, action: "accept" | "decline") => {
    try {
      setLoadingTrades(true);
      const res = await fetch(`/api/trades/${tradeId}/${action}`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || `Failed to ${action} trade`);
      }
      await loadTrades();
      await loadTradeSummary();
    } catch (error) {
      console.error(`Failed to ${action} trade`, error);
    } finally {
      setLoadingTrades(false);
    }
  };

  if (!session?.user) return null;

  const badgeCount = incomingCount + bountyUnseenCount;

  return (
    <div className="relative z-[200]">
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-secondary/50 transition-all"
      >
        <Bell className="w-6 h-6" />
        {badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-bold rounded-full px-2 py-0.5">
            {badgeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-3 w-[380px] max-h-[75vh] overflow-hidden rounded-2xl border border-border/50 bg-background/95 shadow-xl backdrop-blur z-[201]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div>
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                <p className="text-xs text-muted-foreground">Trades & bounty completions</p>
              </div>
              <button onClick={handleToggle} className="p-1 hover:bg-secondary/40 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[68vh]">
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Trades</p>
                  <span className="text-[11px] text-muted-foreground">Incoming {incomingCount}</span>
                </div>
                {loadingTrades ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
                ) : incoming.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No incoming trades.</p>
                ) : (
                  <div className="space-y-3">
                    {incoming.map((trade) => (
                      <div key={trade.id} className="p-3 rounded-xl border border-border/50">
                        <p className="text-sm text-foreground font-semibold">{trade.requesterCourse.title}</p>
                        <p className="text-xs text-muted-foreground">offered for</p>
                        <p className="text-sm text-primary font-semibold">{trade.recipientCourse.title}</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => respond(trade.id, "accept")}
                            disabled={loadingTrades}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-black text-xs font-bold uppercase tracking-wider"
                          >
                            <Check className="w-4 h-4" /> Accept
                          </button>
                          <button
                            onClick={() => respond(trade.id, "decline")}
                            disabled={loadingTrades}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border/50 text-xs font-bold uppercase tracking-wider hover:border-destructive/40"
                          >
                            <X className="w-4 h-4" /> Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Bounties</p>
                  <span className="text-[11px] text-muted-foreground">Unseen {bountyUnseenCount}</span>
                </div>
                {loadingBounties ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
                ) : bountyNotifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No bounty completions yet.</p>
                ) : (
                  <div className="space-y-3">
                    {bountyNotifications.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl border border-border/50 bg-black/30">
                        <p className="text-sm text-foreground font-semibold">{item.bounty.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Completed · {item.bounty.amount} credits paid · Course: {item.bounty.fulfilledCourse?.title || "(course)"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
