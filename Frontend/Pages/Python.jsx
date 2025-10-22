import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import LessonCard from "../components/LessonCard";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

const pythonLessons = [
  {
    id: "python-1",
    title: "Introduction to Python",
    description: "Get started with Python programming",
    theory: "Python is a high-level, interpreted programming language known for its simplicity and readability. It's perfect for beginners and powerful for experts.",
    code: `print("Hello, Python!")`,
    output: "Hello, Python!",
  },
  {
    id: "python-2",
    title: "Variables and Data Types",
    description: "Learn about Python variables",
    theory: "Python has dynamic typing - you don't need to declare variable types. Common types include int, float, str, bool, list, dict, and tuple.",
    code: `name = "Alice"\nage = 25\nheight = 5.6\nis_student = True\n\nprint(f"{name} is {age} years old")`,
    output: "Alice is 25 years old",
  },
  {
    id: "python-3",
    title: "Lists and Loops",
    description: "Working with lists and iteration",
    theory: "Lists are ordered, mutable collections. For loops allow you to iterate through sequences easily.",
    code: `fruits = ["apple", "banana", "cherry"]\n\nfor fruit in fruits:\n    print(fruit)`,
    output: "apple\nbanana\ncherry",
  },
  {
    id: "python-4",
    title: "Functions",
    description: "Create reusable code with functions",
    theory: "Functions in Python are defined using the 'def' keyword. They can take parameters and return values.",
    code: `def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))`,
    output: "Hello, World!",
  },
  {
    id: "python-5",
    title: "Dictionaries",
    description: "Master Python dictionaries",
    theory: "Dictionaries store key-value pairs. They're unordered, mutable, and very efficient for lookups.",
    code: `person = {\n    "name": "Bob",\n    "age": 30,\n    "city": "New York"\n}\n\nprint(person["name"])\nprint(person.get("age"))`,
    output: "Bob\n30",
  },
];

export default function Python() {
  const [user, setUser] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const { data: progress = [] } = useQuery({
    queryKey: ['learningProgress', 'python', user?.email],
    queryFn: () => base44.entities.LearningProgress.filter({
      language: 'python',
      user_email: user?.email
    }),
    enabled: !!user?.email,
    initialData: [],
  });

  useEffect(() => {
    const completed = new Set(progress.filter(p => p.completed).map(p => p.lesson_id));
    setCompletedLessons(completed);
  }, [progress]);

  const handleToggleComplete = (lessonId) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const completionPercentage = Math.round((completedLessons.size / pythonLessons.length) * 100);

  return (
    <div className="min-h-screen p-6 md:p-12" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
                Python Programming
              </h1>
              <p className="text-lg" style={{ color: "var(--text-muted)" }}>
                Versatile and beginner-friendly 🐍
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-green-500">
                <Award className="w-8 h-8" />
                {completionPercentage}%
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Completed</p>
            </div>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
            />
          </div>
        </motion.div>

        <div className="space-y-4">
          {pythonLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              language="python"
              userEmail={user?.email}
              completed={completedLessons.has(lesson.id)}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}