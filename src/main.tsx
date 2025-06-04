import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Home from "./Home.tsx";
import Reaction from "./Reaction.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/reactions/:reaction" element={<Reaction />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
