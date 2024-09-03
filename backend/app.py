from flask import Flask, request, jsonify
import openai
from database import get_db
from models.conversation import log_conversation

app = Flask(__name__)

# OpenAI API Key
openai.api_key = "sk-OE6u08zD0sMv_PGw2M8XmgQFICn8tv6NUZ6YwEW0j3T3BlbkFJtftUSXpyiiyYWd19cRwenJixxYTUdDcu7w64ICn2gA"

# MongoDB
db = get_db()

# GPT-4 or GPT-3.5 Turbo chatbot
@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_message = data.get('message')
    chat_type = "mechanical_engineering"  # Define the chat type (HVAC, plumbing, etc.)

    # System setup message for chatbot context
    system_msg = "You are a chatbot designed to assist with mechanical engineering, HVAC, plumbing, and electrical troubleshooting."

    # Chat messages to send to OpenAI GPT
    messages = [
        {"role": "system", "content": system_msg},
        {"role": "user", "content": user_message}
    ]

    # GPT API call
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Use "gpt-4" for GPT-4 model
        messages=messages
    )
    bot_reply = response['choices'][0]['message']['content']

    # Log conversation to MongoDB
    log_conversation(db, user_message, bot_reply, chat_type)

    # Return response to frontend
    return jsonify({"response": bot_reply})

# Other API endpoints like pipe sizing, HVAC, etc., remain the same...
# Include calculations for pipe sizing, structural load, and voltage drop
