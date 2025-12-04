import { useState } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  const [wrappedData, setWrappedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (username) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3001/api/wrapped/${username}`);
      if (!res.ok) {
        throw new Error("Kullanıcı bulunamadı veya API hatası");
      }
      const data = await res.json();
      setWrappedData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWrappedData(null);
    setError(null);
  };

  // Henüz wrappedData yoksa → giriş ekranı
  if (!wrappedData) {
    return <Home onGenerate={handleGenerate} loading={loading} error={error} />;
  }

  // Veri geldiyse → dashboard
  return <Dashboard data={wrappedData} onBack={handleReset} />;
}

export default App;
