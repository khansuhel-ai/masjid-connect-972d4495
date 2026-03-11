import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const RegisterImam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [masjids, setMasjids] = useState<{ id: string; name: string; city: string }[]>([]);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    whatsapp_number: "",
    alternate_phone: "",
    city: "",
    masjid_id: "",
    islamic_degree: "",
    experience_years: "",
    experience_details: "",
    aadhaar_number: "",
    home_address: "",
    father_name: "",
    mother_name: "",
    marital_status: "single",
    wife_name: "",
    children_names: "",
    expected_salary: "",
    salary_period: "monthly",
    upi_id: "",
  });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadMasjids();
    // Pre-fill phone from auth
    setForm(f => ({ ...f, phone: user.phone || "" }));
  }, [user]);

  const loadMasjids = async () => {
    const { data } = await supabase.from("masjids").select("id, name, city");
    if (data) setMasjids(data);
  };

  const updateField = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.full_name.trim() || !form.masjid_id) {
      toast.error("Please fill in name and select a masjid");
      return;
    }
    setLoading(true);
    try {
      // Update profile
      await supabase.from("profiles").update({
        full_name: form.full_name,
        phone: form.phone,
        whatsapp_number: form.whatsapp_number || null,
        alternate_phone: form.alternate_phone || null,
        city: form.city || null,
        masjid_id: form.masjid_id,
      }).eq("user_id", user!.id);

      // Insert imam details
      await supabase.from("imam_details").insert({
        user_id: user!.id,
        masjid_id: form.masjid_id,
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
      });

      // Insert role (pending approval)
      await supabase.from("user_roles").insert({
        user_id: user!.id,
        role: "imam" as any,
        masjid_id: form.masjid_id,
        is_active: true,
        is_approved: false,
      });

      toast.success("Registration submitted! Awaiting Motaballi approval.");
      navigate("/home");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">Imam Registration</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-8">
          <Section title="Personal Information">
            <div className="space-y-3">
              <div>
                <Label className="text-foreground font-medium">Full Name *</Label>
                <Input value={form.full_name} onChange={e => updateField("full_name", e.target.value)} placeholder="Enter full name" className="h-12 rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-foreground font-medium">Phone Number</Label>
                <Input value={form.phone} onChange={e => updateField("phone", e.target.value)} placeholder="Phone number" className="h-12 rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-foreground font-medium">WhatsApp Number</Label>
                <Input value={form.whatsapp_number} onChange={e => updateField("whatsapp_number", e.target.value)} placeholder="WhatsApp number" className="h-12 rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-foreground font-medium">Alternate Phone</Label>
                <Input value={form.alternate_phone} onChange={e => updateField("alternate_phone", e.target.value)} placeholder="Alternate phone" className="h-12 rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-foreground font-medium">City</Label>
                <Input value={form.city} onChange={e => updateField("city", e.target.value)} placeholder="Your city" className="h-12 rounded-xl mt-1" />
              </div>
            </div>
          </Section>

          <Section title="Masjid Selection">
            <Select value={form.masjid_id} onValueChange={v => updateField("masjid_id", v)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select your masjid *" />
              </SelectTrigger>
              <SelectContent>
                {masjids.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name}, {m.city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Section>

          <Section title="Islamic Qualifications">
            <div className="space-y-3">
              <div>
                <Label className="text-foreground font-medium">Islamic Degree</Label>
                <Input value={form.islamic_degree} onChange={e => updateField("islamic_degree", e.target.value)} placeholder="e.g. Alim, Fazil, Hafiz" className="h-12 rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-foreground font-medium">Experience (years)</Label>
                <Input type="number" value={form.experience_years} onChange={e => updateField("experience_years", e.target.value)} placeholder="Years of experience" className="h-12 rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-foreground font-medium">Experience Details</Label>
                <Textarea value={form.experience_details} onChange={e => updateField("experience_details", e.target.value)} placeholder="Previous experience details" className="rounded-xl mt-1" />
              </div>
            </div>
          </Section>

          <Section title="Identity & Address">
            <div className="space-y-3">
              <div>
                <Label className="text-foreground font-medium">Aadhaar Number</Label>
                <Input value={form.aadhaar_number} onChange={e => updateField("aadhaar_number", e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="12-digit Aadhaar number" className="h-12 rounded-xl mt-1" maxLength={12} />
              </div>
              <div>
                <Label className="text-foreground font-medium">Home Address</Label>
                <Textarea value={form.home_address} onChange={e => updateField("home_address", e.target.value)} placeholder="Full home address" className="rounded-xl mt-1" />
              </div>
            </div>
          </Section>

          <Section title="Family Details">
            <div className="space-y-3">
              <div>
                <Label className="text-foreground font-medium">Father's Name</Label>
                <Input value={form.father_name} onChange={e => updateField("father_name", e.target.value)} placeholder="Father's name" className="h-12 rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-foreground font-medium">Mother's Name</Label>
                <Input value={form.mother_name} onChange={e => updateField("mother_name", e.target.value)} placeholder="Mother's name" className="h-12 rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-foreground font-medium">Marital Status</Label>
                <Select value={form.marital_status} onValueChange={v => updateField("marital_status", v)}>
                  <SelectTrigger className="h-12 rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
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
                  <div>
                    <Label className="text-foreground font-medium">Wife's Name</Label>
                    <Input value={form.wife_name} onChange={e => updateField("wife_name", e.target.value)} placeholder="Wife's name" className="h-12 rounded-xl mt-1" />
                  </div>
                  <div>
                    <Label className="text-foreground font-medium">Children's Names</Label>
                    <Input value={form.children_names} onChange={e => updateField("children_names", e.target.value)} placeholder="Comma-separated names" className="h-12 rounded-xl mt-1" />
                  </div>
                </>
              )}
            </div>
          </Section>

          <Section title="Salary & Payment">
            <div className="space-y-3">
              <div>
                <Label className="text-foreground font-medium">Expected Salary (₹)</Label>
                <Input type="number" value={form.expected_salary} onChange={e => updateField("expected_salary", e.target.value)} placeholder="Amount in rupees" className="h-12 rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-foreground font-medium">Salary Period</Label>
                <Select value={form.salary_period} onValueChange={v => updateField("salary_period", v)}>
                  <SelectTrigger className="h-12 rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="half_yearly">Half Yearly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-foreground font-medium">UPI ID</Label>
                <Input value={form.upi_id} onChange={e => updateField("upi_id", e.target.value)} placeholder="e.g. name@upi" className="h-12 rounded-xl mt-1" />
              </div>
            </div>
          </Section>

          <Button className="w-full h-12 rounded-xl text-base font-semibold gap-2" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen className="w-5 h-5" />}
            {loading ? "Submitting..." : "Submit Registration"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your registration will be reviewed by the Motaballi before activation.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterImam;
