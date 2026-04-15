import React, { useState } from "react";
import AlgorithmVisualizer from "./components/AlgorithmVisualizer";
import GraphVisualizer from "./components/GraphVisualizer";

function App() {
  const [view, setView] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!view && (
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginBottom: "20px" }}>Visualizer</h1>

          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <button
              onClick={() => setView("algo")}
              style={buttonStyle}
            >
              Algorithm Visualizer
            </button>

            <button
              onClick={() => setView("graph")}
              style={buttonStyle}
            >
              Graph Visualizer
            </button>
          </div>
        </div>
      )}

      {view === "algo" && (
        <AlgorithmVisualizer goBack={() => setView(null)} />
      )}

      {view === "graph" && (
        <GraphVisualizer goBack={() => setView(null)} />
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "12px 20px",
  fontSize: "16px",
  border: "none",
  borderRadius: "8px",
  background: "#007bff",
  color: "white",
  cursor: "pointer",
};

export default App;