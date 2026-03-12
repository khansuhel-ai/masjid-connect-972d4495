import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Loader2, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AdminExpenses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "", description: "", expense_date: "" });
  const [masjidId, setMasjidId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const { data: role } = await supabase.from("user_roles")
      .select("masjid_id")
      .eq("user_id", user!.id)
      .eq("role", "motaballi")
      .eq("is_active", true)
      .single();

    if (!role?.masjid_id) { setLoading(false); return; }
    setMasjidId(role.masjid_id);

    const { data } = await supabase.from("expenses")
      .select("*")
      .eq("masjid_id", role.masjid_id)
      .order("expense_date", { ascending: false });

    if (data) setExpenses(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.amount) { toast.error("Title and amount are required"); return; }
    setCreating(true);
    try {
      const { error } = await supabase.from("expenses").insert({
        title: form.title,
        amount: parseFloat(form.amount),
        description: form.description || null,
        expense_date: form.expense_date || new Date().toISOString().split("T")[0],
        masjid_id: masjidId!,
        created_by: user!.id,
      });
      if (error) throw error;
      toast.success("Expense recorded!");
      setForm({ title: "", amount: "", description: "", expense_date: "" });
      setOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);

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
            <h1 className="text-lg font-semibold text-foreground">Expenses</h1>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1 h-8"><Plus className="w-3.5 h-3.5" /> Add</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Expense</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Electric bill" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹) *</Label>
                  <Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Details" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.expense_date} onChange={e => setForm(f => ({ ...f, expense_date: e.target.value }))} className="h-11 rounded-xl" />
                </div>
                <Button className="w-full h-11 rounded-xl" onClick={handleCreate} disabled={creating}>
                  {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {creating ? "Saving..." : "Record Expense"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto w-full space-y-3">
        <Card className="p-3 bg-destructive/5 border-destructive/20 text-center">
          <p className="text-xs text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold text-destructive">₹{totalExpenses.toLocaleString()}</p>
        </Card>

        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No expenses recorded</p>
          </div>
        ) : (
          expenses.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{e.title}</p>
                    {e.description && <p className="text-xs text-muted-foreground mt-0.5">{e.description}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">{new Date(e.expense_date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm font-bold text-destructive">₹{Number(e.amount).toLocaleString()}</p>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminExpenses;
