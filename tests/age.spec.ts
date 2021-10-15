/**
 * Tests for age calculator.
 * Copyright (c) 2021 Westermeister. All rights reserved.
 */

import { test, expect } from "@playwright/test";

test("Test working link", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/age-calculator");
  const title = await page.innerText("title");
  expect(title).toEqual("Age Calculator | App Just Works");
});

test("Test simple one-year-old", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/age-calculator");
  await page.fill("#birthday-input", "2001-01-01");
  await page.fill("#future-input", "2002-01-01");
  await page.click("#compute-age");
  const age = await page.innerText("#calculator-output");
  expect(age).toBe("1 year(s), 0 month(s), 0 day(s)");
});

test("Test arbitrary age", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/age-calculator");
  await page.fill("#birthday-input", "2001-01-01");
  await page.fill("#future-input", "2003-02-03");
  await page.click("#compute-age");
  const age = await page.innerText("#calculator-output");
  expect(age).toBe("2 year(s), 1 month(s), 2 day(s)");
});

test("Test leap year birthday on february 28", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/age-calculator");
  await page.fill("#birthday-input", "2016-02-29");
  await page.fill("#future-input", "2017-02-28");
  await page.click("#compute-age");
  const age = await page.innerText("#calculator-output");
  expect(age).toBe("0 year(s), 11 month(s), 30 day(s)");
});

test("Test leap year birthday on march 1", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/age-calculator");
  await page.fill("#birthday-input", "2016-02-29");
  await page.fill("#future-input", "2017-03-01");
  await page.click("#compute-age");
  const age = await page.innerText("#calculator-output");
  expect(age).toBe("1 year(s), 0 month(s), 1 day(s)");
});

test("Test invalid inputs", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/age-calculator");
  await page.fill("#birthday-input", "2020-01-01");
  await page.fill("#future-input", "1970-01-01");
  await page.click("#compute-age");
  const age = await page.innerText("#calculator-output");
  expect(age).toBe(
    "Error: The birthday value has to be earlier than the future value!"
  );
});
