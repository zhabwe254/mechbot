import sys
import os
import unittest
import mongomock

# Ensure the parent directory (backend/) is in the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import the log_conversation function from the models
from models.conversation import log_conversation

class TestMongoDB(unittest.TestCase):
    def setUp(self):
        self.db = mongomock.MongoClient().db

    def test_log_conversation(self):
        user_message = "What is the cooling load?"
        bot_reply = "The cooling load is 5 tons."
        chat_type = "HVAC"

        log_conversation(self.db, user_message, bot_reply, chat_type)

        conversation = self.db.conversations.find_one({"user_message": user_message})
        self.assertIsNotNone(conversation)
        self.assertEqual(conversation['bot_reply'], bot_reply)

if __name__ == '__main__':
    unittest.main()
