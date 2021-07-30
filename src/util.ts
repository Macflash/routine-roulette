import { maxStateValuesForDisplay, State, Wheel } from "./types";

export function RandomInRange(maxValue: number) {
    return Math.floor(Math.random() * maxValue);
}

export function Pick<T>(items: T[]): T {
    return items[RandomInRange(items.length)];
}

export function RollWheel(wheel: Wheel) {
    return Pick(wheel.slots);
}

export function positive(num: number) {
    return Math.max(0, num);
}

export function below(num: number, max: number) {
    return Math.min(max, num);
}

export function positiveBelow(num: number, max: number) {
    return positive(below(num, max));
}

export function increment<T>(state: T, update: Partial<T>): T {
    state = { ...state };
    for (let key in update) {
        (state as any)[key] = (state as any)[key] + (update as any)[key];
    }
    return state;
}

export function sumScores(scores: Partial<State>){
    let sum = 0;

    for(let k in scores){
        sum += (scores as any)[k];
    }

    return sum;
}

export function makeAction(update: Partial<State>) {
    return (state: State) => increment(state, update);
}

export function statOverage(state:State, key: keyof State, overageKey: keyof State, multiplier = 1){
    const max = maxStateValuesForDisplay[key];
    if (state[key] > max) {
        state[overageKey] += multiplier * (state[key] - max);
    }
}

export function UpdateStateAtEndOfTurn(state: State, incrementTurn = true): State {
    state = { ...state };

    incrementTurn && state.turn++;

    // do any fun stuff here with the new values
    statOverage(state, "fed", "fat", .1);
    statOverage(state, "drunk", "sick", 4);

    // bound all values!
    for (let key of Object.keys(state)) {
        boundStateValue(key as keyof State, state);
    }

    return state;
}

export function boundStateValue(key: keyof State, state: State) {
    if (maxStateValuesForDisplay[key] > 0) {
        state[key] = positiveBelow(state[key], maxStateValuesForDisplay[key]);
    }
    else {
        state[key] = positive(state[key]);
    }
}

export function checkStateValue(key: keyof State, state: State): boolean {
    if (maxStateValuesForDisplay[key] > 0) {
        return state[key] >= maxStateValuesForDisplay[key];
    }

    if (maxStateValuesForDisplay[key] < 0) {
        return state[key] <= maxStateValuesForDisplay[key];
    }

    return false;
}

export function CheckForGameOver(state: State): string {
    if (checkStateValue("money", state)) {
        return "You went broke!";
    }

    return '';
}