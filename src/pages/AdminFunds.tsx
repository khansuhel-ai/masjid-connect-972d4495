import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Loader2, ChevronRight, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AdminFunds = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadEvents();
  }, [user]);

  const loadEvents = async () => {
    const { data: role } = await supabase.from("user_roles")
      .select("masjid_id")
      .eq("user_id", user!.id)
      .eq("role", "motaballi")
      .eq("is_active", true)
      .single();

    if (!role?.masjid_id) { setLoading(false); return; }

    const { data: evts } = await supabase.from("fund_events")
      .select("*")
      .eq("masjid_id", role.masjid_id)
      .order("created_at", { ascending: false });

    if (evts) {
      // Get payment stats for each event
      const enriched = await Promise.all(evts.map(async evt => {
        const { data: payments } = await supabase.from("fund_payments")
          .select("status, amount")
          .eq("fund_event_id", evt.id);
        const total = payments?.length || 0;
        const paid = payments?.filter(p => p.status === "paid").length || 0;
        const collected = payments?.filter(p => p.status === "paid").reduce((s, p) => s + (p.amount || 0), 0) || 0;
        return { ...evt, total, paid, collected };
      }));
      setEvents(enriched);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Fund Events</h1>
          </div>
          <Button size="sm" className="gap-1 h-8" onClick={() => navigate("/admin/funds/create")}>
            <Plus className="w-3.5 h-3.5" /> New
          </Button>
        </div>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto w-full space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No fund events yet</p>
            <Button className="mt-4" onClick={() => navigate("/admin/funds/create")}>Create First Event</Button>
          </div>
        ) : (
          events.map((evt, i) => (
            <motion.div key={evt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/admin/funds/${evt.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground text-sm">{evt.title}</h3>
                  <Badge variant={evt.is_active ? "secondary" : "outline"} className="text-[10px]">
                    {evt.is_active ? "Active" : "Closed"}
                  </Badge>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{evt.paid}/{evt.total} paid</span>
                    <span>₹{evt.collected?.toLocaleString()}</span>
                  </div>
                  <Progress value={evt.total > 0 ? (evt.paid / evt.total) * 100 : 0} className="h-2" />
                </div>
                {evt.due_date && <p className="text-[10px] text-muted-foreground">Due: {new Date(evt.due_date).toLocaleDateString()}</p>}
                <div className="flex items-center justify-end mt-2">
                  <span className="text-xs text-primary font-medium flex items-center gap-0.5">
                    Manage <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default AdminFunds;
