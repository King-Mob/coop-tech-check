import { type question, type answer } from "./types";
import { useState, useEffect } from "react";
import { getAnswer, redactAnswer, postAnswer } from "./requests";

export function QuestionAdmin({
    question,
    index,
    update,
    remove,
}: {
    question: question;
    index: number;
    update: (question: question, index: number) => void;
    remove: (index: number) => void;
}) {
    return (
        <div>
            <input
                value={question.title}
                onChange={(e) => update({ ...question, title: e.target.value }, index)}
                placeholder="Question title"
            ></input>
            <br />
            <input
                value={question.subtitle}
                onChange={(e) => update({ ...question, subtitle: e.target.value }, index)}
                placeholder="Question subtitle"
            ></input>
            <br />
            <label>Options</label>
            <br />
            {question.options &&
                question.options.map((option, i) => (
                    <div>
                        <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                                update(
                                    {
                                        ...question,
                                        options: question.options
                                            ?.slice(0, i)
                                            .concat([e.target.value])
                                            .concat(question.options.slice(i + 1)),
                                    },
                                    index
                                )
                            }
                        ></input>
                        <button
                            onClick={() =>
                                update(
                                    {
                                        ...question,
                                        options: question.options?.slice(0, i).concat(question.options.slice(i + 1)),
                                    },
                                    index
                                )
                            }
                        >
                            Remove
                        </button>
                    </div>
                ))}
            <button onClick={() => update({ ...question, options: question.options?.concat([""]) }, index)}>
                New Option
            </button>
            <button onClick={() => remove(index)}>Remove</button>
        </div>
    );
}

export function QuestionUser({ question, deviceId }: { question: question; deviceId: string }) {
    const [answer, setAnswer] = useState<answer>({ deviceId, questionId: question.id, options: [] });
    const [oldAnswerId, setOldAnswerId] = useState<string>();

    async function loadAnswer() {
        const answerResult = await getAnswer(question.id, deviceId);
        if (answerResult) {
            setAnswer(answerResult.content);
            console.log(answerResult);
            setOldAnswerId(answerResult.event_id);
        }
    }

    async function saveAnswer() {
        if (oldAnswerId) {
            redactAnswer(oldAnswerId);
        }

        postAnswer(answer);
    }

    useEffect(() => {
        loadAnswer();
    }, []);

    async function toggleOption(option: string, checked: boolean) {
        if (checked) {
            setAnswer({ ...answer, options: answer.options.concat([option]) });
        } else {
            setAnswer({ ...answer, options: answer.options.filter((op) => op !== option) });
        }
    }

    async function editOther(text: string) {
        const prevText = answer.options.find((option) => !question.options.includes(option));
        const newOptions = answer.options.filter((option) => option !== prevText).concat([text]);

        setAnswer({ ...answer, options: newOptions });
    }

    return (
        <div>
            <h2>{question.title}</h2>
            <h3>{question.subtitle}</h3>
            {question.options.map((option) => (
                <>
                    <input
                        type="checkbox"
                        checked={answer.options.includes(option)}
                        onChange={(e) => toggleOption(option, e.target.checked)}
                    ></input>
                    <label>{option}</label>
                </>
            ))}
            {(question.options.includes("other") || question.options.length === 0) && (
                <input
                    type="text"
                    placeholder="text answer"
                    value={answer.options.filter((option) => !question.options.includes(option))}
                    onChange={(e) => editOther(e.target.value)}
                ></input>
            )}
            <button onClick={saveAnswer}>Save</button>
        </div>
    );
}
