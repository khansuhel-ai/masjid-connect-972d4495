import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle, XCircle, User, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface PendingUser {
  id: string;
  user_id: string;
  role: "imam" | "motaballi" | "user";
  full_name: string;
  phone: string | null;
}

const AdminApprovals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadPending();
  }, [user]);

  const loadPending = async () => {
    const { data: role } = await supabase.from("user_roles")
      .select("masjid_id")
      .eq("user_id", user!.id)
      .eq("role", "motaballi")
      .eq("is_active", true)
      .single();

    if (!role?.masjid_id) { setLoading(false); return; }

    const { data: pendingRoles } = await supabase.from("user_roles")
      .select("id, user_id, role")
      .eq("masjid_id", role.masjid_id)
      .eq("is_approved", false)
      .eq("is_active", true);

    if (pendingRoles && pendingRoles.length > 0) {
      const userIds = pendingRoles.map(r => r.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, phone").in("user_id", userIds);
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      setPending(pendingRoles.map(r => ({
        id: r.id,
        user_id: r.user_id,
        role: r.role,
        full_name: profileMap.get(r.user_id)?.full_name || "Unknown",
        phone: profileMap.get(r.user_id)?.phone || null,
      })));
    }
    setLoading(false);
  };

  const handleApprove = async (roleId: string) => {
    setUpdating(roleId);
    try {
      const { error } = await supabase.from("user_roles").update({ is_approved: true }).eq("id", roleId);
      if (error) throw error;
      setPending(prev => prev.filter(p => p.id !== roleId));
      toast.success("Approved!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (roleId: string) => {
    setUpdating(roleId);
    try {
      const { error } = await supabase.from("user_roles").update({ is_active: false }).eq("id", roleId);
      if (error) throw error;
      setPending(prev => prev.filter(p => p.id !== roleId));
      toast.success("Rejected");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
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
          <h1 className="text-lg font-semibold text-foreground">Pending Approvals</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto w-full space-y-3">
        {pending.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="text-muted-foreground">No pending approvals</p>
          </div>
        ) : (
          pending.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {p.role === "imam" ? <BookOpen className="w-5 h-5 text-muted-foreground" /> : <User className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{p.full_name}</p>
                    <p className="text-xs text-muted-foreground">{p.phone || "No phone"}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize">{p.role}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 h-9 gap-1" onClick={() => handleApprove(p.id)} disabled={updating === p.id}>
                    {updating === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />} Approve
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-9 gap-1 text-destructive" onClick={() => handleReject(p.id)} disabled={updating === p.id}>
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminApprovals;
