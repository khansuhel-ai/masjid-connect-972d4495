import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, LogOut, ChevronRight, Settings, Shield, Edit, BookOpen, Building2, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  full_name: string;
  phone: string | null;
  whatsapp_number: string | null;
  city: string | null;
  masjid_id: string | null;
  masjid_name?: string;
  masjid_city?: string;
}

interface RoleData {
  role: "imam" | "motaballi" | "user";
  is_approved: boolean;
  is_active: boolean;
}

const roleIcons = { imam: BookOpen, motaballi: Building2, user: User };
const roleLabels = { imam: "Imam", motaballi: "Motaballi", user: "Community User" };

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const [profileRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("full_name, phone, whatsapp_number, city, masjid_id").eq("user_id", user!.id).single(),
        supabase.from("user_roles").select("role, is_approved, is_active").eq("user_id", user!.id),
      ]);

      if (profileRes.data) {
        const p = profileRes.data;
        let masjid_name = "", masjid_city = "";
        if (p.masjid_id) {
          const { data: m } = await supabase.from("masjids").select("name, city").eq("id", p.masjid_id).single();
          if (m) { masjid_name = m.name; masjid_city = m.city; }
        }
        setProfile({ ...p, masjid_name, masjid_city });
      }
      if (rolesRes.data) setRoles(rolesRes.data as RoleData[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const primaryRole = roles.find(r => r.is_approved && r.is_active);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-lg mx-auto text-center">
          <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-primary-foreground/20">
            <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground text-2xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold text-primary-foreground">{profile?.full_name || "User"}</h1>
          <p className="text-primary-foreground/70 text-sm">{profile?.phone || user?.phone}</p>
          {primaryRole && (
            <Badge variant="secondary" className="mt-2 bg-primary-foreground/15 text-primary-foreground border-none">
              {roleLabels[primaryRole.role]} • {profile?.masjid_name}
            </Badge>
          )}
          {roles.some(r => !r.is_approved) && (
            <Badge variant="outline" className="mt-2 ml-1 border-primary-foreground/30 text-primary-foreground/80 text-[10px]">
              Approval Pending
            </Badge>
          )}
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        {/* Info Cards */}
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-foreground">Contact Details</h3>
          <div className="space-y-2">
            <InfoRow icon={Phone} label="Phone" value={profile?.phone || "Not set"} />
            <InfoRow icon={Phone} label="WhatsApp" value={profile?.whatsapp_number || "Not set"} />
            <InfoRow icon={MapPin} label="City" value={profile?.city || "Not set"} />
            <InfoRow icon={Building2} label="Masjid" value={profile?.masjid_name ? `${profile.masjid_name}, ${profile.masjid_city}` : "Not set"} />
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-1 overflow-hidden">
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="w-full flex items-center gap-3 p-3.5 hover:bg-muted/50 rounded-lg transition-colors"
            onClick={() => navigate("/profile/edit")}
          >
            <Edit className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground flex-1 text-left">Edit Profile</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          {primaryRole?.role === "imam" && (
            <>
              <Separator className="mx-3" />
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.05 } }}
                className="w-full flex items-center gap-3 p-3.5 hover:bg-muted/50 rounded-lg transition-colors"
                onClick={() => navigate("/profile/imam-details")}
              >
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground flex-1 text-left">Imam Details</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            </>
          )}
        </Card>

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/5 gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" /> Logout
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <Icon className="w-4 h-4 text-muted-foreground" />
    <span className="text-xs text-muted-foreground w-16">{label}</span>
    <span className="text-sm text-foreground">{value}</span>
  </div>
);

export default Profile;
