import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Admin from "./Admin.tsx";
import Results from "./Results.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/results" element={<Results />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
