import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authStore } from "./stores/authStore";
import AuthForm from "./components/AuthForm";
import SubscriptionTable from "./components/SubscriptionTable";

const App: React.FC = observer(() => {
  const { token } = authStore;

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/" element={token ? <Navigate to="/subscriptions" /> : <Navigate to="/auth" />} />
        <Route path="/subscriptions" element={token ? <SubscriptionTable /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
});

export default App;