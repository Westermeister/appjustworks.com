import { test, expect } from "@playwright/test";

test("Add items", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/rank-a-list-of-items");

  // Ensure we're on the right page.
  const title = await page.innerText("title");
  expect(title).toEqual("Rank a list of items | App Just Works");

  // Try adding: Godzilla...
  await page.fill("#app input", "Godzilla");
  await page.click("'Add'");
  let renderedContent = await page.$$("#app li span");
  let deleteButton = await renderedContent[0].innerText();
  let addedItem = await renderedContent[1].innerText();
  expect(deleteButton).toEqual("X");
  expect(addedItem).toEqual("Godzilla");

  // ...then King Kong...
  await page.fill("#app input", "King Kong");
  await page.click("'Add'");
  renderedContent = await page.$$("#app li span");
  deleteButton = await renderedContent[2].innerText();
  addedItem = await renderedContent[3].innerText();
  expect(deleteButton).toEqual("X");
  expect(addedItem).toEqual("King Kong");

  // ...then Del Lago...
  await page.fill("#app input", "Del Lago");
  await page.click("'Add'");
  renderedContent = await page.$$("#app li span");
  deleteButton = await renderedContent[4].innerText();
  addedItem = await renderedContent[5].innerText();
  expect(deleteButton).toEqual("X");
  expect(addedItem).toEqual("Del Lago");

  // ...and finally Mr. X.
  await page.fill("#app input", "Mr. X");
  await page.click("'Add'");
  renderedContent = await page.$$("#app li span");
  deleteButton = await renderedContent[6].innerText();
  addedItem = await renderedContent[7].innerText();
  expect(deleteButton).toEqual("X");
  expect(addedItem).toEqual("Mr. X");
});

test("Do ranking", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/rank-a-list-of-items");

  // Add some items.
  await page.fill("#app input", "2");
  await page.click("'Add'");
  await page.fill("#app input", "1");
  await page.click("'Add'");
  await page.fill("#app input", "3");
  await page.click("'Add'");
  await page.fill("#app input", "4");
  await page.click("'Add'");

  // Now submit and go through ranking process.
  await page.click("'Next'");
  await page.click("'3'");
  await page.click("'1'");
  await page.click("'1'");
  await page.click("'2'");

  // That should've given us a ranking of: 1, 2, 3, 4
  const results = await page.$$("#app li");
  expect(await results[0].innerText()).toEqual("1");
  expect(await results[1].innerText()).toEqual("2");
  expect(await results[2].innerText()).toEqual("3");
  expect(await results[3].innerText()).toEqual("4");
});

test("Back to beginning", async ({ page }) => {
  await page.goto("http://localhost:8080/apps/rank-a-list-of-items");

  // Add some items, and go through ranking process.
  await page.fill("#app input", "1");
  await page.click("'Add'");
  await page.fill("#app input", "2");
  await page.click("'Add'");
  await page.click("'Next'");
  await page.click("'1'");

  // Now go back to beginning.
  await page.click("'Back to beginning'");
  const heading = await page.innerText("#app h1");
  expect(heading).toEqual("Rank a list of items");
});

test("Shared list initial page", async ({ page }) => {
  // Go to a shared link.
  await page.goto(
    "http://localhost:8080/apps/rank-a-list-of-items?items=NoIgjCA0IExSBmeAWEBdIA"
  );

  // We should have the items: 1, 2, 3, 4
  const renderedContent = await page.$$("#app li");
  for (let i = 0; i < 4; ++i) {
    const item = await renderedContent[i].innerText();
    expect(item).toEqual(String(i + 1));
  }

  // We should have a button "Begin ranking".
  const startButton = await page.$("#app button");
  const text = await startButton.innerText();
  expect(text).toEqual("Begin ranking");
});

test("From shared list to start-from-scratch", async ({ page }) => {
  // Go to a shared link.
  await page.goto(
    "http://localhost:8080/apps/rank-a-list-of-items?items=NoIgjCA0IExSBmeAWEBdIA"
  );

  // Click the "start from scratch" link.
  await page.click("'start from scratch.'");
  const url = page.url();
  expect(url).toEqual("http://localhost:8080/apps/rank-a-list-of-items");
});

test("Use shared list and begin ranking", async ({ page }) => {
  // Go to a shared link, and start ranking.
  await page.goto(
    "http://localhost:8080/apps/rank-a-list-of-items?items=NoIgjCA0IExSBmeAWEBdIA"
  );
  await page.click("'Begin ranking'");
  await page.click("'3'");
  await page.click("'1'");
  await page.click("'1'");
  await page.click("'2'");

  // That should give us a ranking of: 1, 2, 3, 4
  const results = await page.$$("#app li");
  expect(await results[0].innerText()).toEqual("1");
  expect(await results[1].innerText()).toEqual("2");
  expect(await results[2].innerText()).toEqual("3");
  expect(await results[3].innerText()).toEqual("4");
});

test("From shared list to custom one", async ({ page }) => {
  // Go to a shared link and click
  await page.goto(
    "http://localhost:8080/apps/rank-a-list-of-items?items=NoIgjCA0IExSBmeAWEBdIA"
  );

  // Now modify the list. Remove the first 2 items: 1 and 2.
  await page.click("'modify it'");
  await page.click("'X'");
  await page.click("'X'");

  // Add some other stuff instead.
  await page.fill("#app input", "a");
  await page.click("'Add'");
  await page.fill("#app input", "b");
  await page.click("'Add'");

  // Now do the ranking process.
  await page.click("'Next'");
  await page.click("'a'");
  await page.click("'3'");
  await page.click("'a'");
  await page.click("'b'");

  // That should give us a ranking of: a, b, 3, 4
  const results = await page.$$("#app li");
  expect(await results[0].innerText()).toEqual("a");
  expect(await results[1].innerText()).toEqual("b");
  expect(await results[2].innerText()).toEqual("3");
  expect(await results[3].innerText()).toEqual("4");
});
