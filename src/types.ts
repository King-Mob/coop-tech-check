export type reaction = {
    emoji: string;
    deviceId: string;
    event_id: string;
};

export type reactionSummary = {
    emoji: string;
    count: number;
};

export type roomEvent = {
    type: string;
    [key: string]: any;
};

export type message = {
    text: string;
    reactions: reaction[];
    event_id: string;
};
