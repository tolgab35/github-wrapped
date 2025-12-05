import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [wrappedData, setWrappedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWrapped = async (username) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3001/api/wrapped/${username}`);

      if (!res.ok) throw new Error("User not found");

      const data = await res.json();
      setWrappedData(data);

      navigate(`/wrapped/${username}`);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}

      <Routes>
        <Route
          path="/"
          element={<Home onGenerate={fetchWrapped} error={error} />}
        />

        <Route
          path="/wrapped/:username"
          element={
            wrappedData ? (
              <Dashboard data={wrappedData} onBack={() => navigate("/")} />
            ) : null
          }
        />
      </Routes>
    </>
  );
}
