import sys
import os
import unittest
import json
from unittest.mock import patch

# Ensure the parent directory (backend/) is in the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import the Flask app from the backend
from app import app

# Mock MongoDB connection
class MockDatabase:
    def __init__(self):
        self.db = mongomock.MongoClient().db

    def get_db(self):
        return self.db

class FlaskTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('app.openai.ChatCompletion.create')
    @patch('app.get_db', return_value=MockDatabase().get_db())
    def test_chatbot(self, mock_db, mock_openai):
        # Mock GPT-3.5 response
        mock_openai.return_value = {
            'choices': [{
                'message': {'content': 'Mock GPT response'}
            }]
        }
        response = self.app.post('/api/chatbot', 
                                 data=json.dumps({"message": "Test message"}),
                                 content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('response', data)
        self.assertEqual(data['response'], 'Mock GPT response')

if __name__ == '__main__':
    unittest.main()
