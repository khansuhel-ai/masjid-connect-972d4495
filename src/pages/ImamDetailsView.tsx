import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Edit, BookOpen, Home as HomeIcon, CreditCard, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const ImamDetailsView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadDetails();
  }, [user]);

  const loadDetails = async () => {
    const { data } = await supabase.from("imam_details").select("*").eq("user_id", user!.id).single();
    setDetails(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <p className="text-muted-foreground mb-4">No imam details found</p>
        <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
      </div>
    );
  }

  const sections = [
    {
      title: "Qualifications", icon: BookOpen, items: [
        { label: "Islamic Degree", value: details.islamic_degree },
        { label: "Experience", value: details.experience_years ? `${details.experience_years} years` : null },
        { label: "Details", value: details.experience_details },
      ]
    },
    {
      title: "Identity", icon: HomeIcon, items: [
        { label: "Aadhaar", value: details.aadhaar_number },
        { label: "Address", value: details.home_address },
      ]
    },
    {
      title: "Family", icon: Users, items: [
        { label: "Father", value: details.father_name },
        { label: "Mother", value: details.mother_name },
        { label: "Marital Status", value: details.marital_status },
        { label: "Wife", value: details.wife_name },
        { label: "Children", value: details.children_names },
      ]
    },
    {
      title: "Payment", icon: CreditCard, items: [
        { label: "Expected Salary", value: details.expected_salary ? `₹${details.expected_salary}` : null },
        { label: "Period", value: details.salary_period },
        { label: "UPI ID", value: details.upi_id },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Imam Details</h1>
          </div>
          <Button size="sm" variant="outline" className="gap-1 h-8" onClick={() => navigate("/profile/imam-details/edit")}>
            <Edit className="w-3.5 h-3.5" /> Edit
          </Button>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-4">
        {sections.map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">{section.title}</h3>
              </div>
              <div className="space-y-2">
                {section.items.map(item => (
                  <div key={item.label} className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-sm text-foreground text-right max-w-[60%]">{item.value || "—"}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ImamDetailsView;
