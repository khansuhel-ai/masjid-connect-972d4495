import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Megaphone, Wallet, FileText, Bell, ChevronRight, Sun, Sunset, Moon, CloudSun, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const prayerIcons: Record<string, React.ElementType> = { fajr: Moon, zuhr: Sun, asr: CloudSun, maghrib: Sunset, isha: Star };
const prayerNames: Record<string, string> = { fajr: "Fajr", zuhr: "Zuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha" };

const formatTime = (t: string) => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  const ampm = hr >= 12 ? "PM" : "AM";
  return `${hr % 12 || 12}:${m} ${ampm}`;
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [masjid, setMasjid] = useState<any>(null);
  const [timings, setTimings] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      setProfile(p);

      if (p?.masjid_id) {
        const [masjidRes, timingsRes, announcementsRes] = await Promise.all([
          supabase.from("masjids").select("*").eq("id", p.masjid_id).single(),
          supabase.from("namaz_timings").select("*").eq("masjid_id", p.masjid_id).single(),
          supabase.from("announcements").select("*").eq("masjid_id", p.masjid_id).eq("is_active", true).order("created_at", { ascending: false }).limit(3),
        ]);
        if (masjidRes.data) setMasjid(masjidRes.data);
        if (timingsRes.data) setTimings(timingsRes.data);
        if (announcementsRes.data) setAnnouncements(announcementsRes.data);

        // Pending fund payments
        const { data: payments } = await supabase.from("fund_payments")
          .select("*, fund_events(*)")
          .eq("user_id", user!.id)
          .eq("status", "unpaid");
        if (payments) setPendingPayments(payments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const prayerOrder = ["fajr", "zuhr", "asr", "maghrib", "isha"];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-foreground/70 text-sm">Assalamu Alaikum</p>
              <h1 className="text-xl font-bold text-primary-foreground">{profile?.full_name || "User"}</h1>
            </div>
            <button className="relative p-2 rounded-xl bg-primary-foreground/10" onClick={() => navigate("/announcements")}>
              <Bell className="w-5 h-5 text-primary-foreground" />
              {announcements.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-destructive-foreground font-bold">{announcements.length}</span>
              )}
            </button>
          </div>
          {masjid && (
            <Card className="bg-primary-foreground/10 border-none backdrop-blur-sm p-3">
              <p className="text-primary-foreground/70 text-xs mb-1">Current Masjid</p>
              <p className="text-primary-foreground font-semibold text-sm">{masjid.name}, {masjid.city}</p>
            </Card>
          )}
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto -mt-4 space-y-5">
        {/* Namaz Timings */}
        {timings && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SectionHeader title="Today's Namaz Timings" icon={Clock} onSeeAll={() => navigate("/namaz")} />
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
              {prayerOrder.map(key => {
                const Icon = prayerIcons[key];
                return (
                  <Card key={key} className="min-w-[90px] p-3 text-center border border-border">
                    <Icon className="w-5 h-5 mx-auto mb-1.5 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">{prayerNames[key]}</p>
                    <p className="text-sm font-bold text-foreground">{formatTime(timings[key])}</p>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SectionHeader title="Pending Payments" icon={Wallet} onSeeAll={() => navigate("/funds")} />
            {pendingPayments.slice(0, 2).map(p => (
              <Card key={p.id} className="p-4 border-primary/20 mb-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/funds")}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{p.fund_events?.title}</p>
                    {p.fund_events?.due_date && <p className="text-xs text-muted-foreground mt-0.5">Due: {new Date(p.fund_events.due_date).toLocaleDateString()}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₹{p.amount || "—"}</p>
                    <Badge variant="outline" className="text-[10px] border-destructive text-destructive">Pending</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Announcements */}
        {announcements.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <SectionHeader title="Announcements" icon={Megaphone} onSeeAll={() => navigate("/announcements")} />
            <div className="space-y-2">
              {announcements.map(a => (
                <Card key={a.id} className="p-4 cursor-pointer hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
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
