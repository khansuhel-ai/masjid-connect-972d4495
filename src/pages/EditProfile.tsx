import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [masjids, setMasjids] = useState<{ id: string; name: string; city: string }[]>([]);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    whatsapp_number: "",
    alternate_phone: "",
    city: "",
    masjid_id: "",
  });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    const [profileRes, masjidRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user!.id).single(),
      supabase.from("masjids").select("id, name, city"),
    ]);
    if (profileRes.data) {
      const p = profileRes.data;
      setForm({
        full_name: p.full_name || "",
        phone: p.phone || "",
        whatsapp_number: p.whatsapp_number || "",
        alternate_phone: p.alternate_phone || "",
        city: p.city || "",
        masjid_id: p.masjid_id || "",
      });
    }
    if (masjidRes.data) setMasjids(masjidRes.data);
    setFetching(false);
  };

  const updateField = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.full_name.trim()) { toast.error("Name is required"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").update({
        full_name: form.full_name,
        phone: form.phone || null,
        whatsapp_number: form.whatsapp_number || null,
        alternate_phone: form.alternate_phone || null,
        city: form.city || null,
        masjid_id: form.masjid_id || null,
      }).eq("user_id", user!.id);
      if (error) throw error;
      toast.success("Profile updated!");
      navigate("/profile");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Edit Profile</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Field label="Full Name *" value={form.full_name} onChange={v => updateField("full_name", v)} placeholder="Full name" />
          <Field label="Phone" value={form.phone} onChange={v => updateField("phone", v)} placeholder="Phone number" />
          <Field label="WhatsApp" value={form.whatsapp_number} onChange={v => updateField("whatsapp_number", v)} placeholder="WhatsApp number" />
          <Field label="Alternate Phone" value={form.alternate_phone} onChange={v => updateField("alternate_phone", v)} placeholder="Alternate phone" />
          <Field label="City" value={form.city} onChange={v => updateField("city", v)} placeholder="City" />

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Masjid</Label>
            <Select value={form.masjid_id} onValueChange={v => updateField("masjid_id", v)}>
              <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select masjid" /></SelectTrigger>
              <SelectContent>
                {masjids.map(m => <SelectItem key={m.id} value={m.id}>{m.name}, {m.city}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full h-12 rounded-xl text-base font-semibold gap-2" onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) => (
  <div className="space-y-2">
    <Label className="text-foreground font-medium">{label}</Label>
    <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="h-12 rounded-xl" />
  </div>
);

export default EditProfile;
