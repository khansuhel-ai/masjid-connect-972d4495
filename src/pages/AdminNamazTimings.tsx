import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const prayers = ["fajr", "zuhr", "asr", "maghrib", "isha"] as const;
const prayerLabels: Record<string, string> = { fajr: "Fajr", zuhr: "Zuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha" };

const AdminNamazTimings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masjidId, setMasjidId] = useState<string | null>(null);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [timings, setTimings] = useState<Record<string, string>>({
    fajr: "05:00", zuhr: "12:30", asr: "16:00", maghrib: "18:30", isha: "20:00",
  });

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const { data: role } = await supabase.from("user_roles")
      .select("masjid_id, role")
      .eq("user_id", user!.id)
      .eq("is_active", true)
      .eq("is_approved", true)
      .in("role", ["motaballi", "imam"])
      .limit(1)
      .single();

    if (!role?.masjid_id) { setLoading(false); return; }
    setMasjidId(role.masjid_id);

    const { data: existing } = await supabase.from("namaz_timings")
      .select("*")
      .eq("masjid_id", role.masjid_id)
      .single();

    if (existing) {
      setExistingId(existing.id);
      setTimings({
        fajr: existing.fajr, zuhr: existing.zuhr, asr: existing.asr,
        maghrib: existing.maghrib, isha: existing.isha,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (existingId) {
        const { error } = await supabase.from("namaz_timings").update({
          ...timings, updated_by: user!.id,
        }).eq("id", existingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("namaz_timings").insert([{
          fajr: timings.fajr, zuhr: timings.zuhr, asr: timings.asr,
          maghrib: timings.maghrib, isha: timings.isha,
          masjid_id: masjidId!, updated_by: user!.id,
        }]);
        if (error) throw error;
      }
      toast.success("Timings updated!");
      navigate(-1);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Update Namaz Timings</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-4">
        {prayers.map((prayer, i) => (
          <motion.div key={prayer} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <Label className="text-sm font-semibold text-foreground">{prayerLabels[prayer]}</Label>
                </div>
                <Input
                  type="time"
                  value={timings[prayer]}
                  onChange={e => setTimings(prev => ({ ...prev, [prayer]: e.target.value }))}
                  className="w-32 h-10 rounded-lg text-center"
                />
              </div>
            </Card>
          </motion.div>
        ))}

        <Button className="w-full h-12 rounded-xl text-base font-semibold gap-2" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving..." : "Save Timings"}
        </Button>
      </div>
    </div>
  );
};

export default AdminNamazTimings;
