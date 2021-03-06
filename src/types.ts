export interface State {
  turn: number,
  score: number,
  money: number,
  hygiene: number,
  rested: number,
  drunk: number,
  sick: number,
  fed: number,
  fat: number,
  hydration: number,
  fitness: number,
};

// icon strings for states
export type StateIcons = {
  [Property in keyof State]: {
    icon?: string,
    displayName?: string,
    color?: string,
    slider?: {
      value: number,
      color: string,
    }[],
  };
}

export const StateIconMap: Partial<StateIcons> = {
  turn: { icon: '๐' },
  money: { icon: '๐ฐ' },
  fed: {icon: '๐ฒ', color: "green"},
  rested: {icon: '๐ค'},
  hydration: { icon: '๐ง', color: "lightblue" },
  fitness: { icon: '๐ช', color: "brown" },
  fat: {icon: '๐ง', color: 'yellow'},
  drunk: { icon: '๐บ', color: 'tan'},
  sick: {icon: '๐คฎ', color: "brown"},
  score: { icon: 'โจ', color: 'gold'},
  hygiene: { icon: '๐งผ', color: 'lightgreen'},
}

export const initialState: State = {
  turn: 1,
  score: 0,
  money: 0,
  hygiene: 0,
  rested: 0,
  drunk: 0,
  sick: 0,
  fed: 0,
  fat: 0,
  hydration: 0,
  fitness: 0,
}

export const maxStateValuesForDisplay: State = {
  turn: 0,
  score: 0,
  money: 0,
  hygiene: 10,
  rested: 100,
  drunk: 10,
  sick: 10,
  fed: 100,
  fat: 100,
  hydration: 100,
  fitness: 100,
}

export interface Item {
  action: (state: State) => State;
  score?: (oldState: State, newState: State) => Partial<State>; // each piece represents the SCORE gained per stat
  name: string;
  icon?: string;
  // IDK, maybe it should just be a percentage? Or do we need to convert this to that?
  rareness?: "common" | "uncommon" | "rare" | "super rare" | "totally wild bro" | "legendary";
  description?: string;
}

export interface Wheel {
  slots: Item[];
}