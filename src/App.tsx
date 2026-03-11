import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import RegisterUser from "./pages/RegisterUser";
import RegisterImam from "./pages/RegisterImam";
import RegisterMotaballi from "./pages/RegisterMotaballi";
import Home from "./pages/Home";
import NamazTimings from "./pages/NamazTimings";
import Announcements from "./pages/Announcements";
import Funds from "./pages/Funds";
import Profile from "./pages/Profile";
import MotaballiDashboard from "./pages/MotaballiDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/select-role" element={<RoleSelection />} />
            <Route path="/register/user" element={<RegisterUser />} />
            <Route path="/register/imam" element={<RegisterImam />} />
            <Route path="/register/motaballi" element={<RegisterMotaballi />} />
            <Route path="/home" element={<Home />} />
            <Route path="/namaz" element={<NamazTimings />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<MotaballiDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
