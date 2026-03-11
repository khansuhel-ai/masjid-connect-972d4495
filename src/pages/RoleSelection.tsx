import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Moon, User, BookOpen, Building2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [hasActiveImam, setHasActiveImam] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    checkExistingRoles();
  }, [user]);

  const checkExistingRoles = async () => {
    try {
      // Check if user already has a role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role, is_approved")
        .eq("user_id", user!.id);

      if (roles && roles.length > 0) {
        const approvedRole = roles.find(r => r.is_approved);
        if (approvedRole) {
          navigate("/home");
          return;
        }
        // Has pending role
        toast.info("Your registration is pending approval");
        navigate("/home");
        return;
      }

      // Check if there's an active imam already (globally for now, later per masjid)
      const { data: activeImams } = await supabase
        .from("user_roles")
        .select("id")
        .eq("role", "imam")
        .eq("is_active", true)
        .eq("is_approved", true)
        .limit(1);

      setHasActiveImam(activeImams !== null && activeImams.length > 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: "user",
      label: "Community User",
      description: "View namaz timings, announcements, funds & imam posts",
      icon: User,
      color: "bg-primary/10 text-primary border-primary/30",
    },
    {
      id: "imam",
      label: "Imam",
      description: "Manage prayers, create posts & announcements",
      icon: BookOpen,
      color: "bg-cosmic/10 text-cosmic border-cosmic/30",
      disabled: hasActiveImam,
      disabledText: "An active imam is already registered",
    },
    {
      id: "motaballi",
      label: "Motaballi",
      description: "Full masjid management — users, funds, expenses",
      icon: Building2,
      color: "bg-gold/10 text-gold border-gold/30",
    },
  ];

  const handleContinue = () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    if (selectedRole === "imam") {
      navigate("/register/imam");
    } else if (selectedRole === "motaballi") {
      navigate("/register/motaballi");
    } else {
      navigate("/register/user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col islamic-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-light/40 to-background" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Moon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Join as</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Select your role to continue registration
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {roles.map((role, i) => (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                disabled={role.disabled}
                onClick={() => !role.disabled && setSelectedRole(role.id)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  role.disabled
                    ? "opacity-40 cursor-not-allowed border-border bg-muted"
                    : selectedRole === role.id
                    ? `${role.color} border-2 shadow-md`
                    : "border-border hover:border-primary/20 bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedRole === role.id ? role.color : "bg-muted text-muted-foreground"
                  }`}>
                    <role.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">{role.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {role.disabled ? role.disabledText : role.description}
                    </p>
                  </div>
                  {selectedRole === role.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          <Button
            className="w-full h-12 rounded-xl text-base font-semibold gap-2"
            onClick={handleContinue}
            disabled={!selectedRole}
          >
            Continue <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;
