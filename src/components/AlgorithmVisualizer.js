import React, { useState, useEffect, useRef } from "react";

function AlgorithmVisualizer({ goBack }) {
    const [array, setArray] = useState([]);
    const [size, setSize] = useState(20);
    const [algo, setAlgo] = useState("bubble");
    const [speed, setSpeed] = useState(600); // default medium

    const [current, setCurrent] = useState(-1);
    const [next, setNext] = useState(-1);

    const [comparisons, setComparisons] = useState(0);
    const [swaps, setSwaps] = useState(0);
    const [sorted, setSorted] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState("");
    const [paused, setPaused] = useState(false);

    const runningRef = useRef(false);
    const pauseRef = useRef(false);

    useEffect(() => generateArray(), [size]);

    const generateArray = () => {
        const arr = Array.from({ length: size }, () =>
            Math.floor(Math.random() * 300) + 20
        );
        setArray(arr);
        setSorted(false);
        setMessage("");
        setComparisons(0);
        setSwaps(0);
    };

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    const wait = async () => {
        while (pauseRef.current) {
            await sleep(50);
        }
    };

    const togglePause = () => {
        setPaused((prev) => {
            pauseRef.current = !prev;
            return !prev;
        });
    };

    const getComplexity = () => {
        switch (algo) {
            case "bubble":
            case "selection":
            case "insertion":
                return "O(n²)";
            case "merge":
            case "quick":
                return "O(n log n)";
            default:
                return "";
        }
    };

    const start = async () => {
        if (runningRef.current) return;

        runningRef.current = true;
        setIsRunning(true);
        setSorted(false);
        setMessage("");

        let arr = [...array];

        if (algo === "bubble") await bubbleSort(arr);
        if (algo === "selection") await selectionSort(arr);
        if (algo === "insertion") await insertionSort(arr);
        if (algo === "merge") arr = await mergeSort(arr);
        if (algo === "quick") await quickSort(arr, 0, arr.length - 1);

        setArray([...arr]);
        setSorted(true);
        setMessage(`Sorting Completed | Time: ${getComplexity()}`);

        runningRef.current = false;
        setIsRunning(false);
        setCurrent(-1);
        setNext(-1);
    };

    const resetAll = () => {
        runningRef.current = false;
        pauseRef.current = false;
        setPaused(false);
        setIsRunning(false);
        generateArray();
    };

    // ===== SORTING =====

    const bubbleSort = async (arr) => {
        for (let i = 0; i < arr.length - 1; i++) {
            let swapped = false;
            for (let j = 0; j < arr.length - i - 1; j++) {
                await wait();
                setComparisons((p) => p + 1);

                setCurrent(j);
                setNext(j + 1);

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setSwaps((p) => p + 1);
                    swapped = true;
                }

                setArray([...arr]);
                await sleep(speed);
            }
            if (!swapped) break;
        }
    };

    const selectionSort = async (arr) => {
        for (let i = 0; i < arr.length; i++) {
            let min = i;
            for (let j = i + 1; j < arr.length; j++) {
                await wait();
                setComparisons((p) => p + 1);

                setCurrent(min);
                setNext(j);

                if (arr[j] < arr[min]) min = j;
                await sleep(speed);
            }

            if (min !== i) {
                [arr[i], arr[min]] = [arr[min], arr[i]];
                setSwaps((p) => p + 1);
            }

            setArray([...arr]);
        }
    };

    const insertionSort = async (arr) => {
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;

            while (j >= 0 && arr[j] > key) {
                await wait();
                setComparisons((p) => p + 1);

                setCurrent(j);
                setNext(j + 1);

                arr[j + 1] = arr[j];
                j--;
                setSwaps((p) => p + 1);

                setArray([...arr]);
                await sleep(speed);
            }
            arr[j + 1] = key;
        }
    };

    const mergeSort = async (arr) => {
        if (arr.length <= 1) return arr;

        const mid = Math.floor(arr.length / 2);
        const left = await mergeSort(arr.slice(0, mid));
        const right = await mergeSort(arr.slice(mid));

        let result = [], i = 0, j = 0;

        while (i < left.length && j < right.length) {
            await wait();
            setComparisons((p) => p + 1);

            result.push(left[i] < right[j] ? left[i++] : right[j++]);

            setArray([...result, ...left.slice(i), ...right.slice(j)]);
            await sleep(speed);
        }

        return [...result, ...left.slice(i), ...right.slice(j)];
    };

    const partition = async (arr, low, high) => {
        let pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            await wait();
            setComparisons((p) => p + 1);

            setCurrent(j);
            setNext(high);

            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setSwaps((p) => p + 1);
            }

            setArray([...arr]);
            await sleep(speed);
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    };

    const quickSort = async (arr, low, high) => {
        if (low < high) {
            let pi = await partition(arr, low, high);
            await quickSort(arr, low, pi - 1);
            await quickSort(arr, pi + 1, high);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <button onClick={goBack}>⬅ Back</button>

            <h2>Algorithm Visualizer</h2>

            {/* CONTROL PANEL */}
            <div style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                flexWrap: "wrap",
                background: "#fff",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
                <select value={algo} disabled={isRunning}
                    onChange={(e) => setAlgo(e.target.value)}>
                    <option value="bubble">Bubble</option>
                    <option value="selection">Selection</option>
                    <option value="insertion">Insertion</option>
                    <option value="merge">Merge</option>
                    <option value="quick">Quick</option>
                </select>

                <input type="number" value={size} disabled={isRunning}
                    onChange={(e) => setSize(Number(e.target.value))} />

                {/* 🔥 SPEED SLIDER */}
                <input
                    type="range"
                    min="50"
                    max="1500"
                    value={speed}
                    disabled={isRunning}
                    style={{ opacity: isRunning ? 0.5 : 1 }}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                />

                <span>{speed} ms</span>

                <button onClick={start} disabled={isRunning}>Start</button>

                <button onClick={togglePause} disabled={!isRunning}>
                    {paused ? "Resume" : "Pause"}
                </button>

                <button onClick={resetAll}>Reset</button>
            </div>

            <div>Comparisons: {comparisons} | Swaps: {swaps}</div>
            <div><b>Time Complexity:</b> {getComplexity()}</div>
            <div>{message}</div>

            {/* VISUAL */}
            <div style={{
                display: "flex",
                height: "300px",
                alignItems: "flex-end",
                marginTop: "30px"
            }}>
                {array.map((val, i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: "10px" }}>{val}</div>

                        <div style={{
                            height: val,
                            background: sorted
                                ? "green"
                                : i === current
                                    ? "red"
                                    : i === next
                                        ? "blue"
                                        : "pink"
                        }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AlgorithmVisualizer;