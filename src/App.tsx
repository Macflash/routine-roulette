import React from 'react';
import { initialWheel, allItems } from './actions';
import { State, maxStateValuesForDisplay, initialState, Wheel, Item, StateIconMap } from './types';
import { positive, RollWheel, Pick, CheckForGameOver, UpdateStateAtEndOfTurn, sumScores } from './util';

function Slider(props: { k: keyof State, state: State, score?: number }) {
  const value = props.state[props.k];
  const maxVal = maxStateValuesForDisplay[props.k];

  const icon = StateIconMap[props.k];

  const nameAndNum = <div>
    <span style={{ fontSize: 25 }}>{icon?.icon}</span> {icon?.displayName || props.k}: {value} {props.score ? <span style={{ fontWeight: "bold", color: "red", fontSize: 20 }}>+{props.score}</span> : null}
  </div>;

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
  const [isScoring, setIsScoring] = React.useState<Partial<State> | null>(null);
  const [selectedItem, setSelectedItem] = React.useState(-1);

  const [isGameOver, setIsGameOver] = React.useState('');

  const [newItems, setNewItems] = React.useState<Item[] | null>(null);

  const [selectedNewItem, setSelectedNewItem] = React.useState(-1);

  return (
    <div className="App">
      <div className="Wheel" style={{ display: "flex", flexWrap: "wrap" }}>
        {wheel.slots.map((s, i) => <div style={{display: "flex", alignItems: "center"}}>
          {newItems && selectedNewItem >= 0 ? <button onClick={() => {
            const newSlots = [...wheel.slots];
            newSlots.splice(i, 0, newItems[selectedNewItem]);
            setWheel({ ...wheel, slots: newSlots });
            setSelectedNewItem(-1);
            setNewItems(null);
          }}>+</button> : null}
          <div
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
          </div>
        </div>)}
      </div>
      {newItems ? <div className="NewItems" style={{ border: "3px solid black", margin: 10, }}>
        <div>Choose a new item to add to your routine!</div>
        {newItems.map((n, i) => <button style={{ border: "2px solid black", height: 80, width: 80, margin: 10, backgroundColor: selectedNewItem == i ? "lightblue" : undefined }} onClick={() => {
          setSelectedNewItem(i);
          // setWheel({ ...wheel, slots: [...wheel.slots, n] });
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
          <div>
            <button disabled={true || isSpinning || !!newItems} onClick={() => {
              // !
              setIsSpinning(true);
              setIsScoring(null);
              const result = RollWheel(wheel);
              const interval = 150;
              let selectedItemLocal = selectedItem;

              function updateWhenSelected() {
                let newState = result.action({ ...state })
                newState = UpdateStateAtEndOfTurn(newState);
                setState(newState);

                // SHOW the score!
                const scores = result.score?.({ ...state }, newState);
                if (scores) {
                  setIsScoring(scores);
                  // animateScoring(scores, 0);
                  newState.score += sumScores(scores);
                }

                setIsSpinning(false);
                setIsGameOver(CheckForGameOver(newState));

                if (newState.turn % 7 == 0) {
                  setNewItems([
                    Pick(allItems),
                    Pick(allItems),
                    Pick(allItems),
                  ]);
                }
              }

              function advanceSelection(steps: number) {
                const newSelection = selectedItemLocal++ % wheel.slots.length;
                setSelectedItem(newSelection);
                if (wheel.slots[newSelection] != result || Math.random() < .3 || steps < 3) {
                  setTimeout(() => advanceSelection(steps + 1), interval);
                }
                else {
                  updateWhenSelected();
                }
              }

              advanceSelection(0);
            }}>
              Roll!
            </button>
            <button disabled={isSpinning || !!newItems} onClick={() => {
              // RUN A FULL DAY OF YOUR ROUTINE
              setIsSpinning(true);
              setIsScoring(null);

              // Go through ALL actions in ORDER (unless modifiers do things later)
              function DoTaskAndAdvance(oldState: State, i: number) {
                if (i >= wheel.slots.length) {
                  setSelectedItem(-1);
                  setIsSpinning(false);
                  setIsScoring(null);

                  if (state.turn % 7 == 0) {
                    setNewItems([
                      Pick(allItems),
                      Pick(allItems),
                      Pick(allItems),
                    ]);
                  }

                  return;
                }

                setSelectedItem(i);
                const task = wheel.slots[i];

                // update state
                let newState = task.action({ ...oldState });
                newState = UpdateStateAtEndOfTurn(newState, i == 0);

                const scores = task.score?.({ ...oldState }, { ...newState });
                if (scores) {
                  setIsScoring(scores);
                  newState.score += sumScores(scores);
                }
                else {
                  setIsScoring(null);
                }

                setState(newState);
                setIsGameOver(CheckForGameOver(newState));
                setTimeout(() => { DoTaskAndAdvance(newState, i + 1) }, 250);
              }

              DoTaskAndAdvance(state, 0);
            }}>
              Go! (run a day)
            </button>
          </div>
        }
      </div>
      <div style={{ color: isGameOver ? "grey" : undefined }}>
        {Object.keys(state).filter(k => (state as any)[k] > 0).map(k => <div key={k}>
          <Slider k={k as any} state={state} score={(isScoring as any)?.[k]} />
        </div>)}
      </div>
    </div>
  );
}

export default App;
