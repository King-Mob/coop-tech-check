import { type question, type stateEvent, type roomEvent, type answer } from "./types";
const { VITE_HOMESERVER, VITE_ROOM_ID, VITE_ACCESS_TOKEN } = import.meta.env;

export const getQuestions = async () => {
    const roomStateResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/state`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${VITE_ACCESS_TOKEN}`,
        },
    });
    const roomStateEvents: stateEvent[] = await roomStateResponse.json();
    const questionStateEvent = roomStateEvents.find((stateEvent) => stateEvent.type === "cooptech.questions.event");

    if (questionStateEvent) return questionStateEvent.content.questions;
    else return [];
};

export const putQuestions = async (questions: question[]) => {
    const roomStateResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/state/cooptech.questions.event`,
        {
            method: "PUT",
            body: JSON.stringify({ questions }),
            headers: {
                Authorization: `Bearer ${VITE_ACCESS_TOKEN}`,
            },
        }
    );
    const roomState = await roomStateResponse.json();
    return roomState;
};

export const getEvents = async () => {
    const eventsResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/messages?limit=10000&dir=b`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${VITE_ACCESS_TOKEN}`,
            },
        }
    );
    const events = await eventsResponse.json();
    return events;
};

export const getAnswers = async () => {
    const events = await getEvents();
    const answers = events.chunk
        .filter((event: roomEvent) => event.type === "cooptech.answer.event")
        .map((event: roomEvent) => event.content);
    return answers;
};

export const getAnswer = async (questionId: number, deviceId: string) => {
    const events = await getEvents();
    const answer = events.chunk.find(
        (event: roomEvent) =>
            event.type === "cooptech.answer.event" &&
            event.content.deviceId === deviceId &&
            event.content.questionId === questionId
    );
    return answer;
};

export const redactAnswer = async (answerId: string) => {
    const redactResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/redact/${answerId}/${Date.now()}`,
        {
            method: "PUT",
            body: JSON.stringify({
                reason: "Answer replaced by a new one",
            }),
            headers: {
                Authorization: `Bearer ${VITE_ACCESS_TOKEN}`,
            },
        }
    );
    const redactResult = await redactResponse.json();
    return redactResult;
};

export const postAnswer = async (answer: answer) => {
    const postResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/send/cooptech.answer.event`,
        {
            method: "POST",
            body: JSON.stringify(answer),
            headers: {
                Authorization: `Bearer ${VITE_ACCESS_TOKEN}`,
            },
        }
    );
    const postResult = await postResponse.json();
    return postResult;
};

export const getSync = async () => {
    const syncResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/sync`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${VITE_ACCESS_TOKEN}`,
        },
    });

    const syncResult = await syncResponse.json();
    return syncResult;
};
