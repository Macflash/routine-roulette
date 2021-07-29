import React from 'react';
import { initialWheel, allItems } from './actions';
import { State, maxStateValuesForDisplay, initialState, Wheel, Item, StateIconMap } from './types';
import { positive, RollWheel, Pick, CheckForGameOver, UpdateStateAtEndOfTurn } from './util';

function Slider(props: { k: keyof State, state: State }) {
  const value = props.state[props.k];
  const maxVal = maxStateValuesForDisplay[props.k];

  const icon = StateIconMap[props.k];

  const nameAndNum = <div><span style={{ fontSize: 25 }}>{icon?.icon}</span> {icon?.displayName || props.k}: {value}</div>;

  if (maxVal <= 0) { return nameAndNum; }

  let color = icon?.color ?? "grey";
  let i = 0;
  while ((i < (icon?.slider?.length ?? 0)) && (value <= (icon!.slider![i].value))) {
    color = icon!.slider![i].color;
    i++;
  }

  return <div>
    {nameAndNum}
    <div style={{ border: "2px solid black", margin: 5, backgroundColor: "#DEEDEEDEE", overflow: "hidden" }}>
      <div style={{ width: `${100 * value / maxVal}%`, backgroundColor: color, height: 15, borderRight: "2px solid black" }}></div>
    </div>
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
      <div className="Wheel" style={{ display: "flex", flexWrap: "wrap" }}>
        {wheel.slots.map((s, i) => <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 80,
            width: 80,
            textAlign: "center",
            border: "2px solid black",
            margin: 2,
            //border: selectedItem == i ? (isSpinning ? "2px solid gold" : "2px solid red") : "2px solid black",
            backgroundColor: selectedItem == i ? (isSpinning ? "yellow" : "orange") : "#DDD",
          }}
          key={i}>
          {s.name}
        </div>)}
      </div>
      {newItems ? <div className="NewItems" style={{ border: "3px solid black", margin: 10, }}>
        <div>Choose a new item to add to your routine!</div>
        {newItems.map(n => <button style={{ border: "2px solid black", height: 80, width: 80, margin: 10 }} onClick={() => {
          setNewItems(null);
          setWheel({ ...wheel, slots: [...wheel.slots, n] });
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

                if (newState.turn % 7 == 0) {
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
        {Object.keys(state).filter(k => (state as any)[k] > 0).map(k => <div key={k}>
          <Slider k={k as any} state={state} />
        </div>)}
      </div>
    </div>
  );
}

export default App;
