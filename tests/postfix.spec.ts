/**
 * IMPORTANT NOTE: Always, always use the ID for "page.click" calls. There are nuances like unicode, special
 * sub/superscript formatting, etc. that make trying to select via text surprisingly difficult.
 */

import { test, expect } from "@playwright/test";

test("Use basic 4 functions", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");

  // Ensure we're on the right page.
  const title = await page.innerText("title");
  expect(title).toEqual("Postfix (RPN) Calculator | App Just Works");

  // Evaluate expression: (((2 - 3) * 5) / 10) + 9
  // Should give us: 8.5
  await page.click("#num2");
  await page.click("#enter");
  await page.click("#num3");
  await page.click("#subtract");
  await page.click("#enter");
  await page.click("#num5");
  await page.click("#multiply");
  await page.click("#enter");
  await page.click("#num1");
  await page.click("#num0");
  await page.click("#divide");
  await page.click("#enter");
  await page.click("#num9");
  await page.click("#add");
  const result = await page.innerText("#input-field");
  expect(result).toEqual("8.5");
});

test("Use memory buttons, clear buttons, and drop button", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  // Add 5 to memory, then clear entry, then ensure we can get 5 back, then reset.
  await page.click("#num5");
  await page.click("#m-in");
  await page.click("#CE");
  await page.click("#m-re");
  let result = await page.innerText("#input-field");
  expect(result).toEqual("5");
  await page.click("#AC");
  result = await page.innerText("#input-field");
  expect(result).toEqual("0");
  await page.click("#m-re");
  result = await page.innerText("#input-field");
  expect(result).toEqual("0");

  // Add 5 to memory, clear entry, decrement by 2, then increment by 10, then reset.
  await page.click("#num5");
  await page.click("#m-in");
  await page.click("#CE");
  await page.click("#num2");
  await page.click("#m-");
  await page.click("#CE");
  await page.click("#num1");
  await page.click("#num0");
  await page.click("#m-add");
  await page.click("#CE");
  await page.click("#CE");
  await page.click("#m-re");
  result = await page.innerText("#input-field");
  expect(result).toEqual("13");
  await page.click("#AC");
  result = await page.innerText("#input-field");
  expect(result).toEqual("0");
  await page.click("#m-re");
  result = await page.innerText("#input-field");
  expect(result).toEqual("0");

  // Add 1, 2, and enter 3, but drop it.
  await page.click("#num1");
  await page.click("#enter");
  await page.click("#num2");
  await page.click("#enter");
  await page.click("#num3");
  await page.click("#drop");
  result = await page.innerText("#input-field");
  expect(result).toEqual("2");
});

test("Use factorial and negative button and euler's number", async ({
  page,
}) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  // Compute 5!, negate it, and multiply be e.
  await page.click("#num5");
  await page.click("#factorial");
  await page.click("#negate");
  await page.click("#enter");
  await page.click("#e");
  await page.click("#multiply");
  const result = await page.innerText("#input-field");
  expect(result).toEqual("-326.193819415086");
});

test("Use swap, roll, and mod buttons", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  // Add 1, 2, 3, and input 4, then swap, then roll, then modulus.
  await page.click("#num1");
  await page.click("#enter");
  await page.click("#num2");
  await page.click("#enter");
  await page.click("#num3");
  await page.click("#enter");
  await page.click("#num4");
  await page.click("#swap");
  await page.click("#roll");
  await page.click("#mod");
  // We should get 3, then 1, then 2.
  let result = await page.innerText("#row-2");
  expect(result).toEqual("3");
  result = await page.innerText("#row-1");
  expect(result).toEqual("1");
  result = await page.innerText("#input-field");
  expect(result).toEqual("2");
});

test("Test fixed log buttons", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  // Test log base 10.
  await page.click("#num1");
  await page.click("#num0");
  await page.click("#num0");
  await page.click("#num0");
  await page.click("#logBase10");
  let result = await page.innerText("#input-field");
  expect(result).toEqual("3");

  await page.click("#AC");

  // Test log base 2.
  await page.click("#num3");
  await page.click("#num2");
  await page.click("#logBase2");
  result = await page.innerText("#input-field");
  expect(result).toEqual("5");

  await page.click("#AC");

  // Test natural log.
  await page.click("#e");
  await page.click("#naturalLog");
  result = await page.innerText("#input-field");
  expect(result).toEqual("1");
});

test("Test variable log", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  await page.click("#num2");
  await page.click("#enter");
  await page.click("#num6");
  await page.click("#num4");
  await page.click("#logBase2");
  const result = await page.innerText("#input-field");
  expect(result).toEqual("6");
});

test("Test pi and square button", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  await page.click("#pi");
  await page.click("#square");
  const result = await page.innerText("#input-field");
  expect(result).toEqual("9.86960440108934");
});

test("Test fixed exp buttons", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  await page.click("#num3");
  await page.click("#powerOf10");
  let result = await page.innerText("#input-field");
  expect(result).toEqual("1000");

  await page.click("#AC");

  await page.click("#num3");
  await page.click("#powerOfE");
  result = await page.innerText("#input-field");
  expect(result).toEqual("20.0855369231877");

  await page.click("#AC");

  await page.click("#num7");
  await page.click("#powerOf2");
  result = await page.innerText("#input-field");
  expect(result).toEqual("128");
});

