import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, RotateCcw, Trophy, Timer, Target } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const codeSnippets = {
  c: {
    easy: `#include <stdio.h>\nint main() {\n    printf("Hello");\n    return 0;\n}`,
    medium: `for (int i = 0; i < 10; i++) {\n    if (i % 2 == 0) {\n        printf("%d ", i);\n    }\n}`,
    hard: `int fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n-1) + fibonacci(n-2);\n}`,
  },
  cpp: {
    easy: `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello";\n    return 0;\n}`,
    medium: `vector<int> nums = {1, 2, 3, 4, 5};\nfor (int num : nums) {\n    cout << num << " ";\n}`,
    hard: `class Node {\npublic:\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};`,
  },
  python: {
    easy: `print("Hello, World!")\nname = "Python"\nprint(f"I love {name}")`,
    medium: `def factorial(n):\n    return 1 if n <= 1 else n * factorial(n-1)\n\nprint(factorial(5))`,
    hard: `class LinkedList:\n    def __init__(self):\n        self.head = None\n    \n    def append(self, data):\n        new_node = Node(data)\n        if not self.head:\n            self.head = new_node\n            return\n        current = self.head\n        while current.next:\n            current = current.next\n        current.next = new_node`,
  },
  java: {
    easy: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}`,
    medium: `int[] numbers = {1, 2, 3, 4, 5};\nfor (int num : numbers) {\n    System.out.print(num + " ");\n}`,
    hard: `public class BinarySearch {\n    public int search(int[] arr, int target) {\n        int left = 0, right = arr.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (arr[mid] == target) return mid;\n            else if (arr[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n}`,
  },
  javascript: {
    easy: `console.log("Hello, JavaScript!");\nconst name = "JS";\nconsole.log(\`I love \${name}\`);`,
    medium: `const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled);`,
    hard: `class LinkedList {\n    constructor() {\n        this.head = null;\n    }\n    \n    append(data) {\n        const newNode = { data, next: null };\n        if (!this.head) {\n            this.head = newNode;\n            return;\n        }\n        let current = this.head;\n        while (current.next) {\n            current = current.next;\n        }\n        current.next = newNode;\n    }\n}`,
  },
};

export default function TypingPractice() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("python");
  const [difficulty, setDifficulty] = useState("easy");
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0 });

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

  useEffect(() => {
    setTargetText(codeSnippets[language][difficulty]);
    setUserInput("");
    setIsComplete(false);
  }, [language, difficulty]);

  useEffect(() => {
    let interval = null;
    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime, isComplete]);

  const calculateAccuracy = () => {
    if (!userInput) return 0;
    const correctChars = userInput.split('').filter((char, i) => char === targetText[i]).length;
    return Math.round((correctChars / targetText.length) * 100);
  };

  const calculateWPM = () => {
    if (elapsedTime === 0) return 0;
    const words = userInput.trim().split(/\s+/).length;
    return Math.round((words / elapsedTime) * 60);
  };

  const handleStart = () => {
    setIsActive(true);
    setStartTime(Date.now());
    setUserInput("");
    setIsComplete(false);
    setElapsedTime(0);
  };

  const handleReset = () => {
    setIsActive(false);
    setStartTime(null);
    setUserInput("");
    setElapsedTime(0);
    setIsComplete(false);
    setStats({ wpm: 0, accuracy: 0 });
  };

  const handleInputChange = (e) => {
    if (!isActive) return;
    
    const value = e.target.value;
    setUserInput(value);

    if (value === targetText) {
      setIsComplete(true);
      setIsActive(false);
      
      const finalWPM = calculateWPM();
      const finalAccuracy = calculateAccuracy();
      setStats({ wpm: finalWPM, accuracy: finalAccuracy });

      saveSession(finalWPM, finalAccuracy);
    }
  };

  const saveSession = async (wpm, accuracy) => {
    if (!user) return;
    
    try {
      await base44.entities.TypingSession.create({
        user_email: user.email,
        language,
        code_snippet: targetText,
        time_seconds: elapsedTime,
        accuracy,
        wpm,
        difficulty,
      });

      const currentPracticeTime = user.total_practice_time || 0;
      const currentAccuracyAvg = user.accuracy_average || 0;
      
      await base44.auth.updateMe({
        total_practice_time: currentPracticeTime + elapsedTime,
        accuracy_average: Math.round((currentAccuracyAvg + accuracy) / 2),
        last_active: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Typing Practice
          </h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Improve your coding speed and accuracy
          </p>
        </motion.div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
              Language
            </label>
            <Select value={language} onValueChange={setLanguage} disabled={isActive}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
              Difficulty
            </label>
            <Select value={difficulty} onValueChange={setDifficulty} disabled={isActive}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button
              onClick={handleStart}
              disabled={isActive}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--surface)" }}>
            <div className="flex items-center gap-3 mb-2">
              <Timer className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Time</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: "var(--text)" }}>{elapsedTime}s</p>
          </div>

          <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--surface)" }}>
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-purple-500" />
              <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Accuracy</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: "var(--text)" }}>
              {isComplete ? stats.accuracy : calculateAccuracy()}%
            </p>
          </div>

          <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--surface)" }}>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>WPM</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: "var(--text)" }}>
              {isComplete ? stats.wpm : calculateWPM()}
            </p>
          </div>
        </div>

        {/* Code Display and Input */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Target Code */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>
              Type this code:
            </h3>
            <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--surface)" }}>
              <pre className="text-sm overflow-x-auto" style={{ color: "var(--text)" }}>
                <code>{targetText}</code>
              </pre>
            </div>
          </div>

          {/* User Input */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>
              Your typing:
            </h3>
            <Textarea
              value={userInput}
              onChange={handleInputChange}
              disabled={!isActive}
              placeholder="Click Start to begin typing..."
              className="min-h-[300px] font-mono text-sm"
              style={{ 
                backgroundColor: "var(--surface)", 
                color: "var(--text)",
                border: isComplete ? "2px solid #10b981" : undefined
              }}
            />
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center"
              >
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold text-lg">Perfect! 🎉</p>
                <p>You completed the challenge in {elapsedTime} seconds</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}