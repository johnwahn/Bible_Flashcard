import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  Settings,
  User,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Play,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { useState, useEffect } from "react";

// Mock data for flashcard sets - in a real app, this would come from Supabase
const mockFlashcardSets = [
  {
    id: 1,
    name: "Psalms of Comfort",
    description: "Encouraging verses from the book of Psalms",
    cardCount: 12,
    lastStudied: "2 days ago",
    verses: ["Psalm 23:1", "Psalm 46:1", "Psalm 91:1"],
  },
  {
    id: 2,
    name: "Jesus' Teachings",
    description: "Key teachings and parables from the Gospels",
    cardCount: 8,
    lastStudied: "1 week ago",
    verses: ["Matthew 5:3", "John 14:6", "Luke 6:31"],
  },
  {
    id: 3,
    name: "Faith & Trust",
    description: "Verses about trusting in God's plan",
    cardCount: 15,
    lastStudied: "3 days ago",
    verses: ["Proverbs 3:5-6", "Romans 8:28", "Jeremiah 29:11"],
  },
];

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const [flashcardSets, setFlashcardSets] = useState(mockFlashcardSets);

  const navigate = useNavigate();

  const handleDeleteSet = (setId: number) => {
    setFlashcardSets((prev) => prev.filter((set) => set.id !== setId));
  };

  const handleEditSet = (setId: number) => {
    // Navigate to edit page - placeholder for now
    console.log("Edit set:", setId);
  };

  const handleStudySet = (setId: number) => {
    // Navigate to study mode - placeholder for now
    console.log("Study set:", setId);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="max-w-[980px] mx-auto flex h-12 items-center justify-between px-4">
          <div className="flex items-center">
            <Link
              to="/"
              className="font-medium text-xl flex items-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Bible Flashcards
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-black text-white hover:bg-gray-800 text-sm px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-12">
        {user ? (
          /* Authenticated User - Flashcard Sets Dashboard */
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  My Flashcard Sets
                </h1>
                <p className="text-gray-600">
                  Create, study, and manage your Bible verse flashcards
                </p>
              </div>
              <Link to="/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Set
                </Button>
              </Link>
            </div>

            {flashcardSets.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No flashcard sets yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first set to start studying Bible verses
                </p>
                <Link to="/create">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 flex items-center gap-2 mx-auto">
                    <Plus className="h-5 w-5" />
                    Create Your First Set
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcardSets.map((set) => (
                  <Card
                    key={set.id}
                    className="hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                            {set.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            {set.description}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditSet(set.id)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Set
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteSet(set.id)}
                              className="cursor-pointer text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Set
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{set.cardCount} cards</span>
                          <span>Last studied: {set.lastStudied}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Sample verses:</span>{" "}
                          {set.verses.slice(0, 2).join(", ")}
                          {set.verses.length > 2 &&
                            " +" + (set.verses.length - 2) + " more"}
                        </div>
                        <Button
                          onClick={() => handleStudySet(set.id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 flex items-center justify-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Study Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Non-authenticated User - Landing Page */
          <>
            {/* Hero section */}
            <section className="py-20 text-center">
              <h2 className="text-5xl font-semibold tracking-tight mb-1">
                Bible Flashcard Creator
              </h2>
              <h3 className="text-2xl font-medium text-gray-500 mb-4">
                Build, study, and manage Bible verse flashcards with ease.
              </h3>
              <div className="flex justify-center space-x-6 text-xl text-blue-600">
                <Link
                  to="/create"
                  className="flex items-center hover:underline"
                >
                  Get started <ChevronRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="flex items-center hover:underline">
                  Sign in <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </>
        )}

        {!user && (
          /* Features section - only show for non-authenticated users */
          <section className="py-20 bg-[#f5f5f7] text-center">
            <h2 className="text-5xl font-semibold tracking-tight mb-1">
              Powerful Features
            </h2>
            <h3 className="text-2xl font-medium text-gray-500 mb-4">
              Everything you need to study Bible verses effectively
            </h3>
            <div className="flex justify-center space-x-6 text-xl text-blue-600">
              <Link to="/signup" className="flex items-center hover:underline">
                Get started <ChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="flex items-center hover:underline">
                Sign in <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-medium mb-2">Easy Creation</h4>
                <p className="text-gray-500">
                  Select Bible books, chapters, and verses with our intuitive
                  hierarchical interface.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Play className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-medium mb-2">Study Mode</h4>
                <p className="text-gray-500">
                  Interactive flashcard study sessions with verse references and
                  full passages.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-medium mb-2">Manage Sets</h4>
                <p className="text-gray-500">
                  Organize your flashcard sets with edit and delete
                  functionality for easy management.
                </p>
              </div>
            </div>
          </section>
        )}

        {!user && (
          /* Grid section for other features - only show for non-authenticated users */
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
            <div className="bg-[#f5f5f7] rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-semibold tracking-tight mb-1">
                Verse Selection
              </h2>
              <h3 className="text-xl font-medium text-gray-500 mb-4">
                Hierarchical Bible navigation
              </h3>
              <div className="flex justify-center space-x-6 text-lg text-blue-600">
                <Link
                  to="/create"
                  className="flex items-center hover:underline"
                >
                  Get started <ChevronRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="flex items-center hover:underline">
                  Sign in <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-4 bg-white p-6 rounded-xl shadow-sm max-w-sm mx-auto">
                <div className="space-y-4">
                  <div className="h-10 bg-gray-100 rounded-md w-full flex items-center px-3 text-sm text-gray-600">
                    Select Book
                  </div>
                  <div className="h-10 bg-gray-100 rounded-md w-full flex items-center px-3 text-sm text-gray-600">
                    Select Chapter
                  </div>
                  <div className="h-10 bg-blue-100 rounded-md w-full flex items-center px-3 text-sm text-blue-600">
                    Select Verses
                  </div>
                  <div className="text-xs text-gray-500 text-left">
                    Multi-select with click or drag
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#f5f5f7] rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-semibold tracking-tight mb-1">
                Flashcard Study
              </h2>
              <h3 className="text-xl font-medium text-gray-500 mb-4">
                Interactive learning experience
              </h3>
              <div className="flex justify-center space-x-6 text-lg text-blue-600">
                <Link
                  to="/create"
                  className="flex items-center hover:underline"
                >
                  Get started <ChevronRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="flex items-center hover:underline">
                  Sign in <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-4 bg-white p-6 rounded-xl shadow-sm max-w-sm mx-auto text-left">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Front: Verse Reference
                  </div>
                  <div className="text-xs text-gray-500 mb-4">John 3:16</div>
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Back: Full Passage
                    </div>
                    <div className="text-xs text-gray-500">
                      &quot;For God so loved the world...&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] py-12 text-xs text-gray-500">
        <div className="max-w-[980px] mx-auto px-4">
          <div className="border-b border-gray-300 pb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                Bible Flashcards
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Study Tips
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Examples
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/signup" className="hover:underline">
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Bible Study Guide
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Memory Techniques
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                Community
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Share Sets
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Bible Versions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-4">
            <p>
              Copyright © 2025 Bible Flashcard Creator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
