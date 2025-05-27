import { useEffect, useState } from "react";
import { getQuestions, putQuestions } from "./requests";
import { type question } from "./types";
import { QuestionAdmin } from "./Question";

function Admin() {
    const [questions, setQuestions] = useState<question[]>([]);

    async function loadQuestions() {
        const result = await getQuestions();
        setQuestions(result);
    }

    useEffect(() => {
        loadQuestions();
    }, []);

    async function saveQuestions() {
        await putQuestions(questions);
        await loadQuestions();
    }

    function addQuestion(question: question) {
        setQuestions(questions.concat([question]));
    }

    function updateQuestion(question: question, index: number) {
        setQuestions(
            questions
                .slice(0, index)
                .concat([question])
                .concat(questions.slice(index + 1))
        );
    }

    function removeQuestion(index: number) {
        setQuestions(questions.slice(0, index).concat(questions.slice(index + 1)));
    }

    function downloadAnswers() {
        console.log("this would download a csv");
    }

    return (
        <div>
            <h1>Admin Panel</h1>
            <button onClick={downloadAnswers}>Download Answers</button>
            <h2>Edit Questions</h2>
            {questions.map((question, index) => (
                <QuestionAdmin question={question} index={index} update={updateQuestion} remove={removeQuestion} />
            ))}
            <button
                onClick={() =>
                    addQuestion({
                        id: Date.now(),
                        title: "",
                        subtitle: "",
                        options: [],
                    })
                }
            >
                New Question
            </button>
            <br />
            <button onClick={saveQuestions}>Save</button>
            <br />
        </div>
    );
}

export default Admin;
