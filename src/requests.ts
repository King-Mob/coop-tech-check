import { type question, type stateEvent } from "./types";
const { VITE_HOMESERVER, VITE_ROOM_ID, VITE_ACCESS_TOKEN } = import.meta.env;

export const loadQuestions = async () => {
    const roomStateResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/state`, {
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
