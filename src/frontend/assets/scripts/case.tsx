/**
 * Script for: Case Converter | App Just Works
 * Copyright (c) 2021 Westermeister. All rights reserved.
 */

import ClipboardJS from "clipboard";
import React from "react";
import ReactDOM from "react-dom";

/**
 * Collect the text and desired case from the user.
 * @param props - JSX properties.
 * @param props.textInput - Represents the user's text.
 * @param props.caseInput - Represents the user's desired case.
 * @param props.setTextInput - Sets the text.
 * @param props.setCaseInput - Sets the case.
 * @returns Markup for the form.
 */
function InputForm(props: {
  textInput: string;
  caseInput: string;
  setTextInput(text: string): void;
  setCaseInput(case_: string): void;
}): JSX.Element {
  return (
    <form className="mb-3">
      <div className="form-floating mb-3">
        <textarea
          value={props.textInput}
          onChange={(e) => props.setTextInput(e.target.value)}
          id="text-input"
          className="form-control"
          placeholder="Enter text here"
          style={{ height: "100px" }}
        ></textarea>
        <label htmlFor="text-input">Enter text here</label>
      </div>
      <div className="row">
        <div className="col-sm-4">
          <select
            value={props.caseInput}
            onChange={(e) => props.setCaseInput(e.target.value)}
            id="case-input"
            className="form-select"
            aria-label="Select a case for the text"
          >
            <option value="all">Show all cases (default)</option>
            <option value="lower">lowercase</option>
            <option value="upper">UPPERCASE</option>
            <option value="sentence">Sentence case</option>
            <option value="capital">Capital Case</option>
            <option value="altone">aLtErNaTiNg cAsE</option>
            <option value="alttwo">AlTeRnAtInG CaSe (inverse)</option>
          </select>
        </div>
      </div>
    </form>
  );
}

/**
 * Computes and displays the results.
 * @param props - JSX properties.
 * @param props.textInput - The user's text input.
 * @param props.caseInput - The user's case input.
 * @returns Markup for the results.
 */
function Results(props: { textInput: string; caseInput: string }): JSX.Element {
  // Generate the outputs.
  let lowerOutput = "";
  let upperOutput = "";
  let sentenceOutput = "";
  let capitalOutput = "";
  let altoneOutput = "";
  let alttwoOutput = "";
  if (props.textInput.length > 0) {
    lowerOutput = props.textInput.toLowerCase();
    upperOutput = props.textInput.toUpperCase();
    sentenceOutput =
      props.textInput[0].toUpperCase() + props.textInput.slice(1).toLowerCase();
    capitalOutput = props.textInput
      .split(" ")
      .map((word) => {
        if (word.length === 0) return "";
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
    altoneOutput = props.textInput
      .split("")
      .map((char, index) =>
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      )
      .join("");
    alttwoOutput = props.textInput
      .split("")
      .map((char, index) =>
        index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
      )
      .join("");
  }

  // Enable copy functionality for the copy button.
  new ClipboardJS(".btn-copy");

  /**
   * Generates markup for each case.
   * @param shortName - Equivalent to the value of the dropdown input element.
   * @param displayName - Equivalent to the text of the dropdown input element.
   * @param value - The computed value for the specific case.
   * @returns Markup for a <li> element or an empty element.
   */
  const generateListItem = (
    shortName: string,
    displayName: string,
    value: string
  ): JSX.Element => {
    if (props.caseInput === "all" || props.caseInput === shortName) {
      return (
        <li
          className="list-group-item d-flex justify-content-between align-items-start"
          style={{ whiteSpace: "pre" }}
        >
          <div className="ms-2 me-auto">
            <div className="mb-2">
              <div className="fw-bold text-secondary me-2 d-inline-flex">
                {displayName}
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm btn-copy"
                data-clipboard-text={value}
              >
                Copy
              </button>
            </div>
            <span id={shortName + "-output"}>
              {value.length === 0 ? <>&nbsp;</> : <>{value}</>}
            </span>
          </div>
        </li>
      );
    }
    return <></>;
  };

  return (
    <ol className="list-group">
      {generateListItem("lower", "lowercase", lowerOutput)}
      {generateListItem("upper", "UPPERCASE", upperOutput)}
      {generateListItem("sentence", "Sentence case", sentenceOutput)}
      {generateListItem("capital", "Capital Case", capitalOutput)}
      {generateListItem("altone", "aLtErNaTiNg cAsE", altoneOutput)}
      {generateListItem("alttwo", "AlTeRnAtInG CaSe (inverse)", alttwoOutput)}
    </ol>
  );
}

/**
 * Entry point which manages the entire application state.
 * @returns Markup for the entire application.
 */
function App(): JSX.Element {
  const [textInput, setTextInput] = React.useState("");
  const [caseInput, setCaseInput] = React.useState("all");
  return (
    <>
      <InputForm
        key="InputForm"
        textInput={textInput}
        setTextInput={(text) => setTextInput(text)}
        caseInput={caseInput}
        setCaseInput={(case_) => setCaseInput(case_)}
      />
      <Results key="Results" textInput={textInput} caseInput={caseInput} />
    </>
  );
}

const container = document.querySelector("#app");
// Use "any" to fix obscure compilation bug when compiling alongside peer source files.
ReactDOM.render((<App />) as any, container);
