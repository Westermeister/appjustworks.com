/*!
 * Copyright (C) 2021-Present Westermeister. All Rights Reserved.
 * @preserve
 */

// Explicitly state this here. Otherwise, TS will emit it above the copyright notice.
"use strict";

declare const Base64: {
  encode: (src: string, urlsafe?: boolean) => string;
};

declare const LZString: {
  compressToEncodedURIComponent: (input: string) => string;
  decompressFromEncodedURIComponent: (compressed: string) => string;
};

/**
 * Handles app functionality during input phase.
 * @param props - JSX properties.
 * @param props.items - Holds items to be ranked.
 * @param props.onItemsChange - Sets state of items.
 * @param props.onPhaseChange - Sets app phase.
 * @returns The HTML to be rendered.
 */
function InputPhase(props: {
  items: string[];
  premade: boolean;
  onItemsChange: (items: string[]) => void;
  onPhaseChange: (phase: string) => void;
}): JSX.Element {
  const [input, setInput] = React.useState("");
  const [duplicate, setDuplicate] = React.useState(false);

  // The "modify" link only exists (and thus can only be clicked) when the premade prop is true.
  const [modifyClicked, setModifyClicked] = React.useState(false);

  const addEntry = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (props.items.includes(input)) {
      setDuplicate(true);
      return;
    } else {
      setDuplicate(false);
    }
    props.onItemsChange([...props.items, input]);
    setInput("");
  };

  const removeEntry = (text: string): void => {
    const new_items = [...props.items];
    for (let i = new_items.length - 1; i >= 0; --i) {
      if (new_items[i] === text) {
        new_items.splice(i, 1);
        break;
      }
    }
    props.onItemsChange(new_items);
  };

  const renderEntries = (items: string[]): JSX.Element[] => {
    const retval = [];
    for (const entry of items) {
      if (props.premade && !modifyClicked) {
        retval.push(<li className="list-group-item">{entry}</li>);
      } else {
        retval.push(
          <li className="list-group-item">
            <span
              className="pointer-hover text-danger"
              onClick={() => removeEntry(entry)}
            >
              X
            </span>
            {/* Horizontal margins have no effect. Use this for now. */}
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{entry}</span>
          </li>
        );
      }
    }
    return retval;
  };

  return (
    <div className="container-md">
      <h1>Rank a list of items</h1>
      <p className="fst-italic mb-5">
        A simple, fast, and fun method to help you rank a list of items from
        best to worst.
      </p>
      {props.premade && !modifyClicked && (
        <>
          <p>
            This is a premade list. If you want, you can{" "}
            <a
              href="javascript:void(0);"
              onClick={() => setModifyClicked(true)}
            >
              modify it
            </a>{" "}
            before you begin, or <a href="/apps/rank">make your own</a> from
            scratch.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => props.onPhaseChange("rank")}
          >
            Begin ranking
          </button>
        </>
      )}
      {(!props.premade || modifyClicked) && (
        <p>Add each item below, in any order. You must add at least 2 items.</p>
      )}
      {(!props.premade || modifyClicked) && (
        <form onSubmit={addEntry}>
          <div className="row mb-3">
            <div className="col-sm-8 col-md-6">
              <input
                required
                className="form-control"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter an item"
                aria-describedby="inputHelp"
              />
              {!props.premade && (
                <div id="inputHelp" className="form-text">
                  e.g. if you were ranking countries, you might add items like
                  "Japan" or "Germany"
                </div>
              )}
            </div>
          </div>
          {duplicate && <p className="text-danger">Item is already in list.</p>}
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
      )}
      <ul className="list-group my-4">{renderEntries(props.items)}</ul>
      {(!props.premade || modifyClicked) && props.items.length >= 2 && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => props.onPhaseChange("rank")}
        >
          Next
        </button>
      )}
    </div>
  );
}

/**
 * Implements ranking phase of app via bottom-up mergesort.
 * @param props - JSX properties.
 * @param props.items - The items to be ranked.
 * @param props.onItemsChange - Sets state of items.
 * @param props.onPhaseChange - Sets app phase.
 * @returns The HTML to be rendered.
 */
