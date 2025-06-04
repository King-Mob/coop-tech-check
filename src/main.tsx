import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { type reaction } from "./types.ts";
import { getReactions } from "./requests.ts";
import "./index.css";
import Home from "./Home.tsx";
import Reaction from "./Reaction.tsx";

function App() {
    const [reactions, setReactions] = useState<reaction[]>([]);
    const [deviceId, setDeviceId] = useState("");

    async function loadReactions() {
        const reactions = await getReactions();
        setReactions(reactions);
    }

    function loadDeviceId() {
        const existingId = localStorage.getItem("coopTechCheckDeviceId");
        if (existingId) {
            setDeviceId(existingId);
        } else {
            const newId = uuidv4();
            setDeviceId(newId);
            localStorage.setItem("coopTechCheckDeviceId", newId);
        }
    }

    useEffect(() => {
        loadReactions();
        loadDeviceId();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Home reactions={reactions} deviceId={deviceId} loadReactions={loadReactions} />}
                />
                <Route
                    path="/reactions/:reaction"
                    element={<Reaction reactions={reactions} deviceId={deviceId} loadReactions={loadReactions} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
