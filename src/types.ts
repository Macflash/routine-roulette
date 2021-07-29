export interface State {
  turn: number,
  score: number,
  money: number,
  hygiene: number,
  fun: number,
  rested: number,
  drunk: number,
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
  turn: { icon: '📅' },
  money: { icon: '💰' },
  fed: {icon: '🍲', color: "green"},
  rested: {icon: '💤'},
  hydration: { icon: '💧', color: "lightblue" },
  fitness: { icon: '💪', color: "brown" },
  fat: {icon: '🧈', color: 'yellow'},
  drunk: { icon: '🍺', color: 'brown'},
  fun: { icon: '✨', color: 'gold'},
  hygiene: { icon: '🧼', color: 'lightgreen'}
}

export const initialState: State = {
  turn: 1,
  score: 0,
  money: 0,
  hygiene: 0,
  fun: 0,
  rested: 0,
  drunk: 0,
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
  fun: 100,
  rested: 100,
  drunk: 15,
  fed: 100,
  fat: 100,
  hydration: 100,
  fitness: 100,
}

export interface Item {
  action: (state: State) => State;
  name: string;
  icon?: string;
  // IDK, maybe it should just be a percentage? Or do we need to convert this to that?
  rareness?: "common" | "uncommon" | "rare" | "super rare" | "totally wild bro" | "legendary";
  description?: string;
}

export interface Wheel {
  slots: Item[];
}