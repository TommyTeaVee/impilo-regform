import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StepperForm from "./components/StepperForm";
import AdminDashboard from "./components/AdminDashboard";
import RegistrationDetail from "./components/RegistrationDetail";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Frontend Registration Form */}
          <Route path="/" element={<StepperForm />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Registration Detail Page */}
          <Route path="/admin/registrations/:id" element={<RegistrationDetail />} />

          {/* Redirect any unknown route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
