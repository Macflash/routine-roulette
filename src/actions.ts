import { Item, State, Wheel } from "./types";
import { positive } from "./util";

const brushTeeth: Item = {
    name: "Brush teeth",
    description: "Clean your teeth",
    action: (state: State) => {
        console.log("You brushed your teeth!");
        return {
            ...state,
            teethDirty: positive(state.teethDirty - 5),
        };
    }
}

const work: Item = {
    name: "Work",
    description: "Do your job",
    action: (state: State) => {
        console.log("You did work!");
        return {
            ...state,
            money: state.money + 10,
            despair: state.despair + 1,
            tired: state.tired + 2,
        };
    }
}

const sleep: Item = {
    name: "sleep",
    description: "Sleepy time!",
    action: (state: State) => {
        console.log("You did sleep!");
        return {
            ...state,
            tired: positive(state.tired - 40),
        };
    }
}

const drink: Item = {
    name: "drink",
    description: "Bottoms up!",
    action: (state: State) => {
        console.log("You drank!");
        return {
            ...state,
            tired: state.tired + 1,
            despair: positive(state.despair - 1),
            money: state.money - 5,
            thirst: positive(state.thirst - 5),
            drunk: state.drunk + 2,
        };
    }
}

const eat: Item = {
    name: "eat",
    description: "Yum!",
    action: (state: State) => {
        console.log("You drank!");
        return {
            ...state,
            despair: positive(state.despair - 1),
            money: state.money - 5,
            hunger: positive(state.hunger - 25),
        };
    }
}

const drinkWater: Item = {
    name: "Drink Water",
    description: "Wow!",
    action: (state: State) => {
        console.log("You drank!");
        return {
            ...state,
            thirst: positive(state.thirst - 35),
        };
    }
}

export const allItems = [
    brushTeeth,
    work,
    sleep,
    drink,
    eat,
    drinkWater,
]

export const initialWheel: Wheel = {
    slots: [
        work, sleep, eat, drinkWater,
    ]
}; 