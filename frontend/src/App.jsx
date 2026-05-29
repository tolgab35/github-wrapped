import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [wrappedData, setWrappedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingUsername, setPendingUsername] = useState("");
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  // Apply theme to <html> so CSS vars take effect globally
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const fetchWrapped = async (username) => {
    setLoading(true);
    setError(null);
    setPendingUsername(username);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/api/wrapped/${username}`);

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 429)
          throw new Error("GitHub API rate limit exceeded. Please try again later.");
        throw new Error(errorData.error || "This GitHub user does not exist");
      }

      const data = await res.json();
      setWrappedData(data);
      navigate(`/wrapped/${username}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
      navigate("/");
    } finally {
      setLoading(false);
      setPendingUsername("");
    }
  };

  function WrappedLoader() {
    const { username } = useParams();

    useEffect(() => {
      if (wrappedData || loading) return;
      fetchWrapped(username);
    }, [username, wrappedData, loading]);

    if (!wrappedData || loading)
      return <LoadingScreen username={pendingUsername || username} />;

    return (
      <Dashboard
        data={wrappedData}
        theme={theme}
        onToggleTheme={toggleTheme}
        onBack={() => navigate("/")}
        onGenerateAgain={() => {
          setWrappedData(null);
          fetchWrapped(username);
        }}
      />
    );
  }

  return (
    <>
      {loading && <LoadingScreen username={pendingUsername} />}

      <Routes>
        <Route
          path="/"
          element={
            <Home
              onGenerate={fetchWrapped}
              error={error}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          }
        />
        <Route path="/wrapped/:username" element={<WrappedLoader />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
