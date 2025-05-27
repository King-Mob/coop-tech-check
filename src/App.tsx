import "./App.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { question } from "./types";
import { getQuestions } from "./requests";
import { QuestionUser } from "./Question";
import { Link } from "react-router";

function App() {
    const [questions, setQuestions] = useState<question[]>([]);
    const [deviceId, setDeviceId] = useState<string>();

    async function loadQuestions() {
        const result = await getQuestions();
        setQuestions(result);
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
        loadQuestions();
        loadDeviceId();
    }, []);

    return (
        <>
            <h1>Coop Tech Check</h1>
            {deviceId && questions.map((question) => <QuestionUser question={question} deviceId={deviceId} />)}
            <Link to="/results">
                <h2>See results</h2>
            </Link>
        </>
    );
}

export default App;
