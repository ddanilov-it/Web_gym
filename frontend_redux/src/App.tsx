import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import AuthForm from "./components/AuthForm";
import SubscriptionTable from "./components/SubscriptionTable";

const App: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token); // Используем Redux

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/" element={token ? <Navigate to="/subscriptions" /> : <Navigate to="/auth" />} />
        <Route path="/subscriptions" element={token ? <SubscriptionTable /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default App;
