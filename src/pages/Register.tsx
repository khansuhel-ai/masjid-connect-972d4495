import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const handleRegister = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    toast.success("Registration successful! Welcome to MasjidConnect");
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Create Account</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label className="text-foreground font-medium">I am a</Label>
            <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-3 gap-3">
              {[
                { value: "user", label: "User" },
                { value: "imam", label: "Imam" },
                { value: "motaballi", label: "Motaballi" },
              ].map((r) => (
                <div key={r.value}>
                  <RadioGroupItem value={r.value} id={r.value} className="peer sr-only" />
                  <Label
                    htmlFor={r.value}
                    className="flex items-center justify-center px-3 py-3 rounded-xl border-2 border-border text-sm font-medium cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-secondary peer-data-[state=checked]:text-secondary-foreground"
                  >
                    {r.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
            <Input id="name" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-foreground font-medium">City</Label>
            <Input id="city" placeholder="Your city" value={city} onChange={(e) => setCity(e.target.value)} className="h-12 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Select Masjid</Label>
            <Select>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Choose your masjid" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masjid-1">Masjid Al-Noor, Delhi</SelectItem>
                <SelectItem value="masjid-2">Jama Masjid, Mumbai</SelectItem>
                <SelectItem value="masjid-3">Masjid-e-Haram, Hyderabad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full h-12 rounded-xl text-base font-semibold gap-2" onClick={handleRegister}>
            <UserPlus className="w-5 h-5" /> Complete Registration
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
