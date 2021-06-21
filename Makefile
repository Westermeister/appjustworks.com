# Command variables.
ESLINT=npx eslint
POSTCSS=NODE_ENV=production npx postcss
PRETTIER=npx prettier
PURGECSS=npx purgecss
SASS=npx sass
TSC=npx tsc
UGLIFY=npx uglifyjs

# Important paths.
SCRIPTS_DIR=./frontend/scripts
STYLES_DIR=./frontend/styles

# Store flags into these variables.
POSTCSS_FLAGS=--replace
PRETTIER_FLAGS=--write "./frontend/**/*.{html,scss,tsx}"
PURGECSS_FLAGS=--css $(STYLES_DIR)/dist/main.css --content "./frontend/**/*.{html,js}" --output $(STYLES_DIR)/dist/
SASS_FLAGS=--load-path=node_modules --load-path=node_modules/bootstrap/scss --no-source-map
TSC_FLAGS=--strict --target es2017 --module es2015 --jsx react --moduleResolution node --outDir $(SCRIPTS_DIR)/dist
UGLIFY_FLAGS=--compress --mangle

.PHONY: all
all: eslint prettier scripts styles

.PHONY: eslint
eslint: prettier
	$(ESLINT) "$(SCRIPTS_DIR)/src/**/*.tsx"

.PHONY: prettier
prettier:
	$(PRETTIER) $(PRETTIER_FLAGS)

.PHONY: scripts
scripts: eslint prettier
	rm -rf $(SCRIPTS_DIR)/dist
	$(TSC) $(SCRIPTS_DIR)/src/*.tsx $(TSC_FLAGS)
	$(foreach file, $(wildcard $(SCRIPTS_DIR)/dist/*), $(UGLIFY) $(file) $(UGLIFY_FLAGS) -o $(file))

.PHONY: styles
styles: prettier
	rm -rf $(STYLES_DIR)/dist
	$(SASS) $(STYLES_DIR)/src:$(STYLES_DIR)/dist $(SASS_FLAGS)
	$(PURGECSS) $(PURGECSS_FLAGS)
	$(POSTCSS) $(STYLES_DIR)/dist/main.css $(POSTCSS_FLAGS)
