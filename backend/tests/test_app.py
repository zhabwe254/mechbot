import unittest
import json
from app import app
from unittest.mock import patch
import mongomock
from database import get_db

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
        self.mock_db = MockDatabase()

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

    def test_pipe_sizing(self):
        response = self.app.post('/api/pipe_sizing', 
                                 data=json.dumps({"flow_rate": 0.1, "velocity": 1.0}),
                                 content_type='application/json')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('pipe_diameter', data)

    def test_voltage_drop(self):
        response = self.app.post('/api/voltage_drop', 
                                 data=json.dumps({"current": 10, "resistance": 2}),
                                 content_type='application/json')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('voltage_drop', data)
        self.assertEqual(data['voltage_drop'], '20.00 volts')

if __name__ == '__main__':
    unittest.main()
