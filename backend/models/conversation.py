from datetime import datetime

def log_conversation(db, user_message, bot_reply, chat_type):
    conversations = db.conversations
    conversation_entry = {
        'user_message': user_message,
        'bot_reply': bot_reply,
        'chat_type': chat_type,
        'timestamp': datetime.utcnow()
    }
    conversations.insert_one(conversation_entry)
    return conversation_entry
