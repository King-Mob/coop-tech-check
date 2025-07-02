import { type roomEvent } from "./types";
const { VITE_HOMESERVER, VITE_ROOM_ID, VITE_ACCESS_TOKEN } = import.meta.env;

export const getEvents = async () => {
    const eventsResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/messages?limit=10000&dir=f`,
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

export const postMessage = async (message: string) => {
    const postResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/send/m.room.message`, {
        method: "POST",
        body: JSON.stringify({
            body: message,
            msgtype: "m.text",
        }),
        headers: {
            Authorization: `Bearer ${VITE_ACCESS_TOKEN}`,
        },
    });
    const postResult = await postResponse.json();
    return postResult;
};

export const putMessage = async (message: string, event_id: string) => {
    const putResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/send/m.room.message/123`,
        {
            method: "PUT",
            body: JSON.stringify({
                body: "* " + message,
                "m.new_content": { msgtype: "m.text", body: message },
                "m.relates_to": { rel_type: "m.replace", event_id },
                msgtype: "m.text",
            }),
            headers: {
                Authorization: `Bearer ${VITE_ACCESS_TOKEN}`,
            },
        }
    );
    const putResult = await putResponse.json();
    return putResult;
};

export const redactEvent = async (event_id: string, reason: string) => {
    const redactResponse = await fetch(
        `${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/redact/${event_id}/123`,
        {
            method: "PUT",
            body: JSON.stringify({
                reason,
            }),
            headers: {
                Authorization: `Bearer ${VITE_ACCESS_TOKEN}`,
            },
        }
    );
    const redactResult = await redactResponse.json();
    return redactResult;
};

export const postReaction = async (event_id: string, reaction: string, deviceId: string) => {
    const postResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/rooms/${VITE_ROOM_ID}/send/m.reaction`, {
        method: "POST",
        body: JSON.stringify({
            "m.relates_to": {
                event_id,
                key: reaction,
                rel_type: "m.annotation",
            },
            deviceId,
        }),
        headers: {
            Authorization: `Bearer ${VITE_ACCESS_TOKEN}`,
        },
    });
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