function RankPhase(props: {
  items: string[];
  onItemsChange: (items: string[]) => void;
  onPhaseChange: (phase: string) => void;
}): JSX.Element {
  // First, we set the initial state for mergesort by turning each item into a single-element array.
  const toBeRanked: string[][] = [];
  for (const item of props.items) {
    toBeRanked.push([item]);
  }
  const ranked = React.useRef(toBeRanked);

  // This index will be used to select the array pairs (within the "ranked" variable) to merge.
  // It will always point to the RIGHT array, so getting the LEFT array means we'll have to use pairIndex - 1.
  // (Note that we do backwards iteration so that we can avoid expensive deletions from the front of the array.)
  const pairIndex = React.useRef(ranked.current.length - 1);

  // These are the state vars that are used during the merging process.
  const leftIndex = React.useRef(0);
  const rightIndex = React.useRef(0);
  const [leftOption, setLeftOption] = React.useState(
    ranked.current[pairIndex.current - 1][0]
  );
  const [rightOption, setRightOption] = React.useState(
    ranked.current[pairIndex.current][0]
  );
  const leftArray = React.useRef(ranked.current[pairIndex.current - 1]);
  const rightArray = React.useRef(ranked.current[pairIndex.current]);
  const mergedArray = React.useRef([] as string[]);

  // The most important (and most complicated) part: perform a SINGLE STEP of mergesort.
  const mergeSortStep = (chosen: string): void => {
    // Add the chosen one to the merged array and increment the corresponding index.
    if (chosen === leftOption) {
      mergedArray.current.push(leftOption);
      ++leftIndex.current;
    } else {
      mergedArray.current.push(rightOption);
      ++rightIndex.current;
    }

    // If we're done with one of the arrays, fill out the merged array with the OTHER array.
    // Otherwise, go ahead and present the user with the next option.
    if (leftIndex.current === leftArray.current.length) {
      while (rightIndex.current < rightArray.current.length) {
        mergedArray.current.push(rightArray.current[rightIndex.current++]);
      }
    } else if (rightIndex.current === rightArray.current.length) {
      while (leftIndex.current < leftArray.current.length) {
        mergedArray.current.push(leftArray.current[leftIndex.current++]);
      }
    } else {
      setLeftOption(leftArray.current[leftIndex.current]);
      setRightOption(rightArray.current[rightIndex.current]);
      // Ignore further code in this case!
      return;
    }

    // If we're here, that means we finished a merge.
    // Let's make sure to save the result from the merge.
    ranked.current.splice(pairIndex.current - 1, 2);
    ranked.current.push(mergedArray.current);

    // Are we done? Great! Let's break out of this phase.
    if (ranked.current.length === 1) {
      props.onItemsChange(ranked.current[0]);
      props.onPhaseChange("results");
      return;
    }

    // Otherwise, we want to merge the next PAIR of arrays, so we move the index down by 2, not 1.
    // After doing that, we're presented with 3 cases:
    // 1) The pairIndex doesn't point to anything at all. In other words, we've gone to -1.
    // 2) The pairIndex DOES point to something, but it's the first element i.e. 0, so there's no "pair" at all.
    // 3) The pairIndex DOES point to something, AND it has another element to the left.
    pairIndex.current -= 2;

    // We handle cases 1 and 2 the same by resetting the index, because there's no pair to merge.
    // Otherwise, we leave things as is.
    if (pairIndex.current <= 0) {
      pairIndex.current = ranked.current.length - 1;
    }

    // Now that we have a valid pairIndex, we can start the merge process again.
    // Begin by setting the relevant state vars.
    leftIndex.current = 0;
    rightIndex.current = 0;
    mergedArray.current = [];
    leftArray.current = ranked.current[pairIndex.current - 1];
    rightArray.current = ranked.current[pairIndex.current];

    // Finally, update the options so that we can get another choice from the user.
    setLeftOption(leftArray.current[leftIndex.current]);
    setRightOption(rightArray.current[rightIndex.current]);
  };

  return (
    <div className="container-md">
      <h1 className="text-center">Rank it: Which is better?</h1>
      <p className="text-center fst-italic mb-3">
        You will be repeatedly presented with two options.
      </p>
      <div className="d-grid gap-2">
        {/* Use divs instead of buttons to prevent outlined borders on click. */}
        <div
          className="btn btn-primary choice"
          onClick={() => mergeSortStep(leftOption)}
        >
          {leftOption}
        </div>
        <div
          className="btn btn-primary choice"
          onClick={() => mergeSortStep(rightOption)}
        >
          {rightOption}
        </div>
      </div>
    </div>
  );
}

