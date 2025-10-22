import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User, Trophy, Clock, Target, TrendingUp, Award, Flame } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const [user, setUser] = useState(null);

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

  const { data: sessions = [] } = useQuery({
    queryKey: ['typingSessions', user?.email],
    queryFn: () => base44.entities.TypingSession.filter({
      user_email: user?.email
    }, '-created_date'),
    enabled: !!user?.email,
    initialData: [],
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['allProgress', user?.email],
    queryFn: () => base44.entities.LearningProgress.filter({
      user_email: user?.email
    }),
    enabled: !!user?.email,
    initialData: [],
  });

  const totalPracticeMinutes = Math.round((user?.total_practice_time || 0) / 60);
  const completedLessons = progress.filter(p => p.completed).length;
  const averageWPM = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length)
    : 0;

  const getStreakBadge = () => {
    const streak = user?.current_streak || 0;
    if (streak >= 30) return { icon: "🏆", label: "Master Coder", color: "from-yellow-500 to-orange-500" };
    if (streak >= 14) return { icon: "🔥", label: "On Fire", color: "from-red-500 to-pink-500" };
    if (streak >= 7) return { icon: "⚡", label: "Rising Star", color: "from-blue-500 to-purple-500" };
    if (streak >= 3) return { icon: "✨", label: "Getting Started", color: "from-green-500 to-emerald-500" };
    return { icon: "🌱", label: "Beginner", color: "from-gray-400 to-gray-500" };
  };

  const badge = getStreakBadge();

  return (
    <div className="min-h-screen p-6 md:p-12" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Track your progress and achievements
          </p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl mb-8 relative overflow-hidden"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-10`} />
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-4xl text-white font-bold">
              {user?.full_name?.[0]?.toUpperCase() || "U"}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
                {user?.full_name || "User"}
              </h2>
              <p className="text-lg mb-3" style={{ color: "var(--text-muted)" }}>
                {user?.email}
              </p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900">
                <span className="text-2xl">{badge.icon}</span>
                <span className="font-semibold">{badge.label}</span>
              </div>
            </div>

            {/* Streak */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="w-8 h-8 text-orange-500" />
                <span className="text-4xl font-bold" style={{ color: "var(--text)" }}>
                  {user?.current_streak || 0}
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Day Streak
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl border"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  Practice Time
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                  {totalPracticeMinutes}m
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl border"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                <Trophy className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  Lessons Completed
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                  {completedLessons}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl border"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                <Target className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  Avg. Accuracy
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                  {user?.accuracy_average || 0}%
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl border"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  Avg. WPM
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                  {averageWPM}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-xl border"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Award className="w-6 h-6 text-indigo-500" />
            Recent Typing Sessions
          </h3>

          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 rounded-lg border hover:border-indigo-500 transition-colors"
                  style={{ backgroundColor: "var(--background)" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {session.language.toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: "var(--text)" }}>
                        {session.language.toUpperCase()} - {session.difficulty}
                      </p>
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        {format(new Date(session.created_date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>WPM</p>
                      <p className="text-lg font-bold text-yellow-500">{session.wpm}</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Accuracy</p>
                      <p className="text-lg font-bold text-green-500">{session.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Time</p>
                      <p className="text-lg font-bold text-blue-500">{session.time_seconds}s</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>
              No typing sessions yet. Start practicing to see your progress!
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}