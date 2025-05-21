import { useEffect, useState } from "react";
import { loadQuestions, putQuestions } from "./requests";
import { type question } from "./types";

function Question({ question }: { question: question }) {
    return (
        <div>
            <h2>{question.title}</h2>
            <h3>{question.subtitle}</h3>
            {question.type === "quantative" && question.options.map((option) => <div key={option}>{option}</div>)}
            {question.type === "qualitative" && <input type="text"></input>}
        </div>
    );
}

function Admin() {
    const [questions, setQuestions] = useState<question[]>([]);

    async function getQuestions() {
        const result = await loadQuestions();
        setQuestions(result);
    }

    useEffect(() => {
        getQuestions();
    }, []);

    async function saveQuestions() {
        await putQuestions(questions);
        await getQuestions();
    }

    return (
        <div>
            <h1>Admin Panel</h1>
            {questions.map((question) => (
                <Question question={question} key={question.title} />
            ))}
            <button onClick={saveQuestions}>Save</button>
        </div>
    );
}

export default Admin;
