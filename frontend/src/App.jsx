import { useState } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  const [data, setData] = useState(null);

  const handleGenerate = async (username) => {
    const res = await fetch(`http://localhost:3001/api/wrapped/${username}`);
    const json = await res.json();
    setData(json);
  };

  return (
    <div>
      {!data ? <Home onGenerate={handleGenerate} /> : <Dashboard data={data} />}
    </div>
  );
}

export default App;
