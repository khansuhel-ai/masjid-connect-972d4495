import { motion } from "framer-motion";
import { ArrowLeft, Wallet, CheckCircle, AlertCircle, Upload, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";

const fundEvents = [
  { id: 1, title: "Masjid Renovation Fund", target: 50000, collected: 32500, dueDate: "March 15, 2026", userPaid: false, userAmount: 500 },
  { id: 2, title: "Monthly Maintenance", target: 15000, collected: 12000, dueDate: "March 31, 2026", userPaid: true, userAmount: 300 },
  { id: 3, title: "Ramadan Iftar Fund", target: 25000, collected: 8000, dueDate: "April 1, 2026", userPaid: false, userAmount: 200 },
];

const Funds = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Fund Collection</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center bg-secondary">
            <p className="text-xs text-muted-foreground">Your Pending</p>
            <p className="text-xl font-bold text-destructive mt-1">₹700</p>
          </Card>
          <Card className="p-4 text-center bg-secondary">
            <p className="text-xs text-muted-foreground">Total Paid</p>
            <p className="text-xl font-bold text-primary mt-1">₹300</p>
          </Card>
        </div>

        {/* Fund Events */}
        {fundEvents.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground text-sm">{f.title}</h3>
                <Badge variant={f.userPaid ? "secondary" : "destructive"} className="text-[10px]">
                  {f.userPaid ? <><CheckCircle className="w-3 h-3 mr-0.5" /> Paid</> : <><AlertCircle className="w-3 h-3 mr-0.5" /> Pending</>}
                </Badge>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>₹{f.collected.toLocaleString()} collected</span>
                  <span>₹{f.target.toLocaleString()}</span>
                </div>
                <Progress value={(f.collected / f.target) * 100} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Your amount: <span className="font-semibold text-foreground">₹{f.userAmount}</span></p>
                  <p className="text-[10px] text-muted-foreground">Due: {f.dueDate}</p>
                </div>
                {!f.userPaid && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                      <QrCode className="w-3.5 h-3.5" /> QR
                    </Button>
                    <Button size="sm" className="h-8 text-xs gap-1">
                      <Upload className="w-3.5 h-3.5" /> Pay
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Funds;
