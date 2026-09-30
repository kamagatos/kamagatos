import importlib.util
import pathlib
import unittest

import numpy as np

# The source is `mlp.task.py`, whose name is not a valid import path, so load it
# directly from disk.
_MODULE_PATH = pathlib.Path(__file__).with_name("mlp.task.py")
_spec = importlib.util.spec_from_file_location("mlp_task", _MODULE_PATH)
mlp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(mlp)


class MlpTest(unittest.TestCase):
    def test_relu_clamps_negatives(self) -> None:
        np.testing.assert_array_equal(mlp.relu(np.array([-2.0, 0.0, 3.0])), np.array([0.0, 0.0, 3.0]))

    def test_softmax_sums_to_one(self) -> None:
        self.assertAlmostEqual(float(mlp.softmax(np.array([1.0, 2.0, 3.0])).sum()), 1.0)

    def test_forward_is_a_probability_distribution(self) -> None:
        output = mlp.forward(np.array([0.5, -1.2, 3.3, 0.7]), seed=0)
        self.assertEqual(output.shape, (3,))
        self.assertAlmostEqual(float(output.sum()), 1.0)
        self.assertTrue(bool(np.all(output >= 0.0)))


if __name__ == "__main__":
    unittest.main()
