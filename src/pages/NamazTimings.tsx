import { motion } from "framer-motion";
import { ArrowLeft, Sun, Sunset, Moon, CloudSun, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";

const timings = [
  { name: "Fajr", time: "5:15 AM", adhan: "5:10 AM", icon: Moon, color: "from-indigo-500/10 to-purple-500/10" },
  { name: "Zuhr", time: "12:30 PM", adhan: "12:25 PM", icon: Sun, color: "from-amber-500/10 to-yellow-500/10" },
  { name: "Asr", time: "4:00 PM", adhan: "3:55 PM", icon: CloudSun, color: "from-orange-500/10 to-amber-500/10", isNext: true },
  { name: "Maghrib", time: "6:25 PM", adhan: "6:25 PM", icon: Sunset, color: "from-rose-500/10 to-orange-500/10" },
  { name: "Isha", time: "7:45 PM", adhan: "7:40 PM", icon: Star, color: "from-slate-500/10 to-indigo-500/10" },
];

const NamazTimings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Namaz Timings</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-3">
        <Card className="p-4 bg-secondary border-primary/20">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="font-semibold text-foreground">Thursday, March 6, 2026</p>
          <p className="text-xs text-primary mt-1 font-arabic">٦ رمضان ١٤٤٧</p>
        </Card>

        {timings.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className={`p-4 flex items-center gap-4 ${t.isNext ? "border-primary ring-1 ring-primary/20" : ""}`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                <t.icon className={`w-6 h-6 ${t.isNext ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`font-semibold ${t.isNext ? "text-primary" : "text-foreground"}`}>{t.name}</p>
                  {t.isNext && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">Next</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Adhan: {t.adhan}</p>
              </div>
              <p className={`text-lg font-bold ${t.isNext ? "text-primary" : "text-foreground"}`}>{t.time}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default NamazTimings;
