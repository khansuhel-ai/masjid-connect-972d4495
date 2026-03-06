import { motion } from "framer-motion";
import { ArrowLeft, Megaphone, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const announcements = [
  { id: 1, title: "Jumu'ah Khutbah Topic", body: "This Friday's khutbah will focus on 'Patience in times of trials'. All community members are encouraged to attend.", time: "2 hours ago", type: "khutbah" },
  { id: 2, title: "Madrasa Admissions Open", body: "Register your children for the new Madrasa session starting next month. Contact the office for details.", time: "1 day ago", type: "madrasa" },
  { id: 3, title: "Community Iftar Event", body: "Join us for the community iftar this Saturday at 6:30 PM. Bring your family and friends.", time: "2 days ago", type: "event" },
  { id: 4, title: "Masjid Cleaning Drive", body: "Volunteers needed for the monthly masjid cleaning drive this Sunday morning at 8 AM.", time: "3 days ago", type: "general" },
];

const typeColors: Record<string, string> = {
  khutbah: "bg-primary/10 text-primary border-primary/20",
  madrasa: "bg-cosmic-light text-cosmic border-cosmic/20",
  event: "bg-gold-light text-gold border-gold/20",
  general: "bg-muted text-muted-foreground border-border",
};

const Announcements = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Announcements</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-3">
        {announcements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="outline" className={`text-[10px] ${typeColors[a.type]}`}>
                  {a.type}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{a.time}</span>
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{a.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{a.body}</p>
              <Button variant="ghost" size="sm" className="mt-2 -ml-2 text-xs text-primary gap-1 h-8">
                <Share2 className="w-3.5 h-3.5" /> Share
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Announcements;
