
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./hooks/useAuth";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Batches from "./components/Batches";
import Savings from "./components/Savings";
import Loans from "./components/Loans";
import Chatbot from "./components/Chatbot";
import BottomNavigation from "./components/BottomNavigation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PaymentRequests from "./pages/PaymentRequests";
import Statements from "./pages/Statements";
import Referrals from "./pages/Referrals";
import Settings from "./pages/Settings";
import SplashScreen from "./components/SplashScreen";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
            <Route path="/batches" element={user ? <Batches /> : <Navigate to="/auth" />} />
            <Route path="/savings" element={user ? <Savings /> : <Navigate to="/auth" />} />
            <Route path="/loans" element={user ? <Loans /> : <Navigate to="/auth" />} />
            <Route path="/chatbot" element={user ? <Chatbot /> : <Navigate to="/auth" />} />
            <Route path="/payment-requests" element={user ? <PaymentRequests /> : <Navigate to="/auth" />} />
            <Route path="/statements" element={user ? <Statements /> : <Navigate to="/auth" />} />
            <Route path="/referrals" element={user ? <Referrals /> : <Navigate to="/auth" />} />
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {user && <BottomNavigation />}
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