test("Test variable exp button", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  await page.click("#num1");
  await page.click("#num0");
  await page.click("#enter");
  await page.click("#num4");
  await page.click("#powerOfY");
  const result = await page.innerText("#input-field");
  expect(result).toEqual("10000");
});

test("Test sqrt", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  await page.click("#num2");
  await page.click("#num5");
  await page.click("#sqrt");
  const result = await page.innerText("#input-field");
  expect(result).toEqual("5");
});

test("Test variable sqrt", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  await page.click("#num2");
  await page.click("#num7");
  await page.click("#enter");
  await page.click("#num3");
  await page.click("#xRootY");
  const result = await page.innerText("#input-field");
  expect(result).toEqual("3");
});

test("Test trig functions on radians", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  await page.click("#sin");
  let result = await page.innerText("#input-field");
  expect(result).toEqual("0");

  await page.click("#AC");

  await page.click("#cos");
  result = await page.innerText("#input-field");
  expect(result).toEqual("1");

  await page.click("#AC");

  await page.click("#tan");
  result = await page.innerText("#input-field");
  expect(result).toEqual("0");

  await page.click("#AC");

  await page.click("#asin");
  result = await page.innerText("#input-field");
  expect(result).toEqual("0");

  await page.click("#AC");

  await page.click("#acos");
  result = await page.innerText("#input-field");
  expect(result).toEqual("1.5707963267949");

  await page.click("#AC");

  await page.click("#atan");
  result = await page.innerText("#input-field");
  expect(result).toEqual("0");
});

test("Test trig functions on degrees", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  await page.click("#deg");

  await page.click("#sin");
  let result = await page.innerText("#input-field");
  expect(result).toEqual("0");

  await page.click("#AC");

  await page.click("#cos");
  result = await page.innerText("#input-field");
  expect(result).toEqual("1");

  await page.click("#AC");

  await page.click("#tan");
  result = await page.innerText("#input-field");
  expect(result).toEqual("0");

  await page.click("#AC");

  await page.click("#asin");
  result = await page.innerText("#input-field");
  expect(result).toEqual("0");

  await page.click("#AC");

  await page.click("#acos");
  result = await page.innerText("#input-field");
  expect(result).toEqual("90");

  await page.click("#AC");

  await page.click("#atan");
  result = await page.innerText("#input-field");
  expect(result).toEqual("0");
});

test("Test percent button", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  await page.click("#num1");
  await page.click("#num6");
  await page.click("#num0");
  await page.click("#num0");
  await page.click("#enter");
  await page.click("#num2");
  await page.click("#num5");
  await page.click("#percent");
  let result = await page.innerText("#input-field");
  expect(result).toEqual("400");
  result = await page.innerText("#row-1");
  expect(result).toEqual("1600");
});

test("Test percent diff button", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  await page.click("#num5");
  await page.click("#num0");
  await page.click("#enter");
  await page.click("#num2");
  await page.click("#num5");
  await page.click("#percentDiff");
  const result = await page.innerText("#input-field");
  expect(result).toEqual("-50");
});

test("Test invert button", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  await page.click("#num0");
  await page.click("#decimal");
  await page.click("#num1");
  await page.click("#invert");
  const result = await page.innerText("#input-field");
  expect(result).toEqual("10");
});

test("Test round button", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/postfix-rpn-calculator");
  await page.click("#num1");
  await page.click("#decimal");
  await page.click("#num5");
  await page.click("#round");
  let result = await page.innerText("#input-field");
  expect(result).toEqual("2");

  await page.click("#AC");

  await page.click("#num2");
  await page.click("#decimal");
  await page.click("#num5");
  await page.click("#round");
  result = await page.innerText("#input-field");
  expect(result).toEqual("2");

  await page.click("#AC");

  await page.click("#num1");
  await page.click("#decimal");
  await page.click("#num5");
  await page.click("#negate");
  await page.click("#round");
  result = await page.innerText("#input-field");
  expect(result).toEqual("-2");

  await page.click("#AC");

  await page.click("#num2");
  await page.click("#decimal");
  await page.click("#num5");
  await page.click("#negate");
  await page.click("#round");
  result = await page.innerText("#input-field");
  expect(result).toEqual("-2");

  await page.click("#AC");

  await page.click("#decimal");
  await page.click("#num5");
  await page.click("#num1");
  await page.click("#round");
  result = await page.innerText("#input-field");
  expect(result).toEqual("1");

  await page.click("#AC");

  await page.click("#decimal");
  await page.click("#num4");
  await page.click("#num9");
  await page.click("#round");
  result = await page.innerText("#input-field");
  expect(result).toEqual("0");

  await page.click("#AC");

  await page.click("#decimal");
  await page.click("#num5");
  await page.click("#num1");
  await page.click("#negate");
  await page.click("#round");
  result = await page.innerText("#input-field");
  expect(result).toEqual("-1");

  await page.click("#AC");

  await page.click("#decimal");
  await page.click("#num4");
  await page.click("#num9");
  await page.click("#negate");
  await page.click("#round");
  result = await page.innerText("#input-field");
  expect(result).toEqual("0");
});
