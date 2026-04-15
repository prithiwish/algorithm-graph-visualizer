import React, { useState, useRef } from "react";

function GraphVisualizer({ goBack }) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selected, setSelected] = useState(null);
    const [mode, setMode] = useState("node");
    const [directed, setDirected] = useState(false);
    const [visited, setVisited] = useState([]);
    const [order, setOrder] = useState([]);

    const containerRef = useRef(null);

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    // 🔹 ADD NODE
    const addNode = (e) => {
        if (mode !== "node") return;

        const rect = containerRef.current.getBoundingClientRect();

        setNodes((prev) => [
            ...prev,
            {
                id: prev.length,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            },
        ]);
    };

    // 🔹 ADD EDGE
    const handleNodeClick = (node) => {
        if (mode !== "edge") return;

        if (!selected) {
            setSelected(node);
        } else if (selected.id !== node.id) {
            setEdges((prev) => [
                ...prev,
                { from: selected.id, to: node.id },
            ]);
            setSelected(null);
        }
    };

    // 🔹 GET NEIGHBORS
    const getNeighbors = (id) => {
        let res = [];

        edges.forEach((e) => {
            if (e.from === id) res.push(e.to);
            if (!directed && e.to === id) res.push(e.from);
        });

        return res;
    };

    // 🔹 BFS
    const bfs = async () => {
        if (nodes.length === 0) return;

        setVisited([]);
        setOrder([]);

        let queue = [0];
        let vis = new Array(nodes.length).fill(false);
        let result = [];

        while (queue.length) {
            let node = queue.shift();

            if (!vis[node]) {
                vis[node] = true;
                result.push(node);

                setVisited([...result]);
                setOrder([...result]);

                await sleep(600);

                getNeighbors(node).forEach((n) => {
                    if (!vis[n]) queue.push(n);
                });
            }
        }
    };

    // 🔹 DFS
    const dfs = async () => {
        if (nodes.length === 0) return;

        setVisited([]);
        setOrder([]);

        let stack = [0];
        let vis = new Array(nodes.length).fill(false);
        let result = [];

        while (stack.length) {
            let node = stack.pop();

            if (!vis[node]) {
                vis[node] = true;
                result.push(node);

                setVisited([...result]);
                setOrder([...result]);

                await sleep(600);

                getNeighbors(node).forEach((n) => {
                    if (!vis[n]) stack.push(n);
                });
            }
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <button onClick={goBack}>⬅ Back</button>

            <h2>Graph Visualizer</h2>

            {/* CONTROLS */}
            <div style={{ marginBottom: "10px" }}>
                <button onClick={() => setMode("node")}>Add Node</button>
                <button onClick={() => setMode("edge")}>Add Edge</button>

                <label style={{ marginLeft: "10px" }}>
                    Directed
                    <input
                        type="checkbox"
                        onChange={(e) => setDirected(e.target.checked)}
                    />
                </label>

                <button onClick={bfs} style={{ marginLeft: "10px" }}>
                    BFS
                </button>

                <button onClick={dfs}>DFS</button>
            </div>

            {/* TRAVERSAL ORDER */}
            <h3>
                Traversal Order:{" "}
                {order.length ? order.map((n) => n + 1).join(" → ") : "None"}
            </h3>

            {/* GRAPH AREA */}
            <div
                ref={containerRef}
                onClick={addNode}
                style={{
                    width: "100%",
                    height: "500px",
                    position: "relative",
                    border: "1px solid black",
                }}
            >
                {/* SVG EDGES */}
                <svg width="100%" height="100%">
                    <defs>
                        <marker
                            id="arrow"
                            viewBox="0 0 10 10"
                            refX="8"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                        >
                            <path d="M0,0 L10,5 L0,10 Z" fill="black" />
                        </marker>
                    </defs>

                    {edges.map((e, i) => {
                        const from = nodes[e.from];
                        const to = nodes[e.to];

                        if (!from || !to) return null; // 🔥 safety

                        const dx = to.x - from.x;
                        const dy = to.y - from.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        const offset = 25;

                        const newX = to.x - (dx / dist) * offset;
                        const newY = to.y - (dy / dist) * offset;

                        return (
                            <line
                                key={i}
                                x1={from.x}
                                y1={from.y}
                                x2={newX}
                                y2={newY}
                                stroke="black"
                                strokeWidth="2"
                                markerEnd={directed ? "url(#arrow)" : ""}
                            />
                        );
                    })}
                </svg>

                {/* NODES */}
                {nodes.map((node) => (
                    <div
                        key={node.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNodeClick(node);
                        }}
                        style={{
                            position: "absolute",
                            left: node.x - 20,
                            top: node.y - 20,
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: visited.includes(node.id)
                                ? "green"
                                : selected?.id === node.id
                                    ? "blue"
                                    : "red",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        {node.id + 1}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GraphVisualizer;