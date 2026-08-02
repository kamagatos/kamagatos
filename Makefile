.PHONY: dev build check

dev:
	hugo server --buildDrafts --disableFastRender

build:
	hugo --minify --gc

check:
	hugo --printPathWarnings --panicOnWarning

