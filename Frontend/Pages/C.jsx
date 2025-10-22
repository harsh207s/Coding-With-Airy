import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import LessonCard from "../components/LessonCard";
import { motion } from "framer-motion";
import { BookOpen, Award } from "lucide-react";

const cLessons = [
  {
    id: "c-1",
    title: "Introduction to C",
    description: "Learn about C programming language basics",
    theory: "C is a general-purpose programming language created by Dennis Ritchie in 1972. It's powerful, efficient, and forms the foundation of many modern programming languages.",
    code: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
    output: "Hello, World!",
  },
  {
    id: "c-2",
    title: "Variables and Data Types",
    description: "Understanding variables and basic data types in C",
    theory: "Variables are containers for storing data values. C has several basic data types: int (integers), float (decimal numbers), char (characters), and double (large decimal numbers).",
    code: `#include <stdio.h>\n\nint main() {\n    int age = 25;\n    float height = 5.9;\n    char grade = 'A';\n    \n    printf("Age: %d\\n", age);\n    printf("Height: %.1f\\n", height);\n    printf("Grade: %c\\n", grade);\n    \n    return 0;\n}`,
    output: "Age: 25\nHeight: 5.9\nGrade: A",
  },
  {
    id: "c-3",
    title: "If-Else Statements",
    description: "Learn conditional statements",
    theory: "If-else statements allow you to execute different code based on conditions. They help make decisions in your programs.",
    code: `#include <stdio.h>\n\nint main() {\n    int number = 10;\n    \n    if (number > 0) {\n        printf("Positive number\\n");\n    } else if (number < 0) {\n        printf("Negative number\\n");\n    } else {\n        printf("Zero\\n");\n    }\n    \n    return 0;\n}`,
    output: "Positive number",
  },
  {
    id: "c-4",
    title: "Loops - For Loop",
    description: "Master iteration with for loops",
    theory: "For loops allow you to repeat code a specific number of times. They consist of initialization, condition, and increment/decrement.",
    code: `#include <stdio.h>\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        printf("%d ", i);\n    }\n    printf("\\n");\n    return 0;\n}`,
    output: "1 2 3 4 5",
  },
  {
    id: "c-5",
    title: "Arrays",
    description: "Working with arrays in C",
    theory: "Arrays are collections of elements of the same data type stored in contiguous memory locations. They allow you to store multiple values in a single variable.",
    code: `#include <stdio.h>\n\nint main() {\n    int numbers[5] = {10, 20, 30, 40, 50};\n    \n    for (int i = 0; i < 5; i++) {\n        printf("%d ", numbers[i]);\n    }\n    printf("\\n");\n    \n    return 0;\n}`,
    output: "10 20 30 40 50",
  },
  {
    id: "c-6",
    title: "Functions",
    description: "Create reusable code with functions",
    theory: "Functions are blocks of code that perform specific tasks. They help organize code, make it reusable, and easier to maintain.",
    code: `#include <stdio.h>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int result = add(5, 3);\n    printf("Sum: %d\\n", result);\n    return 0;\n}`,
    output: "Sum: 8",
  },
];

export default function C() {
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
    queryKey: ['learningProgress', 'c', user?.email],
    queryFn: () => base44.entities.LearningProgress.filter({
      language: 'c',
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

  const completionPercentage = Math.round((completedLessons.size / cLessons.length) * 100);

  return (
    <div className="min-h-screen p-6 md:p-12" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                C Programming
              </h1>
              <p className="text-lg" style={{ color: "var(--text-muted)" }}>
                Master the foundation of programming
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-blue-500">
                <Award className="w-8 h-8" />
                {completionPercentage}%
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Completed</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
            />
          </div>
        </motion.div>

        {/* Lessons */}
        <div className="space-y-4">
          {cLessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              language="c"
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