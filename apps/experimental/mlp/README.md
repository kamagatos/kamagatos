# mlp

A tiny multilayer perceptron. `start` runs a single forward pass of a
1-hidden-layer network (numpy) and prints the resulting class probabilities.

`numpy` is installed through the central manifest (`python.json`) into the
shared virtualenv when the target builds.

## Run

```bash
h run apps/experimental/mlp:mlp
```

Optionally pass inputs/seed (the run task forwards `libraryOptions` as JSON);
edit `BUILD.ts` to change them.

## Test

```bash
h test apps/experimental/mlp:all_tests
```
