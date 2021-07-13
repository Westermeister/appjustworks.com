# Command variables.
ESLINT=npx eslint
GZIP=gzip
PLAYWRIGHT=npx playwright
POSTCSS=NODE_ENV=production npx postcss
PRETTIER=npx prettier
PURGECSS=npx purgecss
PYTHON=python3
SASS=npx sass
WEBPACK=npx webpack

# Important paths.
WEBROOT=./frontend
SCRIPTS_DIR=$(WEBROOT)/scripts
STYLES_DIR=$(WEBROOT)/styles

# Store flags into these variables.
GZIP_FLAGS=-9 --keep --force --recursive
PLAYWRIGHT_FLAGS=--browser=all
POSTCSS_FLAGS=--replace
PRETTIER_FLAGS=--write "./frontend/**/*.{html,scss,tsx,ts}" "./tests/**/*.spec.ts" "./*.{js,json}"
PURGECSS_FLAGS=--css $(STYLES_DIR)/dist/main.css --content "./frontend/**/*.{html,tsx}" --output $(STYLES_DIR)/dist/
SASS_FLAGS=--load-path=node_modules --load-path=node_modules/bootstrap/scss --no-source-map --quiet
WEBPACK_FLAGS=--config ./webpack.config.js

# BEGIN: Standard targets.

.PHONY: all
all: eslint html prettier scripts styles

.PHONY: check
check: prettier
	$(PLAYWRIGHT) test $(PLAYWRIGHT_FLAGS)

# END: Standard targets.

.PHONY: eslint
eslint: prettier
	$(ESLINT) "$(SCRIPTS_DIR)/src/**/*.tsx"

.PHONY: html
html: prettier
	$(foreach file, $(wildcard $(WEBROOT)/*.html), $(GZIP) $(GZIP_FLAGS) $(file);)
	$(foreach file, $(wildcard $(WEBROOT)/apps/*.html), $(GZIP) $(GZIP_FLAGS) $(file);)

.PHONY: prettier
prettier:
	$(PRETTIER) $(PRETTIER_FLAGS)

.PHONY: scripts
scripts: eslint prettier
	rm -rf $(SCRIPTS_DIR)/dist
	$(WEBPACK) $(WEBPACK_FLAGS)
	$(PYTHON) ./copywriter.py
	$(GZIP) $(GZIP_FLAGS) $(SCRIPTS_DIR)/dist

.PHONY: styles
styles: prettier
	rm -rf $(STYLES_DIR)/dist
	$(SASS) $(STYLES_DIR)/src:$(STYLES_DIR)/dist $(SASS_FLAGS)
	$(PURGECSS) $(PURGECSS_FLAGS)
	$(POSTCSS) $(STYLES_DIR)/dist/main.css $(POSTCSS_FLAGS)
	$(GZIP) $(GZIP_FLAGS) $(STYLES_DIR)/dist/main.css
