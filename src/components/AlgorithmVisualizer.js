import React, { useState, useEffect, useRef } from "react";

function AlgorithmVisualizer({ goBack }) {
    const [array, setArray] = useState([]);
    const [size, setSize] = useState(20);
    const [algo, setAlgo] = useState("bubble");
    const [speed, setSpeed] = useState(200);

    const [current, setCurrent] = useState(-1);
    const [next, setNext] = useState(-1);

    const [comparisons, setComparisons] = useState(0);
    const [swaps, setSwaps] = useState(0);
    const [sorted, setSorted] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState("");

    const runningRef = useRef(false);
    const pauseRef = useRef(false);

    useEffect(() => generateArray(), [size]);

    const generateArray = () => {
        if (size <= 0) return;
        const arr = Array.from({ length: size }, () =>
            Math.floor(Math.random() * 300) + 20
        );
        setArray(arr);
        setSorted(false);
        setMessage("");
    };

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    const wait = async () => {
        while (pauseRef.current) await sleep(100);
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
        if (runningRef.current || size <= 0) return;

        runningRef.current = true;
        setIsRunning(true);
        setComparisons(0);
        setSwaps(0);
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

        let result = [];
        let i = 0, j = 0;

        while (i < left.length && j < right.length) {
            setComparisons((p) => p + 1);

            if (left[i] < right[j]) result.push(left[i++]);
            else result.push(right[j++]);

            setArray([...result, ...left.slice(i), ...right.slice(j)]);
            await sleep(speed);
        }

        return [...result, ...left.slice(i), ...right.slice(j)];
    };

    const partition = async (arr, low, high) => {
        let pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
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
        <div style={{ padding: "20px", textAlign: "center" }}>
            <button onClick={goBack}>⬅ Back</button>
            <h2>Algorithm Visualizer</h2>

            <input type="number" value={size} disabled={isRunning}
                onChange={(e) => setSize(Number(e.target.value))} />

            <select value={algo} disabled={isRunning}
                onChange={(e) => setAlgo(e.target.value)}>
                <option value="bubble">Bubble</option>
                <option value="selection">Selection</option>
                <option value="insertion">Insertion</option>
                <option value="merge">Merge</option>
                <option value="quick">Quick</option>
            </select>

            <select disabled={isRunning}
                onChange={(e) => setSpeed(Number(e.target.value))}>
                <option value={800}>Slow</option>
                <option value={400}>Medium</option>
                <option value={200}>Fast</option>
            </select>

            <button onClick={start} disabled={isRunning}>Start</button>
            <button onClick={() => (pauseRef.current = true)}>Pause</button>
            <button onClick={() => (pauseRef.current = false)}>Resume</button>
            <button onClick={generateArray} disabled={isRunning}>New</button>

            <div>Comparisons: {comparisons} | Swaps: {swaps}</div>

            <div><b>Time Complexity:</b> {getComplexity()}</div>

            <div style={{ fontSize: "12px" }}>
                Comparisons → element checks | Swaps → value changes
            </div>

            <div>{message}</div>

            <div style={{
                display: "flex",
                height: "300px",
                alignItems: "flex-end",
                marginTop: "40px"
            }}>
                {array.map((val, i) => (
                    <div key={i} style={{ flex: 1 }}>
                        <div>{val}</div>
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