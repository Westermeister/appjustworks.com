# Variables for repeated use.
PLAYWRIGHT=npx playwright
PLAYWRIGHT_FLAGS=--browser=all

# Important paths.
FRONTEND_DIST=./frontend/dist
FRONTEND_SRC=./frontend/src

# BEGIN: Standard targets.

.PHONY: all
all: dist eslint html images misc prettier scripts styles

.PHONY: check
check: prettier
	$(PLAYWRIGHT) test $(PLAYWRIGHT_FLAGS)

.PHONY: check-rank
check-rank: prettier
	$(PLAYWRIGHT) test $(PLAYWRIGHT_FLAGS) tests/rank.spec.ts

.PHONY: check-postfix
check-postfix: prettier
	$(PLAYWRIGHT) test $(PLAYWRIGHT_FLAGS) tests/postfix.spec.ts

.PHONY: clean
clean:
	rm -rf $(FRONTEND_DIST)

# END: Standard targets.

.PHONY: dist
dist:
	mkdir -p $(FRONTEND_DIST)
	mkdir -p $(FRONTEND_DIST)/images
	mkdir -p $(FRONTEND_DIST)/styles
	mkdir -p $(FRONTEND_DIST)/scripts
	mkdir -p $(FRONTEND_DIST)/apps

.PHONY: eslint
eslint: prettier
	npx eslint "$(FRONTEND_SRC)/scripts/**/*.{js,tsx}"

.PHONY: html
html: dist prettier
	cp $(FRONTEND_SRC)/*.html $(FRONTEND_DIST)
	cp $(FRONTEND_SRC)/apps/*.html $(FRONTEND_DIST)/apps

.PHONY: images
images: dist
	# Trailing "/." means to copy over CONTENTS of folder, not folder itself.
	cp -r $(FRONTEND_SRC)/images/. $(FRONTEND_DIST)/images

.PHONY: misc
misc:
	cp $(FRONTEND_SRC)/robots.txt $(FRONTEND_SRC)/sitemap.xml $(FRONTEND_DIST)

.PHONY: prettier
prettier:
	npx prettier --write "$(FRONTEND_SRC)/**/*.{html,scss,tsx,ts,js,vue}" "./tests/**/*.spec.ts" "./*.{js,json}"

.PHONY: scripts
scripts: eslint prettier
	npx webpack --config ./webpack.config.js
	python3 ./copywriter.py

.PHONY: styles
styles: prettier
	npx sass $(FRONTEND_SRC)/styles:$(FRONTEND_DIST)/styles \
	--load-path=node_modules --load-path=node_modules/bootstrap/scss --no-source-map --quiet
	npx purgecss --css $(FRONTEND_DIST)/styles/main.css \
	--content "$(FRONTEND_SRC)/**/*.{html,tsx,vue}" --output $(FRONTEND_DIST)/styles/
	NODE_ENV=production npx postcss $(FRONTEND_DIST)/styles/main.css --replace
