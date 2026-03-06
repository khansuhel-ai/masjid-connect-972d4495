import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Phone, ArrowLeft, Moon } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      toast.success("OTP sent to +91 " + phone);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 6) {
      toast.error("Please enter the complete OTP");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Welcome to MasjidConnect!");
      navigate("/home");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col islamic-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-light/40 to-background" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Moon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Masjid<span className="text-primary">Connect</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {step === "phone" ? "Enter your phone number to continue" : "Enter the OTP sent to your phone"}
            </p>
          </div>

          {step === "phone" ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">+91</span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-12 h-12 rounded-xl text-base"
                    maxLength={10}
                  />
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl text-base font-semibold"
                onClick={handleSendOtp}
                disabled={loading || phone.length < 10}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <button
                onClick={() => setStep("phone")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Change number
              </button>

              <div className="flex flex-col items-center gap-4">
                <Label className="text-foreground font-medium">Enter 6-digit OTP</Label>
                <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="w-11 h-12 rounded-lg border-border text-lg" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-xs text-muted-foreground">
                  OTP sent to +91 {phone}
                </p>
              </div>

              <Button
                className="w-full h-12 rounded-xl text-base font-semibold"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 6}
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>

              <button
                className="w-full text-sm text-primary hover:underline"
                onClick={handleSendOtp}
              >
                Resend OTP
              </button>
            </motion.div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-8">
            By continuing, you agree to our Terms of Service
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
