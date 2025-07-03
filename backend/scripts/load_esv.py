from pymongo import MongoClient
import os
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["bible"]
collection = db["bible_esv"]  # Name the collection appropriately

# Load the ESV Bible JSON
with open("esv_bible.json", encoding="utf-8") as f:
    esv_data = json.load(f)

# Transform nested structure into a flat list of documents
documents = []

for book, chapters in esv_data.items():
    for chapter, verses in chapters.items():
        for verse, text in verses.items():
            try:
                documents.append({
                    "book": book,
                    "chapter": int(chapter),
                    "verse": int(verse),
                    "text": text.strip()
                })
            except Exception as e:
                print(f"Skipping {book} {chapter}:{verse} -> {e}")

# Clear and insert
collection.delete_many({})
collection.insert_many(documents)

print("✅ ESV Bible inserted successfully!")
