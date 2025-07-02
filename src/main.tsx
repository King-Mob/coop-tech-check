import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { type message, type roomEvent } from "./types.ts";
import { getEvents } from "./requests.ts";
import "./index.css";
import Home from "./Home.tsx";
import Admin from "./Admin.tsx";

function App() {
    const [messages, setMessages] = useState<message[]>([]);
    const [deviceId, setDeviceId] = useState("");

    async function loadMessages() {
        const events = await getEvents();
        console.log(events.chunk);

        const messages: message[] = [];
        events.chunk.forEach((event: roomEvent) => {
            if (event.type === "m.room.message" && event.content.body) {
                if (event.content["m.new_content"]) {
                    const oldMessage = messages.find(
                        (message) => message.event_id === event.content["m.relates_to"].event_id
                    );
                    if (oldMessage) oldMessage.text = event.content["m.new_content"].body;
                } else {
                    messages.push({
                        text: event.content.body,
                        reactions: [],
                        event_id: event.event_id,
                    });
                }
            }
            if (event.type === "m.reaction" && event.content["m.relates_to"]) {
                const oldMessage = messages.find(
                    (message) => message.event_id === event.content["m.relates_to"].event_id
                );
                if (oldMessage) {
                    oldMessage.reactions.push({
                        emoji: event.content["m.relates_to"].key,
                        deviceId: event.content.deviceId,
                        event_id: event.content["m.relates_to"].event_id,
                    });
                }
            }
            if (event.type === "m.room.redaction") {
            }
        });

        setMessages(messages);
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
        loadMessages();
        loadDeviceId();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Home messages={messages} deviceId={deviceId} loadMessages={loadMessages} />}
                />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
