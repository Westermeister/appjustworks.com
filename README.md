# appjustworks.com

This is the repository for [App Just Works](https://appjustworks.com), a collection of useful, single page web apps.

In the repository's root, you'll find configuration files for TypeScript, Webpack, npm, PostCSS, and other tools. In the
`src` directory, you'll find the website's implementation, which for now only relies on frontend code. In the `tests`
directory, you'll find relvant tests for each of the apps within the `src` directory.

## src

This directory contains a `sitemap.xml` and an associated `robots.txt` for SEO.

This directory also contains `apps`, which hosts the basic HTML markup for each web app. Each HTML file basically acts
like boilerplate, including the necessary scripts and providing a simple structure for the scripts to build off of.

The `assets` directory contains static resources like images and stylesheets, but most importantly, it contains the
actual scripts that provide the web apps' functionality: `scripts`. Some of the apps are simple JS files, others are Vue
files with JS entry points, and the rest are React (i.e. TSX) files. The React and Vue files are both implemented with
TypeScript to provide for type safety.

## tests

All of the tests are implemented with [Microsoft's Playwright library](https://playwright.dev/), which enables full,
end-to-end tests on each web app with 4 major browsers (2 of which are covered by Chromium: Chrome and Edge). The tests
operate at a high level, ensuring that all aspects of each web app are touched by at least one test case.
