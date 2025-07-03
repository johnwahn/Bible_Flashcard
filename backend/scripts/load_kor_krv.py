
from pymongo.mongo_client import MongoClient
import os
from dotenv import load_dotenv
import json

book_name_map = {
    # 구약
    "창": "창세기",
    "출": "출애굽기",
    "레": "레위기",
    "민": "민수기",
    "신": "신명기",
    "수": "여호수아",
    "삿": "사사기",
    "룻": "룻기",
    "삼상": "사무엘상",
    "삼하": "사무엘하",
    "왕상": "열왕기상",
    "왕하": "열왕기하",
    "대상": "역대상",
    "대하": "역대하",
    "스": "에스라",
    "느": "느헤미야",
    "에": "에스더",
    "욥": "욥기",
    "시": "시편",
    "잠": "잠언",
    "전": "전도서",
    "아": "아가",
    "사": "이사야",
    "렘": "예레미야",
    "애": "예레미야 애가",
    "겔": "에스겔",
    "단": "다니엘",
    "호": "호세아",
    "욜": "요엘",
    "암": "아모스",
    "옵": "오바댜",
    "욘": "요나",
    "미": "미가",
    "나": "나훔",
    "합": "하박국",
    "습": "스바냐",
    "학": "학개",
    "슥": "스가랴",
    "말": "말라기",

    # 신약
    "마": "마태복음",
    "막": "마가복음",
    "눅": "누가복음",
    "요": "요한복음",
    "행": "사도행전",
    "롬": "로마서",
    "고전": "고린도전서",
    "고후": "고린도후서",
    "갈": "갈라디아서",
    "엡": "에베소서",
    "빌": "빌립보서",
    "골": "골로새서",
    "살전": "데살로니가전서",
    "살후": "데살로니가후서",
    "딤전": "디모데전서",
    "딤후": "디모데후서",
    "딛": "디도서",
    "몬": "빌레몬서",
    "히": "히브리서",
    "약": "야고보서",
    "벧전": "베드로전서",
    "벧후": "베드로후서",
    "요일": "요한일서",
    "요이": "요한이서",
    "요삼": "요한삼서",
    "유": "유다서",
    "계": "요한계시록"
}



# Load environment variables from .env file
load_dotenv()

# Read the Mongo URI from the .env file
MONGO_URI = os.getenv("MONGO_URI")

# Create a new client and connect to the server
client = MongoClient(MONGO_URI)
db = client["bible"]
collection = db["bible_krv"]

# Load and insert the JSON data
with open("kor_krv_bible.json", encoding="utf-8") as f:
    krv_data = json.load(f)

# Transform the data
documents = []

for ref, text in krv_data.items():
    try:
        book_code = ''.join(filter(str.isalpha, ref))      # "신"
        chapter_verse = ref[len(book_code):]               # "6:18-19" or "6:18"
        book = book_name_map[book_code]

        chapter_part, verse_part = chapter_verse.split(":")
        chapter = int(chapter_part)

        if "-" in verse_part:
            # Handle verse range, e.g., 18-19
            start_verse, end_verse = map(int, verse_part.split("-"))
            for verse in range(start_verse, end_verse + 1):
                documents.append({
                    "book": book,
                    "chapter": chapter,
                    "verse": verse,
                    "text": text.strip(),
                    "source_ref": ref  # optional: original ref like "신6:18-19"
                })
        else:
            verse = int(verse_part)
            documents.append({
                "book": book,
                "chapter": chapter,
                "verse": verse,
                "text": text.strip()
            })

    except Exception as e:
        print(f"Skipping {ref}: {e}")

collection.delete_many({})  # Clear old data
collection.insert_many(documents)

print("✅ Verses inserted successfully!")