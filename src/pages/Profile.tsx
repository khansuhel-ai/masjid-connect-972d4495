import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, MapPin, LogOut, ChevronRight, Settings, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BottomNav from "@/components/BottomNav";

const profileMenuItems = [
  { icon: Settings, label: "Account Settings", path: "/settings" },
  { icon: Shield, label: "Privacy & Security", path: "/privacy" },
  { icon: Phone, label: "Change Phone Number", path: "/change-phone" },
];

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-lg mx-auto text-center">
          <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-primary-foreground/20">
            <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground text-2xl font-bold">AK</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold text-primary-foreground">Ahmed Khan</h1>
          <p className="text-primary-foreground/70 text-sm">+91 98765 43210</p>
          <p className="text-primary-foreground/50 text-xs mt-1">Community User • Masjid Al-Noor</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <Card className="p-1 overflow-hidden">
          {profileMenuItems.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <button className="w-full flex items-center gap-3 p-3.5 hover:bg-muted/50 rounded-lg transition-colors">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              {i < profileMenuItems.length - 1 && <Separator className="mx-3" />}
            </motion.div>
          ))}
        </Card>

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/5 gap-2"
          onClick={() => navigate("/")}
        >
          <LogOut className="w-5 h-5" /> Logout
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
