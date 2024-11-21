import password_validator
import unittest

# # Unit tests
# class TestPassword1(unittest.TestCase):
#     def test_password(self):
#         result = password_validator.validate_password("Vaibhav#543")
#         self.assertTrue(result)


# # # Run the tests
# if __name__ == "__main__":
#     unittest.main()


# Unit tests
# class TestPassword(unittest.TestCase):
    # def test_password2(self):
    #     result = password_validator.validate_password("Greeshma$543")
    #     self.assertTrue(result)


# Run the tests
# if __name__ == "__main__":
#     unittest.main()

class TestPassword(unittest.TestCase):
    def test_password3(self):
        result = password_validator.validate_password("Lofi$543")
        self.assertTrue(result)

if __name__ == "__main__":
    unittest.main()

