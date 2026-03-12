import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Loader2, Megaphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AdminAnnouncements = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });
  const [masjidId, setMasjidId] = useState<string | null>(null);

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

    const { data } = await supabase.from("announcements")
      .select("*")
      .eq("masjid_id", role.masjid_id)
      .order("created_at", { ascending: false });

    if (data) setAnnouncements(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.body.trim()) { toast.error("Fill all fields"); return; }
    setCreating(true);
    try {
      const { error } = await supabase.from("announcements").insert({
        title: form.title,
        body: form.body,
        masjid_id: masjidId!,
        created_by: user!.id,
      });
      if (error) throw error;
      toast.success("Announcement posted!");
      setForm({ title: "", body: "" });
      setOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Announcements</h1>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1 h-8"><Plus className="w-3.5 h-3.5" /> New</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Announcement</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Body *</Label>
                  <Textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Announcement details" className="rounded-xl" rows={4} />
                </div>
                <Button className="w-full h-11 rounded-xl" onClick={handleCreate} disabled={creating}>
                  {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {creating ? "Posting..." : "Post Announcement"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto w-full space-y-3">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No announcements yet</p>
          </div>
        ) : (
          announcements.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4">
                <h3 className="font-semibold text-foreground text-sm mb-1">{a.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.body}</p>
                <p className="text-[10px] text-muted-foreground mt-2">{new Date(a.created_at).toLocaleDateString()}</p>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
