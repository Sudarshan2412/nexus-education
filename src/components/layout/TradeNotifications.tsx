"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Loader2, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TradeWithCourses {
  id: string;
  status: string;
  requesterCourse: { id: string; title: string };
  recipientCourse: { id: string; title: string };
  requester?: { name?: string | null; email?: string | null };
  recipient?: { name?: string | null; email?: string | null };
  createdAt?: string;
}

export function TradeNotifications() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [incoming, setIncoming] = useState<TradeWithCourses[]>([]);
  const [outgoing, setOutgoing] = useState<TradeWithCourses[]>([]);
  const [incomingCount, setIncomingCount] = useState(0);

  const loadSummary = async () => {
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
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [session]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      loadTrades();
    }
  };

  const respond = async (tradeId: string, action: "accept" | "decline") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/trades/${tradeId}/${action}`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || `Failed to ${action} trade`);
      }
      await loadTrades();
      await loadSummary();
    } catch (error) {
      console.error(`Failed to ${action} trade`, error);
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) return null;

  return (
    <div className="relative z-[200]">
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-secondary/50 transition-all"
      >
        <Bell className="w-6 h-6" />
        {incomingCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-bold rounded-full px-2 py-0.5">
            {incomingCount}
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
                <p className="text-sm font-semibold text-foreground">Trades</p>
                <p className="text-xs text-muted-foreground">Incoming & outgoing requests</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-secondary/40 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              <section>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Incoming</p>
                {loading ? (
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
                            disabled={loading}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-black text-xs font-bold uppercase tracking-wider"
                          >
                            <Check className="w-4 h-4" /> Accept
                          </button>
                          <button
                            onClick={() => respond(trade.id, "decline")}
                            disabled={loading}
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
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Outgoing</p>
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
                ) : outgoing.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No outgoing trades.</p>
                ) : (
                  <div className="space-y-3">
                    {outgoing.map((trade) => (
                      <div key={trade.id} className="p-3 rounded-xl border border-border/50">
                        <p className="text-sm text-foreground font-semibold">{trade.requesterCourse.title}</p>
                        <p className="text-xs text-muted-foreground">for</p>
                        <p className="text-sm text-primary font-semibold">{trade.recipientCourse.title}</p>
                        <p className="text-xs text-muted-foreground mt-2">Status: {trade.status}</p>
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
