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
import EditProfile from "./pages/EditProfile";
import ImamDetailsView from "./pages/ImamDetailsView";
import EditImamDetails from "./pages/EditImamDetails";
import MotaballiDashboard from "./pages/MotaballiDashboard";
import AdminFunds from "./pages/AdminFunds";
import CreateFundEvent from "./pages/CreateFundEvent";
import FundCollectionManage from "./pages/FundCollectionManage";
import AdminApprovals from "./pages/AdminApprovals";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import AdminExpenses from "./pages/AdminExpenses";
import AdminNamazTimings from "./pages/AdminNamazTimings";
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
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/imam-details" element={<ImamDetailsView />} />
            <Route path="/profile/imam-details/edit" element={<EditImamDetails />} />
            <Route path="/dashboard" element={<MotaballiDashboard />} />
            <Route path="/admin/funds" element={<AdminFunds />} />
            <Route path="/admin/funds/create" element={<CreateFundEvent />} />
            <Route path="/admin/funds/:eventId" element={<FundCollectionManage />} />
            <Route path="/admin/approvals" element={<AdminApprovals />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/expenses" element={<AdminExpenses />} />
            <Route path="/admin/namaz" element={<AdminNamazTimings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
