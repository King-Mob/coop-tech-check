export type question = {
    id: number;
    title: string;
    subtitle: string;
    options: string[];
};

export type answer = {
    questionId: number;
    deviceId: string;
    options: string[];
};

export type answersByQuestion = {
    [key: question["id"]]: answer[];
};

export type stateEvent = {
    type: string;
    [key: string]: any;
};

export type roomEvent = {
    type: string;
    [key: string]: any;
};
