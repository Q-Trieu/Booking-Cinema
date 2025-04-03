import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/public/home";
import LoginForm from "./pages/user/login";
import RegisterForm from "./pages/user/registers";
import OTPVerification from "./pages/user/OTP";
import PaymentPage from "./pages/user/payment";
import AdminDashboard from "./pages/admin/dashboard";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
