/**
 * Tests for character/word/sentence counter.
 * Copyright (c) 2021 Westermeister. All rights reserved.
 */

import { test, expect } from "@playwright/test";

test("Test simple text input", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/character-word-sentence-counter");

  // Ensure we're on the right page.
  const title = await page.innerText("title");
  expect(title).toEqual(
    "Character, word, and sentence counter | App Just Works"
  );

  await page.fill(
    "main textarea",
    "On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S. Millions attended the Inauguration."
  );
  let numChars = await page.innerText("main #num-characters");
  let numWords = await page.innerText("main #num-words");
  let numSentences = await page.innerText("main #num-sentences");
  expect(numChars).toEqual("110");
  expect(numWords).toEqual("18");
  expect(numSentences).toEqual("2");
});
