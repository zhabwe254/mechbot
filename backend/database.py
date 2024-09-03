from pymongo import MongoClient

def get_db():
    client = MongoClient('mongodb+srv://gmarkd:UEO2AqP2DLHJEqab@cluster.mongodb.net/?retryWrites=true&w=majority')
    db = client['manager']
    return db
