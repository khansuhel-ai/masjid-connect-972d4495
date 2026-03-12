import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const CreateFundEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", fixed_amount: "", due_date: "",
  });

  const u = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleCreate = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setLoading(true);
    try {
      // Get motaballi's masjid
      const { data: role } = await supabase.from("user_roles")
        .select("masjid_id")
        .eq("user_id", user!.id)
        .eq("role", "motaballi")
        .eq("is_active", true)
        .single();

      if (!role?.masjid_id) { toast.error("No masjid assigned"); setLoading(false); return; }

      const { error } = await supabase.from("fund_events").insert({
        title: form.title,
        description: form.description || null,
        fixed_amount: form.fixed_amount ? parseFloat(form.fixed_amount) : null,
        due_date: form.due_date || null,
        masjid_id: role.masjid_id,
        created_by: user!.id,
      });
      if (error) throw error;

      // Create payment entries for all users of this masjid
      const { data: masjidUsers } = await supabase.from("user_roles")
        .select("user_id")
        .eq("masjid_id", role.masjid_id)
        .eq("is_active", true)
        .eq("is_approved", true);

      if (masjidUsers && masjidUsers.length > 0) {
        // Get the just-created event
        const { data: event } = await supabase.from("fund_events")
          .select("id")
          .eq("created_by", user!.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (event) {
          const payments = masjidUsers.map(u => ({
            fund_event_id: event.id,
            user_id: u.user_id,
            amount: form.fixed_amount ? parseFloat(form.fixed_amount) : null,
            status: "unpaid" as const,
          }));
          await supabase.from("fund_payments").insert(payments);
        }
      }

      toast.success("Fund event created!");
      navigate("/admin/funds");
    } catch (err: any) {
      toast.error(err.message || "Failed to create event");
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
          <h1 className="text-lg font-semibold text-foreground">Create Fund Event</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Event Title *</Label>
            <Input value={form.title} onChange={e => u("title", e.target.value)} placeholder="e.g. Masjid Renovation Fund" className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Description</Label>
            <Textarea value={form.description} onChange={e => u("description", e.target.value)} placeholder="Details about this fund event" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Fixed Amount (₹)</Label>
            <Input type="number" value={form.fixed_amount} onChange={e => u("fixed_amount", e.target.value)} placeholder="Leave empty for variable amounts" className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Due Date</Label>
            <Input type="date" value={form.due_date} onChange={e => u("due_date", e.target.value)} className="h-12 rounded-xl" />
          </div>

          <Button className="w-full h-12 rounded-xl text-base font-semibold gap-2" onClick={handleCreate} disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {loading ? "Creating..." : "Create Fund Event"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateFundEvent;
