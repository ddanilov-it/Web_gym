// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import SubscriptionTable from './components/SubscriptionTable';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleAuthSuccess = (newToken: string) => {
    setToken(newToken);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={<AuthForm onAuthSuccess={handleAuthSuccess} />}
        />
        <Route
          path="/"
          element={token ? <h1>Добро пожаловать!</h1> : <Navigate to="/auth" />}
        />
        <Route
          path="/subscriptions"
          element={<SubscriptionTable /> }
        />
      </Routes>
    </Router>
  );
};

export default App;
