import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import LessonCard from "../components/LessonCard";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

const javaLessons = [
  {
    id: "java-1",
    title: "Introduction to Java",
    description: "Learn Java programming basics",
    theory: "Java is a robust, object-oriented programming language. It follows the principle of 'Write Once, Run Anywhere' (WORA).",
    code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}`,
    output: "Hello, Java!",
  },
  {
    id: "java-2",
    title: "Variables and Data Types",
    description: "Understanding Java data types",
    theory: "Java is strongly typed. Common data types include int, double, boolean, char, and String (object type).",
    code: `public class Main {\n    public static void main(String[] args) {\n        int age = 25;\n        double salary = 50000.50;\n        String name = "John";\n        \n        System.out.println(name + " is " + age);\n    }\n}`,
    output: "John is 25",
  },
  {
    id: "java-3",
    title: "Classes and Objects",
    description: "Master OOP in Java",
    theory: "Everything in Java is an object. Classes are templates for creating objects with properties and methods.",
    code: `class Car {\n    String brand;\n    int year;\n    \n    void displayInfo() {\n        System.out.println(brand + " - " + year);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Car myCar = new Car();\n        myCar.brand = "Toyota";\n        myCar.year = 2020;\n        myCar.displayInfo();\n    }\n}`,
    output: "Toyota - 2020",
  },
];

export default function Java() {
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
    queryKey: ['learningProgress', 'java', user?.email],
    queryFn: () => base44.entities.LearningProgress.filter({
      language: 'java',
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

  const completionPercentage = Math.round((completedLessons.size / javaLessons.length) * 100);

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
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                Java Programming
              </h1>
              <p className="text-lg" style={{ color: "var(--text-muted)" }}>
                Enterprise-grade applications ☕
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-orange-500">
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
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
            />
          </div>
        </motion.div>

        <div className="space-y-4">
          {javaLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              language="java"
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