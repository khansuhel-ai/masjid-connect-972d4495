import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle, XCircle, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface PaymentRow {
  id: string;
  user_id: string;
  amount: number | null;
  status: "paid" | "unpaid" | "pending";
  user_name: string;
  user_phone: string | null;
}

const FundCollectionManage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user || !eventId) return;
    loadData();
  }, [user, eventId]);

  const loadData = async () => {
    const [eventRes, paymentsRes] = await Promise.all([
      supabase.from("fund_events").select("*").eq("id", eventId!).single(),
      supabase.from("fund_payments").select("*").eq("fund_event_id", eventId!),
    ]);

    if (eventRes.data) setEvent(eventRes.data);

    if (paymentsRes.data) {
      // Get user profiles
      const userIds = paymentsRes.data.map(p => p.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, phone").in("user_id", userIds);
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const rows: PaymentRow[] = paymentsRes.data.map(p => ({
        id: p.id,
        user_id: p.user_id,
        amount: p.amount,
        status: p.status,
        user_name: profileMap.get(p.user_id)?.full_name || "Unknown",
        user_phone: profileMap.get(p.user_id)?.phone || null,
      }));
      setPayments(rows);
      
      const amtMap: Record<string, string> = {};
      rows.forEach(r => { amtMap[r.id] = r.amount?.toString() || ""; });
      setAmounts(amtMap);
    }
    setLoading(false);
  };

  const toggleStatus = async (paymentId: string, newStatus: "paid" | "unpaid") => {
    setUpdating(paymentId);
    try {
      const amt = amounts[paymentId] ? parseFloat(amounts[paymentId]) : null;
      const { error } = await supabase.from("fund_payments").update({
        status: newStatus,
        amount: amt,
        marked_by: user!.id,
        paid_at: newStatus === "paid" ? new Date().toISOString() : null,
      }).eq("id", paymentId);
      if (error) throw error;
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: newStatus, amount: amt } : p));
      toast.success(`Marked as ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const paidCount = payments.filter(p => p.status === "paid").length;
  const totalCollected = payments.filter(p => p.status === "paid").reduce((s, p) => s + (p.amount || 0), 0);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-6">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground truncate">{event?.title || "Fund Collection"}</h1>
        </div>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto w-full space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3 text-center">
            <p className="text-xl font-bold text-foreground">{payments.length}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-bold text-primary">{paidCount}</p>
            <p className="text-[10px] text-muted-foreground">Paid</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-bold text-destructive">{payments.length - paidCount}</p>
            <p className="text-[10px] text-muted-foreground">Unpaid</p>
          </Card>
        </div>

        <Card className="p-3 bg-primary text-primary-foreground text-center">
          <p className="text-xs text-primary-foreground/70">Total Collected</p>
          <p className="text-2xl font-bold">₹{totalCollected.toLocaleString()}</p>
        </Card>

        {/* Payment List */}
        <div className="space-y-2">
          {payments.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.user_name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.user_phone || "No phone"}</p>
                  </div>
                  <Badge variant={p.status === "paid" ? "secondary" : "destructive"} className="text-[10px]">
                    {p.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={amounts[p.id] || ""}
                    onChange={e => setAmounts(prev => ({ ...prev, [p.id]: e.target.value }))}
                    className="h-8 rounded-lg text-xs flex-1"
                  />
                  {p.status !== "paid" ? (
                    <Button size="sm" className="h-8 text-xs gap-1" onClick={() => toggleStatus(p.id, "paid")} disabled={updating === p.id}>
                      {updating === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />} Paid
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="h-8 text-xs gap-1 text-destructive" onClick={() => toggleStatus(p.id, "unpaid")} disabled={updating === p.id}>
                      {updating === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />} Undo
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FundCollectionManage;
