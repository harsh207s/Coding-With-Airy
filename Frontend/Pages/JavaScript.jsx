import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import LessonCard from "../components/LessonCard";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

const jsLessons = [
  {
    id: "js-1",
    title: "Introduction to JavaScript",
    description: "Learn the language of the web",
    theory: "JavaScript is a versatile programming language that powers interactive web pages. It runs in browsers and on servers (Node.js).",
    code: `console.log("Hello, JavaScript!");`,
    output: "Hello, JavaScript!",
  },
  {
    id: "js-2",
    title: "Variables - let, const, var",
    description: "Understanding JavaScript variables",
    theory: "JavaScript has three ways to declare variables: var (old way), let (block-scoped), and const (constant, cannot be reassigned).",
    code: `let name = "Alice";\nconst age = 25;\nvar city = "New York";\n\nconsole.log(\`\${name} is \${age} years old\`);`,
    output: "Alice is 25 years old",
  },
  {
    id: "js-3",
    title: "Functions",
    description: "Create reusable code blocks",
    theory: "Functions are reusable blocks of code. JavaScript supports function declarations, expressions, and arrow functions.",
    code: `const greet = (name) => {\n    return \`Hello, \${name}!\`;\n};\n\nconsole.log(greet("World"));`,
    output: "Hello, World!",
  },
  {
    id: "js-4",
    title: "Arrays and Methods",
    description: "Working with JavaScript arrays",
    theory: "Arrays are ordered collections. JavaScript provides many built-in methods like map, filter, reduce, forEach, etc.",
    code: `const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\n\nconsole.log(doubled);`,
    output: "[2, 4, 6, 8, 10]",
  },
  {
    id: "js-5",
    title: "Objects",
    description: "Master JavaScript objects",
    theory: "Objects are collections of key-value pairs. They're fundamental to JavaScript and used everywhere.",
    code: `const person = {\n    name: "Bob",\n    age: 30,\n    greet() {\n        return \`Hi, I'm \${this.name}\`;\n    }\n};\n\nconsole.log(person.greet());`,
    output: "Hi, I'm Bob",
  },
];

export default function JavaScript() {
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
    queryKey: ['learningProgress', 'javascript', user?.email],
    queryFn: () => base44.entities.LearningProgress.filter({
      language: 'javascript',
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

  const completionPercentage = Math.round((completedLessons.size / jsLessons.length) * 100);

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
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent mb-2">
                JavaScript
              </h1>
              <p className="text-lg" style={{ color: "var(--text-muted)" }}>
                Power of the modern web
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-yellow-500">
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
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
            />
          </div>
        </motion.div>

        <div className="space-y-4">
          {jsLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              language="javascript"
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