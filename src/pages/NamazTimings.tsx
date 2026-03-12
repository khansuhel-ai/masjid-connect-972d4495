import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sun, Sunset, Moon, CloudSun, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const prayerMeta: Record<string, { icon: React.ElementType; color: string }> = {
  fajr: { icon: Moon, color: "from-indigo-500/10 to-purple-500/10" },
  zuhr: { icon: Sun, color: "from-amber-500/10 to-yellow-500/10" },
  asr: { icon: CloudSun, color: "from-orange-500/10 to-amber-500/10" },
  maghrib: { icon: Sunset, color: "from-rose-500/10 to-orange-500/10" },
  isha: { icon: Star, color: "from-slate-500/10 to-indigo-500/10" },
};

const prayerNames: Record<string, string> = { fajr: "Fajr", zuhr: "Zuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha" };

const formatTime = (t: string) => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
};

const NamazTimings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timings, setTimings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadTimings();
  }, [user]);

  const loadTimings = async () => {
    const { data: profile } = await supabase.from("profiles").select("masjid_id").eq("user_id", user!.id).single();
    if (profile?.masjid_id) {
      const { data } = await supabase.from("namaz_timings").select("*").eq("masjid_id", profile.masjid_id).single();
      setTimings(data);
    }
    setLoading(false);
  };

  const prayerOrder = ["fajr", "zuhr", "asr", "maghrib", "isha"];

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
          <h1 className="text-lg font-semibold text-foreground">Namaz Timings</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-3">
        <Card className="p-4 bg-secondary border-primary/20">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="font-semibold text-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </Card>

        {!timings ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No timings set for your masjid yet</p>
          </div>
        ) : (
          prayerOrder.map((key, i) => {
            const meta = prayerMeta[key];
            const Icon = meta.icon;
            return (
              <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{prayerNames[key]}</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">{formatTime(timings[key])}</p>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default NamazTimings;
