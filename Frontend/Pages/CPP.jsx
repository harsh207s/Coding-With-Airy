import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import LessonCard from "../components/LessonCard";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

const cppLessons = [
  {
    id: "cpp-1",
    title: "Introduction to C++",
    description: "Learn about C++ and its features",
    theory: "C++ is an object-oriented programming language that extends C. It supports classes, objects, inheritance, polymorphism, and more.",
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}`,
    output: "Hello, C++!",
  },
  {
    id: "cpp-2",
    title: "Classes and Objects",
    description: "Understanding OOP basics in C++",
    theory: "Classes are blueprints for creating objects. Objects are instances of classes that contain data (attributes) and functions (methods).",
    code: `#include <iostream>\nusing namespace std;\n\nclass Dog {\npublic:\n    string name;\n    void bark() {\n        cout << name << " says Woof!" << endl;\n    }\n};\n\nint main() {\n    Dog myDog;\n    myDog.name = "Buddy";\n    myDog.bark();\n    return 0;\n}`,
    output: "Buddy says Woof!",
  },
  {
    id: "cpp-3",
    title: "Constructors",
    description: "Learn about constructors in C++",
    theory: "Constructors are special methods that are automatically called when an object is created. They initialize object properties.",
    code: `#include <iostream>\nusing namespace std;\n\nclass Person {\npublic:\n    string name;\n    int age;\n    \n    Person(string n, int a) {\n        name = n;\n        age = a;\n    }\n};\n\nint main() {\n    Person person1("Alice", 25);\n    cout << person1.name << " is " << person1.age << endl;\n    return 0;\n}`,
    output: "Alice is 25",
  },
  {
    id: "cpp-4",
    title: "Inheritance",
    description: "Master inheritance in C++",
    theory: "Inheritance allows a class to inherit properties and methods from another class. It promotes code reusability.",
    code: `#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n    void eat() {\n        cout << "Eating..." << endl;\n    }\n};\n\nclass Cat : public Animal {\npublic:\n    void meow() {\n        cout << "Meow!" << endl;\n    }\n};\n\nint main() {\n    Cat myCat;\n    myCat.eat();\n    myCat.meow();\n    return 0;\n}`,
    output: "Eating...\nMeow!",
  },
];

export default function CPP() {
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
    queryKey: ['learningProgress', 'cpp', user?.email],
    queryFn: () => base44.entities.LearningProgress.filter({
      language: 'cpp',
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

  const completionPercentage = Math.round((completedLessons.size / cppLessons.length) * 100);

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
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">
                C++ Programming
              </h1>
              <p className="text-lg" style={{ color: "var(--text-muted)" }}>
                Object-oriented programming excellence
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-purple-500">
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
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
            />
          </div>
        </motion.div>

        <div className="space-y-4">
          {cppLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              language="cpp"
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