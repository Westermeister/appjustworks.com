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

.PHONY: check-character
check-character: prettier
	$(PLAYWRIGHT) test $(PLAYWRIGHT_FLAGS) tests/character.spec.ts

.PHONY: check-age
check-age: prettier
	$(PLAYWRIGHT) test $(PLAYWRIGHT_FLAGS) tests/age.spec.ts

.PHONY: clean
clean:
	rm -rf $(FRONTEND_DIST)

# END: Standard targets.

.PHONY: dist
dist:
	mkdir -p $(FRONTEND_DIST)
	mkdir -p $(FRONTEND_DIST)/assets/images
	mkdir -p $(FRONTEND_DIST)/assets/styles
	mkdir -p $(FRONTEND_DIST)/assets/scripts
	mkdir -p $(FRONTEND_DIST)/apps

.PHONY: eslint
eslint: prettier
	npx eslint "$(FRONTEND_SRC)/assets/scripts/**/*.{js,tsx,vue}"

.PHONY: html
html: dist prettier
	cp $(FRONTEND_SRC)/*.html $(FRONTEND_DIST)
	cp $(FRONTEND_SRC)/apps/*.html $(FRONTEND_DIST)/apps

.PHONY: images
images: dist
	# Trailing "/." means to copy over CONTENTS of folder, not folder itself.
	cp -r $(FRONTEND_SRC)/assets/images/. $(FRONTEND_DIST)/assets/images

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
	npx sass $(FRONTEND_SRC)/assets/styles:$(FRONTEND_DIST)/assets/styles \
	--load-path=node_modules --load-path=node_modules/bootstrap/scss --no-source-map --quiet
	npx purgecss --css $(FRONTEND_DIST)/assets/styles/main.css \
	--content "$(FRONTEND_SRC)/**/*.{html,tsx,vue}" --output $(FRONTEND_DIST)/assets/styles/
	NODE_ENV=production npx postcss $(FRONTEND_DIST)/assets/styles/main.css --replace
