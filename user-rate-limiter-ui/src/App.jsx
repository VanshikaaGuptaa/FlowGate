import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MetricsPage from "./pages/MetricsPage";
import LandingPage from "./pages/LandingPage";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedApi, setSelectedApi] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setSelectedApi(null);
    setShowLogin(false);
  };

  if (!authenticated) {
    if (!showLogin) {
      return <LandingPage onGetStarted={() => setShowLogin(true)} />;
    }

    return <Login onSuccess={() => setAuthenticated(true)} />;
  }

  if (selectedApi) {
    return (
      <MetricsPage
        api={selectedApi}
        onBack={() => setSelectedApi(null)}
      />
    );
  }

  return (
    <Dashboard
      onLogout={handleLogout}
      onSelectApi={setSelectedApi}
    />
  );
}

export default App;