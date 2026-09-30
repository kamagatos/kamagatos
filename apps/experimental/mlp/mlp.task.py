import numpy as np


def relu(x: np.ndarray) -> np.ndarray:
    """Rectified linear activation."""
    return np.maximum(0.0, x)


def softmax(x: np.ndarray) -> np.ndarray:
    """Numerically stable softmax over a 1-D vector."""
    shifted = x - np.max(x)
    exps = np.exp(shifted)
    return exps / np.sum(exps)


def forward(inputs: np.ndarray, seed: int = 0) -> np.ndarray:
    """Run a single forward pass of a tiny 1-hidden-layer MLP.

    Weights are drawn deterministically from ``seed`` so the output is
    reproducible. The network maps the inputs to a 3-class distribution.
    """
    rng = np.random.default_rng(seed)
    w1 = rng.standard_normal((inputs.shape[0], 8))
    w2 = rng.standard_normal((8, 3))

    hidden = relu(inputs @ w1)
    logits = hidden @ w2
    return softmax(logits)


def handler(params: dict) -> dict:
    """Task handler invoked through the H run task.

    Reads inputs from ``taskOptions`` and returns the output distribution.
    """
    options = params.get("taskOptions", {})
    inputs = np.array(options.get("inputs", [0.5, -1.2, 3.3, 0.7]))
    # CLI flags arrive as strings (`--seed=42`), so coerce to int.
    probabilities = forward(inputs, seed=int(options.get("seed", 0)))
    print("MLP output probabilities:", np.array2string(probabilities, precision=4))
    return {"probabilities": probabilities.tolist()}


if __name__ == "__main__":
    import h_task

    h_task.run(handler)
