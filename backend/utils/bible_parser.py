import re
from bible.bible_aliases import BOOK_ALIASES

def parse_range(reference: str):
    reference = reference.strip()
    
    # Try full match with optional verse and range
    match = re.match(r"([^\d]+)\s*(\d+)(?::(\d+)(?:-(\d+))?)?", reference, re.IGNORECASE)
    if not match:
        raise ValueError("Invalid reference format")

    book_raw, chapter, start_verse, end_verse = match.groups()

    # Resolve book name using aliases
    book_key = book_raw.strip().lower()
    book = BOOK_ALIASES.get(book_key, book_raw.strip())

    chapter = int(chapter)
    if start_verse:
        start = int(start_verse)
        end = int(end_verse) if end_verse else start
    else:
        # If no verse given, default to entire chapter
        start = 1
        end = 999  # You can limit this to actual verse counts if needed

    return book, chapter, start, end