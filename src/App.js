import React, { useState } from "react";
import AlgorithmVisualizer from "./components/AlgorithmVisualizer";
import GraphVisualizer from "./components/GraphVisualizer";

function App() {
  const [view, setView] = useState(null);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      {!view && (
        <>
          <h1>Visualizer</h1>
          <button onClick={() => setView("algo")}>
            Algorithm Visualizer
          </button>
          <button onClick={() => setView("graph")}>
            Graph Visualizer
          </button>
        </>
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

export default App;