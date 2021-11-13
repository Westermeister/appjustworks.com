/**
 * Tests for case converter.
 * Copyright (c) 2021 Westermeister. All rights reserved.
 */

import { test, expect } from "@playwright/test";

test("Test working link", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/case-converter");
  const title = await page.innerText("title");
  expect(title).toEqual("Case Converter | App Just Works");
});

test("Test no input", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/case-converter");
  const nonBreakingSpace = "\xa0";

  const lower = await page.innerText("#lower-output");
  const upper = await page.innerText("#upper-output");
  const sentence = await page.innerText("#sentence-output");
  const capital = await page.innerText("#capital-output");
  const altone = await page.innerText("#altone-output");
  const alttwo = await page.innerText("#alttwo-output");

  expect(lower).toBe(nonBreakingSpace);
  expect(upper).toBe(nonBreakingSpace);
  expect(sentence).toBe(nonBreakingSpace);
  expect(capital).toBe(nonBreakingSpace);
  expect(altone).toBe(nonBreakingSpace);
  expect(alttwo).toBe(nonBreakingSpace);
});

test("Test simple string", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/case-converter");
  await page.fill("#text-input", "app just works is awesome");

  const lower = await page.innerText("#lower-output");
  const upper = await page.innerText("#upper-output");
  const sentence = await page.innerText("#sentence-output");
  const capital = await page.innerText("#capital-output");
  const altone = await page.innerText("#altone-output");
  const alttwo = await page.innerText("#alttwo-output");

  expect(lower).toBe("app just works is awesome");
  expect(upper).toBe("APP JUST WORKS IS AWESOME");
  expect(sentence).toBe("App just works is awesome");
  expect(capital).toBe("App Just Works Is Awesome");
  expect(altone).toBe("aPp jUsT WoRkS Is aWeSoMe");
  expect(alttwo).toBe("ApP JuSt wOrKs iS AwEsOmE");
});

test("Test filter case", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/case-converter");
  await page.fill("#text-input", "rogue one is the best star wars movie");
  await page.selectOption("#case-input", "upper");

  const lower = await page.$("#lower-output");
  const upper = await page.innerText("#upper-output");
  const sentence = await page.$("#sentence-output");
  const capital = await page.$("#capital-output");
  const altone = await page.$("#altone-output");
  const alttwo = await page.$("#alttwo-output");

  expect(lower).toBe(null);
  expect(upper).toBe("ROGUE ONE IS THE BEST STAR WARS MOVIE");
  expect(sentence).toBe(null);
  expect(capital).toBe(null);
  expect(altone).toBe(null);
  expect(alttwo).toBe(null);
});
