import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, ChevronDown, ChevronUp, Code, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function LessonCard({ lesson, language, userEmail, completed, onToggleComplete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleComplete = async () => {
    try {
      if (completed) {
        return;
      }
      
      await base44.entities.LearningProgress.create({
        language,
        lesson_id: lesson.id,
        completed: true,
        user_email: userEmail,
      });
      
      onToggleComplete(lesson.id);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--text-muted)" }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              {completed ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
                {lesson.title}
              </h3>
              <p style={{ color: "var(--text-muted)" }}>{lesson.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Theory */}
            {lesson.theory && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-semibold" style={{ color: "var(--text)" }}>Theory</h4>
                </div>
                <p style={{ color: "var(--text-muted)" }}>{lesson.theory}</p>
              </div>
            )}

            {/* Code Example */}
            {lesson.code && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold" style={{ color: "var(--text)" }}>Code Example</h4>
                </div>
                <pre className="p-4 rounded-lg overflow-x-auto text-sm" style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
                  <code>{lesson.code}</code>
                </pre>
              </div>
            )}

            {/* Output */}
            {lesson.output && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
                <h4 className="font-semibold mb-2" style={{ color: "var(--text)" }}>Output:</h4>
                <pre className="p-4 rounded-lg text-sm" style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
                  <code>{lesson.output}</code>
                </pre>
              </div>
            )}

            {/* Mark Complete Button */}
            {!completed && (
              <Button
                onClick={handleToggleComplete}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}