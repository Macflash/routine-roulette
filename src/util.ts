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

export function UpdateStateAtEndOfTurn(state: State): State {
    state = { ...state };

    state.turn++;

    state.drunk = positive(state.drunk--);

    state.hunger++;
    state.thirst++;

    state.fitness = positive(state.fitness - 1);

    return state;
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
    if (checkStateValue("tired", state)) {
        return "You got so tired you died!";
    }
    if (checkStateValue("despair", state)) {
        return "You got too sad!";
    }
    if (checkStateValue("money", state)) {
        return "You went broke!";
    }
    if (checkStateValue("teethDirty", state)) {
        return "Your teeth fell out!";
    }
    if (checkStateValue("drunk", state)) {
        return "You got too drunk!";
    }
    if (checkStateValue("hunger", state)) {
        return "You starved!";
    }
    if (checkStateValue("thirst", state)) {
        return "You forgot to hydrate, homie!";
    }

    return '';
}