import React from 'react';

interface State {
  turn: number,
  score: number,
  money: number,
  teethDirty: number,
  despair: number,
  tired: number,
  drunk: number,
  hunger: number,
  thirst: number,
}

const initialState: State = {
  turn: 0,
  score: 0,
  money: 0,
  teethDirty: 0,
  despair: 0,
  tired: 0,
  drunk: 0,
  hunger: 0,
  thirst: 0,
}

const maxStateValuesForDisplay: State = {
  turn: 0,
  score: 0,
  money: -1000,
  teethDirty: 100,
  despair: 25,
  tired: 50,
  drunk: 10,
  hunger: 30,
  thirst: 15,
}

interface Item {
  action: (state: State) => State;
  description: string;
  name: string;
  // IDK, maybe it should just be a percentage? Or do we need to convert this to that?
  rareness?: "common" | "uncommon" | "rare" | "super rare" | "totally wild bro" | "legendary";
}

interface Wheel {
  slots: Item[];
}

function RandomInRange(maxValue: number) {
  return Math.floor(Math.random() * maxValue);
}

function Pick<T>(items: T[]): T {
  return items[RandomInRange(items.length)];
}

function RollWheel(wheel: Wheel) {
  return Pick(wheel.slots);
}

function positive(num: number) {
  return Math.max(0, num);
}

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

const allItems = [
  brushTeeth, work, sleep, drink, eat, drinkWater,
]

const initialWheel: Wheel = {
  slots: [
    work, sleep, eat, drinkWater,
  ]
};

function UpdateStateAtEndOfTurn(state: State): State {
  state = { ...state };

  state.turn++;

  state.drunk = positive(state.drunk--);

  state.hunger++;
  state.thirst++;

  return state;
}

function checkStateValue(key: keyof State, state: State): boolean {
  if (maxStateValuesForDisplay[key] > 0) {
    return state[key] >= maxStateValuesForDisplay[key];
  }

  if (maxStateValuesForDisplay[key] < 0) {
    return state[key] <= maxStateValuesForDisplay[key];
  }

  return false;
}

function CheckForGameOver(state: State): string {
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

function Slider(props: { k: keyof State, state: State }) {
  const value = props.state[props.k];
  const maxVal = maxStateValuesForDisplay[props.k];

  if (maxVal <= 0) { return null; }

  return <div style={{ border: "2px solid black", margin: 5 }}>
    <div style={{ width: `${100 * value / maxVal}%`, backgroundColor: "red", height: 15 }}></div>
    <div></div>
  </div>
}

function App() {
  const [state, setState] = React.useState(initialState);
  const [wheel, setWheel] = React.useState<Wheel>(initialWheel);

  const [isSpinning, setIsSpinning] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(-1);

  const [isGameOver, setIsGameOver] = React.useState('');

  const [newItems, setNewItems] = React.useState<Item[] | null>(null);

  return (
    <div className="App">
      <div style={{ display: "flex" }}>
        {wheel.slots.map((s, i) => <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 80,
            width: 80,
            textAlign: "center",
            border: selectedItem == i ? (isSpinning ? "5px solid yellow" : "5px solid red") : "2px solid black"
          }}
          key={i}>
          {s.name}
        </div>)}
      </div>
      {newItems ? <div className="NewItems" style={{border: "3px solid black", margin: 10,}}> 
      <div>Choose a new item to add to your routine!</div>
          {newItems.map(n => <button style={{border: "2px solid black", height: 80, width: 80, margin: 10}} onClick={()=>{
            setNewItems(null);
            setWheel({...wheel, slots: [...wheel.slots, n]});
          }}>{n.name}</button>)}
      </div> : null}
      <div id="Controls">
        {isGameOver ?
          <div>
            <div>GAME OVER!</div>

            <div>{isGameOver}</div>

            <div>
              <button onClick={() => {
                setState(initialState);
                setWheel(initialWheel);
                setIsGameOver('');
              }}>New game</button>
            </div>
          </div> :
          <button disabled={isSpinning || !!newItems} onClick={() => {
            // !
            setIsSpinning(true);
            const result = RollWheel(wheel);
            const interval = 150;
            let selectedItemLocal = selectedItem;

            function advanceSelection(steps: number) {
              const newSelection = selectedItemLocal++ % wheel.slots.length;
              setSelectedItem(newSelection);
              if (wheel.slots[newSelection] != result || Math.random() < .3 || steps < 3) {
                setTimeout(() => advanceSelection(steps + 1), interval);
              }
              else {
                setIsSpinning(false);

                let newState = result.action(state)
                newState = UpdateStateAtEndOfTurn(newState);
                setState(newState);
                setIsGameOver(CheckForGameOver(newState));

                if(newState.turn % 7 == 0){
                  setNewItems([
                    Pick(allItems),
                    Pick(allItems),
                    Pick(allItems),
                  ]);
                }
              }
            }

            advanceSelection(0);
          }}>
            Roll!
          </button>
        }
      </div>
      <div style={{ color: isGameOver ? "grey" : undefined }}>
        {Object.keys(state).map(k => <div key={k}>
          {k}: {(state as any)[k]}
          <Slider k={k as any} state={state} />
        </div>)}
      </div>
    </div>
  );
}

export default App;
