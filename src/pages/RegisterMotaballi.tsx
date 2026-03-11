import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const RegisterMotaballi = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [masjids, setMasjids] = useState<{ id: string; name: string; city: string }[]>([]);
  const [createNew, setCreateNew] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    whatsapp_number: "",
    city: "",
    masjid_id: "",
    // New masjid fields
    new_masjid_name: "",
    new_masjid_city: "",
    new_masjid_address: "",
  });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadMasjids();
    setForm(f => ({ ...f, phone: user.phone || "" }));
  }, [user]);

  const loadMasjids = async () => {
    const { data } = await supabase.from("masjids").select("id, name, city");
    if (data) setMasjids(data);
  };

  const updateField = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.full_name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      let masjidId = form.masjid_id;

      // Create new masjid if needed
      if (createNew) {
        if (!form.new_masjid_name.trim() || !form.new_masjid_city.trim()) {
          toast.error("Please fill in masjid name and city");
          setLoading(false);
          return;
        }
        const { data: newMasjid, error } = await supabase.from("masjids").insert({
          name: form.new_masjid_name,
          city: form.new_masjid_city,
          address: form.new_masjid_address || null,
        }).select().single();

        if (error) throw error;
        masjidId = newMasjid.id;
      }

      if (!masjidId) {
        toast.error("Please select or create a masjid");
        setLoading(false);
        return;
      }

      // Update profile
      await supabase.from("profiles").update({
        full_name: form.full_name,
        phone: form.phone,
        whatsapp_number: form.whatsapp_number || null,
        city: form.city || null,
        masjid_id: masjidId,
      }).eq("user_id", user!.id);

      // Insert role (motaballi auto-approved for now)
      await supabase.from("user_roles").insert({
        user_id: user!.id,
        role: "motaballi" as any,
        masjid_id: masjidId,
        is_active: true,
        is_approved: true,
      });

      toast.success("Motaballi registration complete!");
      navigate("/dashboard");
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
          <Building2 className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">Motaballi Registration</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pb-8">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">Personal Details</h3>
            <div>
              <Label className="text-foreground font-medium">Full Name *</Label>
              <Input value={form.full_name} onChange={e => updateField("full_name", e.target.value)} placeholder="Enter full name" className="h-12 rounded-xl mt-1" />
            </div>
            <div>
              <Label className="text-foreground font-medium">Phone Number</Label>
              <Input value={form.phone} onChange={e => updateField("phone", e.target.value)} placeholder="Phone" className="h-12 rounded-xl mt-1" />
            </div>
            <div>
              <Label className="text-foreground font-medium">WhatsApp Number</Label>
              <Input value={form.whatsapp_number} onChange={e => updateField("whatsapp_number", e.target.value)} placeholder="WhatsApp number" className="h-12 rounded-xl mt-1" />
            </div>
            <div>
              <Label className="text-foreground font-medium">City</Label>
              <Input value={form.city} onChange={e => updateField("city", e.target.value)} placeholder="Your city" className="h-12 rounded-xl mt-1" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm font-bold text-foreground">Masjid</h3>
              <button
                onClick={() => setCreateNew(!createNew)}
                className="flex items-center gap-1 text-xs text-primary font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                {createNew ? "Select existing" : "Create new"}
              </button>
            </div>

            {createNew ? (
              <div className="space-y-3">
                <div>
                  <Label className="text-foreground font-medium">Masjid Name *</Label>
                  <Input value={form.new_masjid_name} onChange={e => updateField("new_masjid_name", e.target.value)} placeholder="e.g. Masjid Al-Noor" className="h-12 rounded-xl mt-1" />
                </div>
                <div>
                  <Label className="text-foreground font-medium">City *</Label>
                  <Input value={form.new_masjid_city} onChange={e => updateField("new_masjid_city", e.target.value)} placeholder="City" className="h-12 rounded-xl mt-1" />
                </div>
                <div>
                  <Label className="text-foreground font-medium">Address</Label>
                  <Textarea value={form.new_masjid_address} onChange={e => updateField("new_masjid_address", e.target.value)} placeholder="Full address" className="rounded-xl mt-1" />
                </div>
              </div>
            ) : (
              <Select value={form.masjid_id} onValueChange={v => updateField("masjid_id", v)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select a masjid" />
                </SelectTrigger>
                <SelectContent>
                  {masjids.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name}, {m.city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Button className="w-full h-12 rounded-xl text-base font-semibold gap-2" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Building2 className="w-5 h-5" />}
            {loading ? "Registering..." : "Complete Registration"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterMotaballi;
