import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock data for flashcard content - in a real app, this would come from Supabase
const mockFlashcardData: { [key: string]: any } = {
  "1": {
    title: "Psalms of Comfort",
    description: "Encouraging verses from the book of Psalms",
    cards: [
      {
        id: 1,
        reference: "Psalm 23:1",
        passage: "The Lord is my shepherd; I shall not want.",
      },
      {
        id: 2,
        reference: "Psalm 46:1",
        passage:
          "God is our refuge and strength, a very present help in trouble.",
      },
      {
        id: 3,
        reference: "Psalm 91:1",
        passage:
          "He who dwells in the shelter of the Most High will abide in the shadow of the Almighty.",
      },
    ],
  },
  "2": {
    title: "Jesus' Teachings",
    description: "Key teachings and parables from the Gospels",
    cards: [
      {
        id: 1,
        reference: "Matthew 5:3",
        passage:
          "Blessed are the poor in spirit, for theirs is the kingdom of heaven.",
      },
      {
        id: 2,
        reference: "John 14:6",
        passage:
          "Jesus said to him, 'I am the way, and the truth, and the life. No one comes to the Father except through me.'",
      },
    ],
  },
  "3": {
    title: "Faith & Trust",
    description: "Verses about trusting in God's plan",
    cards: [
      {
        id: 1,
        reference: "Proverbs 3:5-6",
        passage:
          "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
      },
      {
        id: 2,
        reference: "Romans 8:28",
        passage:
          "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
      },
      {
        id: 3,
        reference: "Jeremiah 29:11",
        passage:
          "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
      },
    ],
  },
};

export default function ViewFlashcard() {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardSet, setFlashcardSet] = useState<any>(null);

  useEffect(() => {
    if (setId && mockFlashcardData[setId]) {
      setFlashcardSet(mockFlashcardData[setId]);
    } else {
      // If set not found, redirect to dashboard
      navigate("/dashboard");
    }
  }, [setId, navigate]);

  if (!flashcardSet) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Flashcard set not found
          </h2>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = flashcardSet.cards[currentCardIndex];
  const totalCards = flashcardSet.cards.length;

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {flashcardSet.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {flashcardSet.description}
                </p>
              </div>
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">
            Card {currentCardIndex + 1} of {totalCards}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentCardIndex + 1) / totalCards) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl h-80">
            <div
              className={cn(
                "absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer",
                isFlipped ? "rotate-y-180" : "",
              )}
              onClick={handleCardClick}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front of card */}
              <Card
                className={cn(
                  "absolute inset-0 w-full h-full backface-hidden border-2 border-blue-200 hover:border-blue-300 transition-colors",
                  "flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100",
                )}
              >
                <CardContent className="text-center p-8">
                  <div className="text-2xl font-bold text-blue-900 mb-4">
                    {currentCard.reference}
                  </div>
                  <div className="text-sm text-blue-600">
                    Click to reveal passage
                  </div>
                </CardContent>
              </Card>

              {/* Back of card */}
              <Card
                className={cn(
                  "absolute inset-0 w-full h-full backface-hidden rotate-y-180 border-2 border-green-200",
                  "flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100",
                )}
              >
                <CardContent className="text-center p-8">
                  <div className="text-sm font-medium text-green-700 mb-4">
                    {currentCard.reference}
                  </div>
                  <div className="text-lg text-green-900 leading-relaxed">
                    &quot;{currentCard.passage}&quot;
                  </div>
                  <div className="text-sm text-green-600 mt-4">
                    Click to see reference
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-gray-500 px-4">
            {currentCardIndex + 1} / {totalCards}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentCardIndex === totalCards - 1}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Click on the flashcard to flip between reference and passage</p>
          <p>
            Use the navigation buttons or keyboard arrows to move between cards
          </p>
        </div>
      </main>

      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
