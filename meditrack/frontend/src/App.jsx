
import { useState } from "react";
import api from "./services/api.js";
import {NavbarMed} from "./components/NavbarMed/NavbarMed.jsx";
import FooterMed from "./components/FooterMed/FooterMed.jsx";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkBackend() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.get("/health");

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to connect to backend"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <NavbarMed />
    <main style={{ padding: "24px", fontFamily: "Arial" }}>
      <h1>MediTrack</h1>
      <p>Frontend-to-backend connection test using Axios</p>

      <button onClick={checkBackend} disabled={loading}>
        {loading ? "Checking..." : "Check Backend"}
      </button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
    <FooterMed/>
    </>
  );

}

export default App;
