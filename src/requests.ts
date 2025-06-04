import { type roomEvent, type reaction } from "./types";
const { VITE_HOMESERVER, VITE_ROOM_ID, VITE_ACCESS_TOKEN } = import.meta.env;

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

export const getReactions = async () => {
    const events = await getEvents();

    const reactions = events.chunk
        .filter((event: roomEvent) => event.type === "cooptech.reaction.event")
        .map((event: roomEvent) => event.content);
    return reactions;
};

export const postReaction = async (reaction: reaction) => {
    const postResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/send/cooptech.reaction.event`,
        {
            method: "POST",
            body: JSON.stringify(reaction),
            headers: {
                Authorization: `Bearer ${VITE_ACCESS_TOKEN}`,
            },
        }
    );
    const postResult = await postResponse.json();
    return postResult;
};
