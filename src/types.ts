export type reaction = {
    emoji: string;
    note: string;
    deviceId: string;
};

export type reactionSummary = {
    emoji: string;
    count: number;
};

export type roomEvent = {
    type: string;
    [key: string]: any;
};
