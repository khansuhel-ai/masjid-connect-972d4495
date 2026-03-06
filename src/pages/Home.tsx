import { motion } from "framer-motion";
import { Clock, Megaphone, Wallet, FileText, Bell, ChevronRight, Sun, Sunset, Moon, CloudSun, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const namazTimings = [
  { name: "Fajr", time: "5:15 AM", icon: Moon, isNext: false },
  { name: "Zuhr", time: "12:30 PM", icon: Sun, isNext: false },
  { name: "Asr", time: "4:00 PM", icon: CloudSun, isNext: true },
  { name: "Maghrib", time: "6:25 PM", icon: Sunset, isNext: false },
  { name: "Isha", time: "7:45 PM", icon: Star, isNext: false },
];

const announcements = [
  { id: 1, title: "Jumu'ah Khutbah Topic", body: "This Friday's khutbah will be on 'Patience in times of trials'", time: "2h ago" },
  { id: 2, title: "Madrasa Admissions Open", body: "Register your children for the new Madrasa session starting next month", time: "1d ago" },
];

const pendingFund = { title: "Masjid Renovation Fund", amount: 500, dueDate: "March 15, 2026" };

const imamPosts = [
  { id: 1, title: "Importance of Tahajjud", preview: "The Prophet ﷺ said: The best prayer after the obligatory prayer is...", time: "5h ago" },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-foreground/70 text-sm">Assalamu Alaikum</p>
              <h1 className="text-xl font-bold text-primary-foreground">Ahmed Khan</h1>
            </div>
            <button className="relative p-2 rounded-xl bg-primary-foreground/10" onClick={() => navigate("/announcements")}>
              <Bell className="w-5 h-5 text-primary-foreground" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-destructive-foreground font-bold">3</span>
            </button>
          </div>
          <Card className="bg-primary-foreground/10 border-none backdrop-blur-sm p-3">
            <p className="text-primary-foreground/70 text-xs mb-1">Current Masjid</p>
            <p className="text-primary-foreground font-semibold text-sm">Masjid Al-Noor, Delhi</p>
          </Card>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto -mt-4 space-y-5">
        {/* Namaz Timings */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionHeader title="Today's Namaz Timings" icon={Clock} onSeeAll={() => navigate("/namaz")} />
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
            {namazTimings.map((n) => (
              <Card key={n.name} className={`min-w-[90px] p-3 text-center border ${n.isNext ? "border-primary bg-secondary" : "border-border"}`}>
                <n.icon className={`w-5 h-5 mx-auto mb-1.5 ${n.isNext ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`text-xs font-medium mb-0.5 ${n.isNext ? "text-primary" : "text-muted-foreground"}`}>{n.name}</p>
                <p className={`text-sm font-bold ${n.isNext ? "text-primary" : "text-foreground"}`}>{n.time}</p>
                {n.isNext && <Badge variant="secondary" className="mt-1.5 text-[10px] px-1.5 py-0 bg-primary text-primary-foreground">Next</Badge>}
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Pending Fund */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SectionHeader title="Pending Payment" icon={Wallet} onSeeAll={() => navigate("/funds")} />
          <Card className="p-4 border-primary/20 bg-gold-light border cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/funds")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground text-sm">{pendingFund.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Due: {pendingFund.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">₹{pendingFund.amount}</p>
                <Badge variant="outline" className="text-[10px] border-destructive text-destructive">Pending</Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Announcements */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <SectionHeader title="Announcements" icon={Megaphone} onSeeAll={() => navigate("/announcements")} />
          <div className="space-y-2">
            {announcements.map((a) => (
              <Card key={a.id} className="p-4 cursor-pointer hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{a.time}</span>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Imam Posts */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <SectionHeader title="Imam Posts" icon={FileText} onSeeAll={() => navigate("/posts")} />
          {imamPosts.map((p) => (
            <Card key={p.id} className="p-4 cursor-pointer hover:shadow-sm transition-shadow">
              <p className="font-semibold text-foreground text-sm">{p.title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.preview}</p>
              <p className="text-[10px] text-muted-foreground mt-2">{p.time}</p>
            </Card>
          ))}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

const SectionHeader = ({ title, icon: Icon, onSeeAll }: { title: string; icon: React.ElementType; onSeeAll: () => void }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary" />
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
    </div>
    <button onClick={onSeeAll} className="flex items-center gap-0.5 text-xs text-primary font-medium">
      See all <ChevronRight className="w-3.5 h-3.5" />
    </button>
  </div>
);

export default HomePage;