/**
 * Shows the results of the ranking.
 * @param props - JSX properties.
 * @param props.items - The sorted (i.e. ranked) items, from best to worst.
 * @returns HTML for the results display.
 */
function ResultsPhase(props: { items: string[] }): JSX.Element {
  // Code for "Download" button.
  let rankingDownload = "data:text/plain;base64,";
  let base64Data = "";
  for (let i = 0; i < props.items.length; ++i) {
    base64Data += `${i + 1}. ${props.items[i]}\n`;
  }
  base64Data = Base64.encode(base64Data);
  rankingDownload += base64Data;

  // Code for "Copy quiz link" button.
  let quizLink = window.location.href;
  quizLink = quizLink.replace(window.location.search, "");
  quizLink += "?items=";
  const compressed_items = LZString.compressToEncodedURIComponent(
    JSON.stringify(props.items)
  );
  quizLink += compressed_items;
  const [copied, setCopied] = React.useState(false);

  // For demoing the compression.
  const uncompressed_items = encodeURIComponent(JSON.stringify(props.items));
  console.log(`With compression: ${compressed_items.length} chars`);
  console.log(`Without compression: ${uncompressed_items.length} chars`);
  console.log(compressed_items);
  console.log(uncompressed_items);

  // Code for rendering the component.
  const renderResult = (item: string): JSX.Element => {
    return <li className="list-group-item">{item}</li>;
  };
  return (
    <div className="container-md">
      <h1 className="mb-5">Results</h1>
      <ol className="list-group list-group-numbered mb-5">
        {props.items.map((item) => renderResult(item))}
      </ol>
      <a
        className="btn btn-primary"
        download="ranking.txt"
        href={rankingDownload}
        aria-describedby="downloadHelp"
      >
        Download
      </a>
      <div id="downloadHelp" className="form-text mb-4">
        Save your ranking as a text file.
      </div>
      <div className="d-flex align-items-center">
        <button
          className="btn btn-primary btn-copy"
          data-clipboard-text={quizLink}
          aria-describedby="copyHelp"
          onClick={() => setCopied(true)}
        >
          Copy quiz link
        </button>
        {copied && <span className="text-success ms-3">Copied!</span>}
      </div>
      <div id="copyHelp" className="form-text mb-4">
        Share with others so they can rank these items too!
      </div>
      <a href="/apps/rank">Back to beginning</a>
    </div>
  );
}

/**
 * App entry point; holds state and manages transitions between app phases.
 * @returns The HTML to be rendered.
 */
function App(): JSX.Element {
  const items_param = new URLSearchParams(window.location.search).get("items");
  let items_init: string[] = [];
  let premade = false;
  if (items_param !== null) {
    items_init = JSON.parse(
      LZString.decompressFromEncodedURIComponent(items_param)
    );
    premade = true;
  }

  const [items, setItems] = React.useState(items_init);
  const [phase, setPhase] = React.useState("input");

  const handleItemsChange = (items: string[]): void => setItems(items);
  const handlePhaseChange = (phase: string): void => setPhase(phase);

  if (phase === "input") {
    return (
      <InputPhase
        items={items}
        premade={premade}
        onItemsChange={handleItemsChange}
        onPhaseChange={handlePhaseChange}
      />
    );
  } else if (phase === "rank") {
    return (
      <RankPhase
        items={items}
        onItemsChange={handleItemsChange}
        onPhaseChange={handlePhaseChange}
      />
    );
  } else if (phase === "results") {
    return <ResultsPhase items={items} />;
  } else {
    return (
      <div className="container-md">
        <p>If you can see this, the website's developer made a boo-boo :(</p>
      </div>
    );
  }
}

const container = document.querySelector("#app");
ReactDOM.render(<App />, container);
