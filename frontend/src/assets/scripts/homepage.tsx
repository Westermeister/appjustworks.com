/**
 * Script for: App Just Works (homepage)
 * Copyright (c) 2021 Westermeister. All rights reserved.
 */

import React from "react";
import ReactDOM from "react-dom";

/**
 * Render the filter list of apps.
 * @returns The HTML to be rendered.
 */
function App(): JSX.Element {
  const apps = [
    [
      "Character, word, and sentence counter",
      "/apps/character-word-sentence-counter",
    ],
    ["Postfix (RPN) Calculator", "/apps/postfix-rpn-calculator"],
    ["Rank a list of items", "/apps/rank-a-list-of-items"],
  ];
  const [input, setInput] = React.useState("");

  const renderApps = (): JSX.Element => {
    const renderList = [];
    for (const app of apps) {
      if (app[0].toLowerCase().includes(input.toLowerCase())) {
        renderList.push(
          <li className="mb-1">
            <a href={app[1]}>{app[0]}</a>
          </li>
        );
      }
    }
    if (renderList.length === 0) {
      return <p className="fs-5">No apps were found.</p>;
    }
    return <ul className="fs-5">{renderList}</ul>;
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col-md-8 col-lg-6">
          <form>
            <input
              type="text"
              onChange={(e) => setInput(e.target.value)}
              className="form-control"
              placeholder="Search for an app"
            ></input>
          </form>
        </div>
      </div>
      {renderApps()}
    </>
  );
}

const container = document.querySelector("#app");
ReactDOM.render((<App />) as any, container);
