/**
 * Script for: Character, word, and sentence counter | App Just Works (https://appjustworks.com/apps/character-word-sentence-counter)
 * Copyright (c) 2021 Westermeister. All rights reserved.
 */

import tokenizer from "sbd";

// Select the counters.
const numChars = document.querySelector("#num-characters");
const numWords = document.querySelector("#num-words");
const numSentences = document.querySelector("#num-sentences");

// Select the input field and listen for changes.
const inputField = document.querySelector("#input-field");
inputField.addEventListener("input", () => {
  const currentInputValue = inputField.value.replace(/[\r\n]/g, "");

  // Update number of characters.
  numChars.innerText = String(currentInputValue.length);

  // Update number of words.
  const split = currentInputValue.split(" ");
  if (split.length === 1 && split[0] === "") {
    numWords.innerText = "0";
  } else {
    numWords.innerText = String(currentInputValue.split(" ").length);
  }

  // Update number of sentences.
  numSentences.innerText = String(
    tokenizer.sentences(currentInputValue).length
  );
});
