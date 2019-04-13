# vue-electron-go-wasm

Proof of concept project to incorporate Go routines in Electron
with WebAssembly.  The idea is to use Go (or possibly C++)
for tasks that require greater performance.

The good news is Electron sets the environment for WebAssembly
under Chrome, already, so there is no additional configuration
necessary for Electron.

It's a minimalist test, but it does show a Go routine being loaded
and called from JS to modify a piece of JSON.  The JSON is stringified
before sending to Go (simplifies arg passing).  Go returns stringified
JSON, which the JS can parse.

Stringifying/parsing JSON carries its own performance burden, but
it would likely be just a burdensome to marshall a JSON (or other)
structure back and forth across the interop boundary.

I'm not going to take this any further, right now.  May revisit
when I have the need.

13-Apr-2019 -- rickb

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn electron:serve
```

### Compiles and minifies for production
```
yarn electron:build
```

