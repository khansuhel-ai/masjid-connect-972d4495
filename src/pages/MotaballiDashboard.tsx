import { motion } from "framer-motion";
import { ArrowLeft, Users, Wallet, TrendingUp, Receipt, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";

const stats = [
  { icon: Users, label: "Total Users", value: "156", color: "text-primary bg-secondary" },
  { icon: Wallet, label: "Funds Collected", value: "₹87,500", color: "text-primary bg-secondary" },
  { icon: TrendingUp, label: "Pending Funds", value: "₹42,500", color: "text-destructive bg-destructive/10" },
  { icon: Receipt, label: "Total Expenses", value: "₹35,200", color: "text-cosmic bg-cosmic-light" },
];

const quickActions = [
  { label: "Add User", path: "/admin/users" },
  { label: "Create Fund Event", path: "/admin/funds" },
  { label: "Post Announcement", path: "/admin/announcements" },
  { label: "Manage Expenses", path: "/admin/expenses" },
  { label: "Approve Imams", path: "/admin/imams" },
  { label: "Update Namaz Timings", path: "/namaz" },
];

const MotaballiDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wider">Motaballi Dashboard</p>
          <h1 className="text-xl font-bold text-primary-foreground mt-1">Masjid Al-Noor</h1>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto -mt-4 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
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

        {/* Balance */}
        <Card className="p-4 bg-primary text-primary-foreground">
          <p className="text-sm text-primary-foreground/70">Available Balance</p>
          <p className="text-2xl font-bold mt-1">₹52,300</p>
          <p className="text-xs text-primary-foreground/50 mt-1">Collected - Expenses</p>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-bold text-foreground mb-3">Quick Actions</h2>
          <Card className="p-1">
            {quickActions.map((a, i) => (
              <button
                key={a.label}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium text-foreground">{a.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
