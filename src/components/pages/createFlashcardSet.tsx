import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { bibleBooks, chapterCounts, verseCounts } from "@/data/bibleData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, X, BookOpen, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface SelectedVerse {
  book: string;
  chapter: number;
  verse: number;
  reference: string;
}

export default function CreateFlashcardSet() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedVerse, setSelectedVerse] = useState("");
  const [selectedVerses, setSelectedVerses] = useState<SelectedVerse[]>([]);
  const [selectedVerseNumbers, setSelectedVerseNumbers] = useState<number[]>(
    [],
  );
  const [isVerseDialogOpen, setIsVerseDialogOpen] = useState(false);

  const availableChapters = selectedBook
    ? Array.from({ length: chapterCounts[selectedBook] || 1 }, (_, i) => i + 1)
    : [];

  const availableVerses =
    selectedBook && selectedChapter
      ? Array.from(
          {
            length:
              verseCounts[selectedBook]?.[parseInt(selectedChapter)] || 31,
          },
          (_, i) => i + 1,
        )
      : [];

  const handleVerseToggle = (verseNumber: number) => {
    setSelectedVerseNumbers((prev) => {
      if (prev.includes(verseNumber)) {
        return prev.filter((v) => v !== verseNumber);
      } else {
        return [...prev, verseNumber].sort((a, b) => a - b);
      }
    });
  };

  const handleAddSelectedVerses = () => {
    if (selectedBook && selectedChapter && selectedVerseNumbers.length > 0) {
      const newVerses: SelectedVerse[] = selectedVerseNumbers.map(
        (verseNumber) => {
          const reference = `${selectedBook} ${selectedChapter}:${verseNumber}`;
          return {
            book: selectedBook,
            chapter: parseInt(selectedChapter),
            verse: verseNumber,
            reference,
          };
        },
      );

      // Filter out verses that already exist
      const uniqueNewVerses = newVerses.filter(
        (newVerse) =>
          !selectedVerses.some(
            (existingVerse) => existingVerse.reference === newVerse.reference,
          ),
      );

      if (uniqueNewVerses.length > 0) {
        setSelectedVerses([...selectedVerses, ...uniqueNewVerses]);
      }

      // Reset selections and close dialog
      setSelectedVerseNumbers([]);
      setIsVerseDialogOpen(false);
    }
  };

  const getVerseRangeDisplay = () => {
    if (selectedVerseNumbers.length === 0) return "Select verses";
    if (selectedVerseNumbers.length === 1)
      return `Verse ${selectedVerseNumbers[0]}`;

    const sorted = [...selectedVerseNumbers].sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = sorted[i];
        end = sorted[i];
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);

    return `Verses ${ranges.join(", ")}`;
  };

  const handleRemoveVerse = (index: number) => {
    setSelectedVerses(selectedVerses.filter((_, i) => i !== index));
  };

  const handleSaveSet = () => {
    if (title && selectedVerses.length > 0) {
      // Here you would save to Supabase
      console.log("Saving flashcard set:", {
        title,
        description,
        verses: selectedVerses,
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Create a New Flashcard Set
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Set Details */}
          <Card>
            <CardHeader>
              <CardTitle>Set Details</CardTitle>
              <CardDescription>
                Give your flashcard set a name and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for your flashcard set"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Verse Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Bible Verses</CardTitle>
              <CardDescription>
                Choose the book, chapter, and verse for your flashcards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selection Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Book</Label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select book" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {bibleBooks.map((book) => (
                        <SelectItem key={book} value={book}>
                          {book}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Chapter</Label>
                  <Select
                    value={selectedChapter}
                    onValueChange={setSelectedChapter}
                    disabled={!selectedBook}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {availableChapters.map((chapter) => (
                        <SelectItem key={chapter} value={chapter.toString()}>
                          {chapter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Verses</Label>
                  <Dialog
                    open={isVerseDialogOpen}
                    onOpenChange={setIsVerseDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        disabled={!selectedChapter}
                      >
                        <span className="truncate">
                          {getVerseRangeDisplay()}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedBook} {selectedChapter} - Select Verses
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto p-2">
                        {availableVerses.map((verse) => (
                          <Button
                            key={verse}
                            variant={
                              selectedVerseNumbers.includes(verse)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className={`h-10 w-full ${
                              selectedVerseNumbers.includes(verse)
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => handleVerseToggle(verse)}
                          >
                            {verse}
                          </Button>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-sm text-gray-600">
                          {selectedVerseNumbers.length} verse
                          {selectedVerseNumbers.length !== 1 ? "s" : ""}{" "}
                          selected
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVerseNumbers([]);
                              setIsVerseDialogOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleAddSelectedVerses}
                            disabled={selectedVerseNumbers.length === 0}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Add {selectedVerseNumbers.length} Verse
                            {selectedVerseNumbers.length !== 1 ? "s" : ""}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Selected Verses */}
              {selectedVerses.length > 0 && (
                <div className="space-y-3">
                  <Label>Selected Verses ({selectedVerses.length})</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedVerses.map((verse, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                      >
                        <span className="text-sm font-medium text-blue-900">
                          {verse.reference}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveVerse(index)}
                          className="h-6 w-6 p-0 text-blue-600 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveSet}
              disabled={!title || selectedVerses.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Flashcard Set
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
