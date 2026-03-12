import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Wallet, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Funds = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadPayments();
  }, [user]);

  const loadPayments = async () => {
    const { data } = await supabase.from("fund_payments")
      .select("*, fund_events(*)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setPayments(data);
    setLoading(false);
  };

  const totalPending = payments.filter(p => p.status !== "paid").reduce((s, p) => s + (p.amount || 0), 0);
  const totalPaid = payments.filter(p => p.status === "paid").reduce((s, p) => s + (p.amount || 0), 0);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Fund Collection</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center bg-secondary">
            <p className="text-xs text-muted-foreground">Your Pending</p>
            <p className="text-xl font-bold text-destructive mt-1">₹{totalPending.toLocaleString()}</p>
          </Card>
          <Card className="p-4 text-center bg-secondary">
            <p className="text-xs text-muted-foreground">Total Paid</p>
            <p className="text-xl font-bold text-primary mt-1">₹{totalPaid.toLocaleString()}</p>
          </Card>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No fund events yet</p>
          </div>
        ) : (
          payments.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground text-sm">{p.fund_events?.title}</h3>
                  <Badge variant={p.status === "paid" ? "secondary" : "destructive"} className="text-[10px]">
                    {p.status === "paid" ? <><CheckCircle className="w-3 h-3 mr-0.5" /> Paid</> : <><AlertCircle className="w-3 h-3 mr-0.5" /> {p.status}</>}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Amount: <span className="font-semibold text-foreground">₹{p.amount || "—"}</span></p>
                    {p.fund_events?.due_date && <p className="text-[10px] text-muted-foreground">Due: {new Date(p.fund_events.due_date).toLocaleDateString()}</p>}
                  </div>
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

export default Funds;
