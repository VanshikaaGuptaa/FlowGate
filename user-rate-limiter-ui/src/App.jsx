import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthenticated(true);
  }, []);

  return authenticated
    ? <Dashboard onLogout={() => {
        localStorage.removeItem("token");
        setAuthenticated(false);
      }} />
    : <Login onSuccess={() => setAuthenticated(true)} />;
}

export default App;
