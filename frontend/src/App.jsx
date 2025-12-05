import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [wrappedData, setWrappedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWrapped = async (username) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3001/api/wrapped/${username}`);
      if (!res.ok) throw new Error("User not found");

      const data = await res.json();
      setWrappedData(data);

      navigate(`/wrapped/${username}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  function WrappedLoader() {
    const { username } = useParams();

    useEffect(() => {
      if (wrappedData || loading) return;

      fetchWrapped(username);
    }, [username, wrappedData, loading]);

    if (!wrappedData || loading) return <LoadingScreen />;

    return <Dashboard data={wrappedData} onBack={() => navigate("/")} />;
  }

  return (
    <>
      {loading && <LoadingScreen />}

      <Routes>
        <Route
          path="/"
          element={<Home onGenerate={fetchWrapped} error={error} />}
        />

        <Route path="/wrapped/:username" element={<WrappedLoader />} />
      </Routes>
    </>
  );
}
