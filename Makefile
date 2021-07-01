# Command variables.
ESLINT=npx eslint
GZIP=gzip
OBFUSCATOR=npx javascript-obfuscator
PLAYWRIGHT=npx playwright
POSTCSS=NODE_ENV=production npx postcss
PRETTIER=npx prettier
PURGECSS=npx purgecss
SASS=npx sass
TSC=npx tsc
UGLIFY=npx uglifyjs

# Important paths.
WEBROOT=./frontend
SCRIPTS_DIR=$(WEBROOT)/scripts
STYLES_DIR=$(WEBROOT)/styles

# Store flags into these variables.
GZIP_FLAGS=-9 --keep --force
OBFUSCATOR_FLAGS=--options-preset medium-obfuscation
PLAYWRIGHT_FLAGS=--browser=all
POSTCSS_FLAGS=--replace
PRETTIER_FLAGS=--write "./frontend/**/*.{html,scss,tsx}" "./tests/**/*.spec.ts"
PURGECSS_FLAGS=--css $(STYLES_DIR)/dist/main.css --content "./frontend/**/*.{html,tsx}" --output $(STYLES_DIR)/dist/
SASS_FLAGS=--load-path=node_modules --load-path=node_modules/bootstrap/scss --no-source-map --quiet
TSC_FLAGS=--strict --target es2017 --module es2015 --jsx react --moduleResolution node --outDir $(SCRIPTS_DIR)/dist
UGLIFY_FLAGS=--compress --mangle --comments "/^!/"

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
	$(TSC) $(SCRIPTS_DIR)/src/*.tsx $(TSC_FLAGS)
	$(foreach file, $(wildcard $(SCRIPTS_DIR)/dist/*.js), $(UGLIFY) $(file) $(UGLIFY_FLAGS) -o $(file);)
	$(foreach file, $(wildcard $(SCRIPTS_DIR)/dist/*.js), $(OBFUSCATOR) $(file) --output $(file) $(OBFUSCATOR_FLAGS))
	$(foreach file, $(wildcard $(SCRIPTS_DIR)/dist/*.js), $(GZIP) $(GZIP_FLAGS) $(file);)

.PHONY: styles
styles: prettier
	rm -rf $(STYLES_DIR)/dist
	$(SASS) $(STYLES_DIR)/src:$(STYLES_DIR)/dist $(SASS_FLAGS)
	$(PURGECSS) $(PURGECSS_FLAGS)
	$(POSTCSS) $(STYLES_DIR)/dist/main.css $(POSTCSS_FLAGS)
	$(GZIP) $(GZIP_FLAGS) $(STYLES_DIR)/dist/main.css
