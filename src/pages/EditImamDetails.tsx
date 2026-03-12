import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const EditImamDetails = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    islamic_degree: "", experience_years: "", experience_details: "",
    aadhaar_number: "", home_address: "",
    father_name: "", mother_name: "", marital_status: "single",
    wife_name: "", children_names: "",
    expected_salary: "", salary_period: "monthly", upi_id: "",
  });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadDetails();
  }, [user]);

  const loadDetails = async () => {
    const { data } = await supabase.from("imam_details").select("*").eq("user_id", user!.id).single();
    if (data) {
      setForm({
        islamic_degree: data.islamic_degree || "",
        experience_years: data.experience_years?.toString() || "",
        experience_details: data.experience_details || "",
        aadhaar_number: data.aadhaar_number || "",
        home_address: data.home_address || "",
        father_name: data.father_name || "",
        mother_name: data.mother_name || "",
        marital_status: data.marital_status || "single",
        wife_name: data.wife_name || "",
        children_names: data.children_names || "",
        expected_salary: data.expected_salary?.toString() || "",
        salary_period: data.salary_period || "monthly",
        upi_id: data.upi_id || "",
      });
    }
    setFetching(false);
  };

  const u = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("imam_details").update({
        islamic_degree: form.islamic_degree || null,
        experience_years: form.experience_years ? parseInt(form.experience_years) : null,
        experience_details: form.experience_details || null,
        aadhaar_number: form.aadhaar_number || null,
        home_address: form.home_address || null,
        father_name: form.father_name || null,
        mother_name: form.mother_name || null,
        marital_status: form.marital_status as any,
        wife_name: form.wife_name || null,
        children_names: form.children_names || null,
        expected_salary: form.expected_salary ? parseFloat(form.expected_salary) : null,
        salary_period: form.salary_period as any,
        upi_id: form.upi_id || null,
      }).eq("user_id", user!.id);
      if (error) throw error;
      toast.success("Details updated!");
      navigate("/profile/imam-details");
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
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
          <h1 className="text-lg font-semibold text-foreground">Edit Imam Details</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-8">
          <F label="Islamic Degree" value={form.islamic_degree} onChange={v => u("islamic_degree", v)} />
          <F label="Experience (years)" value={form.experience_years} onChange={v => u("experience_years", v)} type="number" />
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Experience Details</Label>
            <Textarea value={form.experience_details} onChange={e => u("experience_details", e.target.value)} className="rounded-xl" />
          </div>
          <F label="Aadhaar Number" value={form.aadhaar_number} onChange={v => u("aadhaar_number", v.replace(/\D/g, "").slice(0, 12))} />
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Home Address</Label>
            <Textarea value={form.home_address} onChange={e => u("home_address", e.target.value)} className="rounded-xl" />
          </div>
          <F label="Father's Name" value={form.father_name} onChange={v => u("father_name", v)} />
          <F label="Mother's Name" value={form.mother_name} onChange={v => u("mother_name", v)} />
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Marital Status</Label>
            <Select value={form.marital_status} onValueChange={v => u("marital_status", v)}>
              <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.marital_status === "married" && (
            <>
              <F label="Wife's Name" value={form.wife_name} onChange={v => u("wife_name", v)} />
              <F label="Children's Names" value={form.children_names} onChange={v => u("children_names", v)} />
            </>
          )}
          <F label="Expected Salary (₹)" value={form.expected_salary} onChange={v => u("expected_salary", v)} type="number" />
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Salary Period</Label>
            <Select value={form.salary_period} onValueChange={v => u("salary_period", v)}>
              <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="half_yearly">Half Yearly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <F label="UPI ID" value={form.upi_id} onChange={v => u("upi_id", v)} />

          <Button className="w-full h-12 rounded-xl text-base font-semibold gap-2" onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

const F = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div className="space-y-2">
    <Label className="text-foreground font-medium">{label}</Label>
    <Input type={type} value={value} onChange={e => onChange(e.target.value)} className="h-12 rounded-xl" />
  </div>
);

export default EditImamDetails;
