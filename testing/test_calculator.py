# Unit Tests for Calculator App

# Run with the following command:
# python3 -m unittest test_calculator.py
# or just press the Run button on the top right!

import unittest
import calculator

# Unit tests
class TestCalculator(unittest.TestCase):
    def test_add(self):
        result = calculator.add(10, 5)
        self.assertEqual(result, 15)
    
        result = calculator.subtract(25, 25)
        self.assertEqual(result, 0)

        result = calculator.multiply(2, 4)
        self.assertEqual(result, 8)

        result = calculator.divide(25, 0)
        self.assertEqual(result, 1)



# Run the tests
if __name__ == "__main__":
    unittest.main()