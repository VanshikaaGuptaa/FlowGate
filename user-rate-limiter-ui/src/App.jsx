import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MetricsPage from "./pages/MetricsPage";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedApi, setSelectedApi] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setSelectedApi(null);
  };

  if (!authenticated) {
    return <Login onSuccess={() => setAuthenticated(true)} />;
  }

  if (selectedApi) {
    return <MetricsPage api={selectedApi} onBack={() => setSelectedApi(null)} />;
  }

  return <Dashboard onLogout={handleLogout} onSelectApi={setSelectedApi} />;
}

export default App;
