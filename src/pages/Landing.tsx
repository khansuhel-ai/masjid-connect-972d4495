import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import mosqueHero from "@/assets/mosque-hero.png";
import { Clock, Users, Megaphone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Clock, title: "Namaz Timings", desc: "Stay updated with daily prayer times" },
  { icon: Users, title: "Community", desc: "Connect with your local masjid" },
  { icon: Megaphone, title: "Announcements", desc: "Never miss important updates" },
  { icon: Heart, title: "Fund Management", desc: "Transparent fund collection" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 islamic-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-light/60 via-background/80 to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-lg mx-auto"
        >
          <motion.img
            src={mosqueHero}
            alt="Mosque illustration"
            className="w-48 h-48 mx-auto mb-6 drop-shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
            Masjid<span className="text-primary">Connect</span>
          </h1>
          
          <p className="font-arabic text-lg text-primary mb-3">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          
          <p className="text-muted-foreground text-base mb-8 leading-relaxed">
            Digitize your masjid management. Namaz timings, funds, announcements & community — all in one place.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="text-base px-8 py-6 rounded-xl shadow-lg animate-pulse-glow"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 rounded-xl border-primary/30 text-primary hover:bg-primary/5"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/40 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 rounded-full bg-primary/60" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center text-foreground mb-10">
          Everything Your Masjid Needs
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl p-5 border border-border shadow-sm text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          © 2026 MasjidConnect — Connecting Communities
        </p>
      </footer>
    </div>
  );
};

export default Landing;
