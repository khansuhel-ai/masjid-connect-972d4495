import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Wallet, TrendingUp, Receipt, ChevronRight, Loader2, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const MotaballiDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, collected: 0, pending: 0, expenses: 0, pendingApprovals: 0, masjidName: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadStats();
  }, [user]);

  const loadStats = async () => {
    const { data: role } = await supabase.from("user_roles")
      .select("masjid_id")
      .eq("user_id", user!.id)
      .eq("role", "motaballi")
      .eq("is_active", true)
      .single();

    if (!role?.masjid_id) { setLoading(false); return; }

    const [masjidRes, usersRes, paymentsRes, expensesRes, approvalsRes] = await Promise.all([
      supabase.from("masjids").select("name").eq("id", role.masjid_id).single(),
      supabase.from("user_roles").select("id").eq("masjid_id", role.masjid_id).eq("is_active", true).eq("is_approved", true),
      supabase.from("fund_payments").select("status, amount, fund_event_id"),
      supabase.from("expenses").select("amount").eq("masjid_id", role.masjid_id),
      supabase.from("user_roles").select("id").eq("masjid_id", role.masjid_id).eq("is_approved", false).eq("is_active", true),
    ]);

    // Filter payments by masjid events
    const { data: events } = await supabase.from("fund_events").select("id").eq("masjid_id", role.masjid_id);
    const eventIds = new Set(events?.map(e => e.id) || []);
    const masjidPayments = paymentsRes.data?.filter(p => eventIds.has(p.fund_event_id)) || [];

    const collected = masjidPayments.filter(p => p.status === "paid").reduce((s, p) => s + (p.amount || 0), 0);
    const pendingAmt = masjidPayments.filter(p => p.status !== "paid").reduce((s, p) => s + (p.amount || 0), 0);
    const totalExpenses = expensesRes.data?.reduce((s, e) => s + Number(e.amount), 0) || 0;

    setStats({
      users: usersRes.data?.length || 0,
      collected,
      pending: pendingAmt,
      expenses: totalExpenses,
      pendingApprovals: approvalsRes.data?.length || 0,
      masjidName: masjidRes.data?.name || "",
    });
    setLoading(false);
  };

  const quickActions = [
    { label: "Pending Approvals", path: "/admin/approvals", badge: stats.pendingApprovals },
    { label: "Manage Funds", path: "/admin/funds" },
    { label: "Post Announcement", path: "/admin/announcements" },
    { label: "Manage Expenses", path: "/admin/expenses" },
    { label: "Update Namaz Timings", path: "/admin/namaz" },
  ];

  const statCards = [
    { icon: Users, label: "Total Users", value: stats.users.toString(), color: "text-primary bg-secondary" },
    { icon: Wallet, label: "Funds Collected", value: `₹${stats.collected.toLocaleString()}`, color: "text-primary bg-secondary" },
    { icon: TrendingUp, label: "Pending Funds", value: `₹${stats.pending.toLocaleString()}`, color: "text-destructive bg-destructive/10" },
    { icon: Receipt, label: "Total Expenses", value: `₹${stats.expenses.toLocaleString()}`, color: "text-accent bg-accent/10" },
  ];

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wider">Motaballi Dashboard</p>
          <h1 className="text-xl font-bold text-primary-foreground mt-1">{stats.masjidName || "My Masjid"}</h1>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto -mt-4 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-2`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="p-4 bg-primary text-primary-foreground">
          <p className="text-sm text-primary-foreground/70">Available Balance</p>
          <p className="text-2xl font-bold mt-1">₹{(stats.collected - stats.expenses).toLocaleString()}</p>
          <p className="text-xs text-primary-foreground/50 mt-1">Collected - Expenses</p>
        </Card>

        <div>
          <h2 className="text-sm font-bold text-foreground mb-3">Quick Actions</h2>
          <Card className="p-1">
            {quickActions.map((a) => (
              <button
                key={a.label}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
                onClick={() => navigate(a.path)}
              >
                <span className="text-sm font-medium text-foreground">{a.label}</span>
                <div className="flex items-center gap-2">
                  {a.badge ? <Badge variant="destructive" className="text-[10px] h-5 px-1.5">{a.badge}</Badge> : null}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MotaballiDashboard;
