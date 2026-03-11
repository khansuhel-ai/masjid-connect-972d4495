import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const RegisterUser = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [masjids, setMasjids] = useState<{ id: string; name: string; city: string }[]>([]);
  const [form, setForm] = useState({
    full_name: "",
    city: "",
    masjid_id: "",
  });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadMasjids();
  }, [user]);

  const loadMasjids = async () => {
    const { data } = await supabase.from("masjids").select("id, name, city");
    if (data) setMasjids(data);
  };

  const updateField = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.full_name.trim() || !form.masjid_id) {
      toast.error("Please fill in name and select a masjid");
      return;
    }
    setLoading(true);
    try {
      await supabase.from("profiles").update({
        full_name: form.full_name,
        city: form.city || null,
        masjid_id: form.masjid_id,
      }).eq("user_id", user!.id);

      await supabase.from("user_roles").insert({
        user_id: user!.id,
        role: "user" as any,
        masjid_id: form.masjid_id,
        is_active: true,
        is_approved: true, // Users auto-approved
      });

      toast.success("Welcome to MasjidConnect!");
      navigate("/home");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">User Registration</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Full Name *</Label>
            <Input value={form.full_name} onChange={e => updateField("full_name", e.target.value)} placeholder="Enter your full name" className="h-12 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">City</Label>
            <Input value={form.city} onChange={e => updateField("city", e.target.value)} placeholder="Your city" className="h-12 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Select Masjid *</Label>
            <Select value={form.masjid_id} onValueChange={v => updateField("masjid_id", v)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Choose your masjid" />
              </SelectTrigger>
              <SelectContent>
                {masjids.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name}, {m.city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full h-12 rounded-xl text-base font-semibold gap-2" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
            {loading ? "Registering..." : "Complete Registration"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterUser;
