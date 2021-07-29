export interface State {
    turn: number,
    score: number,
    money: number,
    teethDirty: number,
    despair: number,
    tired: number,
    drunk: number,
    hunger: number,
    thirst: number,
    fitness: number,
  }
  
  export const initialState: State = {
    turn: 0,
    score: 0,
    money: 0,
    teethDirty: 0,
    despair: 0,
    tired: 0,
    drunk: 0,
    hunger: 0,
    thirst: 0,
    fitness: 0,
  }
  
  export const maxStateValuesForDisplay: State = {
    turn: 0,
    score: 0,
    money: -1000,
    teethDirty: 100,
    despair: 25,
    tired: 50,
    drunk: 10,
    hunger: 30,
    thirst: 15,
    fitness: 50,
  }
  
  export interface Item {
    action: (state: State) => State;
    description: string;
    name: string;
    // IDK, maybe it should just be a percentage? Or do we need to convert this to that?
    rareness?: "common" | "uncommon" | "rare" | "super rare" | "totally wild bro" | "legendary";
  }
  
  export interface Wheel {
    slots: Item[];
  }