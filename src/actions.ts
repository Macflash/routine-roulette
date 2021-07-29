import { Item, State, Wheel } from "./types";
import { increment, makeAction, positive } from "./util";

const brushTeeth: Item = {
    name: "Brush teeth",
    icon: "🦷",
    action: makeAction({ hygiene: 5 }),
}

const work: Item = {
    name: "Work",
    icon: '👔',
    action: makeAction({ money: 25, rested: -10 }),
    score: (oldState, newState) => ({money: Math.floor(newState.money / 100)}),
}

const sleep: Item = {
    name: "sleep",
    icon: '🛏️',
    action: makeAction({rested: 50}),
    score: (oldState, newState) => ({rested: Math.floor(newState.rested / 10)}),
}

const eat: Item = {
    name: "Eat food",
    action: makeAction({ fed: 50 }),
    score: (oldState, newState) => ({fed: Math.floor((100 - oldState.fed) / 10)}),
}

const drinkWater: Item = {
    name: "Drink Water",
    action: state => increment(state, { hydration: 50 }),
    score: (oldState, newState) => ({hydration: Math.floor((100 - oldState.hydration) / 10)}),
}

export const allItems: Item[] = [
    brushTeeth,
    work,
    sleep,
    eat,
    drinkWater,
    {
        name: "Yoga",
        action: (state) => ({ ...state, fitness: state.fitness + 5 }),
    },
    {
        name: "Beer",
        action: state => ({ ...state, drunk: state.drunk + 1 })
    }
]

export const initialWheel: Wheel = {
    slots: [
        work, sleep, eat, drinkWater,
    ]
};