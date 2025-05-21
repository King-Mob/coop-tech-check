type quantative = {
    type: "quantative";
    title: string;
    subtitle: string;
    options: string[];
};

type qualitative = {
    type: "qualitative";
    title: string;
    subtitle: string;
};

export type question = quantative | qualitative;

export type stateEvent = {
    type: string;
    [key: string]: any;
};
