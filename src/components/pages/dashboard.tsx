import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

// Mock data for flashcard sets - in a real app, this would come from Supabase
const mockFlashcardSets = [
  {
    id: 1,
    title: "HSK4 843-922, HSK4 923-1012",
    subtitle: "Flashcard set",
    cardCount: 122,
    createdBy: "by you",
    type: "flashcard",
  },
  {
    id: 2,
    title: "Test1",
    subtitle: "Flashcard set",
    cardCount: 2,
    createdBy: "by you",
    type: "flashcard",
  },
  {
    id: 3,
    title: "HSK 4 접수부서",
    subtitle: "Flashcard set",
    cardCount: 72,
    createdBy: "by you",
    type: "flashcard",
  },
  {
    id: 4,
    title: "Untitled flashcard set",
    subtitle: "Draft",
    cardCount: 1,
    createdBy: "by you",
    type: "draft",
  },
  {
    id: 5,
    title: "HSK4 1154-1200, HSK4 1107-1153, HSK4 1060-1106, HSK4 10...",
    subtitle: "Flashcard set",
    cardCount: 138,
    createdBy: "by you",
    type: "flashcard",
  },
];

const Dashboard = () => {
  const [flashcardSets, setFlashcardSets] = useState(mockFlashcardSets);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredSets = flashcardSets.filter((set) =>
    set.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSetClick = (setId: number) => {
    navigate(`/view-flashcard/${setId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Bible Flashcards
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Hi there! Are you taking any new courses?
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              </div>
              <span>You've studied for 1 course so far!</span>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">
              Enter your new courses
            </h3>
            <p className="text-sm text-gray-600">
              Add your courses to see what others might be studying
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for study guides"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Recents Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recents</h3>

          {filteredSets.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No flashcard sets yet
              </h3>
              <p className="text-gray-500 mb-6">
                Click here to make a new set and start studying Bible verses
              </p>
              <Link to="/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 flex items-center gap-2 mx-auto">
                  <Plus className="h-5 w-5" />
                  Create Your First Set
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSets.map((set) => (
                <Card
                  key={set.id}
                  className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                  onClick={() => handleSetClick(set.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          set.type === "draft" ? "bg-purple-100" : "bg-blue-100"
                        }`}
                      >
                        <BookOpen
                          className={`h-5 w-5 ${
                            set.type === "draft"
                              ? "text-purple-600"
                              : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-medium text-gray-900 truncate">
                          {set.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <span>{set.subtitle}</span>
                          <span>•</span>
                          <span>{set.cardCount} terms</span>
                          <span>•</span>
                          <span>{set.createdBy}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Generate Study Materials Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Generate study materials in seconds
                </h3>
              </div>
            </div>
            <Button
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Study faster →
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
