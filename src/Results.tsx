import { useEffect, useState } from "react";
import { type answer, type question, type answersByQuestion } from "./types";
import { getSync, getQuestions, getAnswers } from "./requests";

function BarChart({ question, answers }: { question: question; answers: answer[] }) {
    const answersByOption: { [key: string]: number } = {};
    question.options.forEach((option) => {
        answersByOption[option] = 0;
    });
    answers.forEach((answer) => {
        answer.options.forEach((chosenOption) => {
            if (answersByOption[chosenOption] !== undefined) {
                answersByOption[chosenOption]++;
            }
        });
    });

    return (
        <div>
            {question.options.map((option) => (
                <div>
                    {option}: {answersByOption[option]}
                </div>
            ))}
        </div>
    );
}

function WordCloud({ question, answers }: { question: question; answers: answer[] }) {
    const newAnswers = answers
        ? answers.flatMap((answer) => answer.options.filter((option) => !question.options.includes(option)))
        : [];

    console.log(newAnswers);

    return (
        <div>
            {newAnswers.map((answer) => (
                <p>{answer}</p>
            ))}
        </div>
    );
}

function Results() {
    const [answers, setAnswers] = useState<answersByQuestion>({});
    const [questions, setQuestions] = useState<question[]>([]);

    async function loadQuestionsAndAnswers() {
        const questionsResult: question[] = await getQuestions();
        setQuestions(questionsResult);

        const answersList: answer[] = await getAnswers();
        const answersByQuestion: answersByQuestion = {};
        answersList.forEach((answer) => {
            if (answersByQuestion[answer.questionId]) {
                answersByQuestion[answer.questionId].push(answer);
            } else {
                answersByQuestion[answer.questionId] = [answer];
            }
        });
        setAnswers(answersByQuestion);
    }

    async function startSync() {
        //const syncResult = await getSync();
    }

    useEffect(() => {
        loadQuestionsAndAnswers();
        startSync();
    }, []);

    return (
        <div>
            <h1>Results</h1>
            {questions.map((question) => (
                <div>
                    <h2>{question.title}</h2>
                    <h3>{question.subtitle}</h3>
                    {question.options.length > 0 && answers[question.id] && (
                        <BarChart question={question} answers={answers[question.id]} />
                    )}
                    {(question.options.includes("other") || question.options.length === 0) && answers[question.id] && (
                        <WordCloud question={question} answers={answers[question.id]} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default Results;
