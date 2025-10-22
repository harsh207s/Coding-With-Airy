import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Code2, Zap, Target, TrendingUp } from "lucide-react";

const languages = [
  {
    name: "C",
    description: "Master the foundation of programming",
    gradient: "from-blue-500 to-cyan-500",
    icon: "C",
  },
  {
    name: "C++",
    description: "Object-oriented programming excellence",
    gradient: "from-purple-500 to-indigo-500",
    icon: "C++",
  },
  {
    name: "Python",
    description: "Versatile and beginner-friendly",
    gradient: "from-green-500 to-emerald-500",
    icon: "🐍",
  },
  {
    name: "Java",
    description: "Enterprise-grade applications",
    gradient: "from-orange-500 to-red-500",
    icon: "☕",
  },
  {
    name: "JavaScript",
    description: "Power of the modern web",
    gradient: "from-yellow-500 to-amber-500",
    icon: "JS",
  },
];

const features = [
  {
    icon: Code2,
    title: "Interactive Learning",
    description: "Learn by doing with hands-on code examples",
    color: "text-blue-500",
  },
  {
    icon: Zap,
    title: "Typing Practice",
    description: "Improve your coding speed and accuracy",
    color: "text-yellow-500",
  },
  {
    icon: Target,
    title: "Structured Lessons",
    description: "From basics to advanced topics",
    color: "text-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your learning journey",
    color: "text-green-500",
  },
];

export default function Home() {
  const navigate = useNavigate();

  const handleLanguageClick = (language) => {
    navigate(createPageUrl(language));
  };

  return (
    <div className="min-h-screen p-6 md:p-12" style={{ backgroundColor: "var(--background)" }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Choose Your Path
        </h1>
        <p className="text-xl md:text-2xl" style={{ color: "var(--text-muted)" }}>
          Select a programming language and start your coding adventure
        </p>
      </motion.div>

      {/* Language Cards */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => handleLanguageClick(lang.name)}
              className="cursor-pointer group"
            >
              <div
                className={`relative h-64 rounded-2xl bg-gradient-to-br ${lang.gradient} p-1 shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                <div
                  className="h-full rounded-xl flex flex-col items-center justify-center p-6 relative overflow-hidden"
                  style={{ backgroundColor: "var(--surface)" }}
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)", backgroundSize: "10px 10px" }} />
                  </div>

                  {/* Icon */}
                  <div className={`text-6xl font-bold mb-4 bg-gradient-to-br ${lang.gradient} bg-clip-text text-transparent`}>
                    {lang.icon}
                  </div>

                  {/* Language Name */}
                  <h3 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
                    {lang.name}
                  </h3>

                  {/* Description */}
                  <p className="text-center" style={{ color: "var(--text-muted)" }}>
                    {lang.description}
                  </p>

                  {/* Hover Arrow */}
                  <motion.div
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <span className="text-2xl">→</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: "var(--text)" }}>
          Why Choose Airy Coding?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-6 rounded-xl border"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--text-muted)" }}
            >
              <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
                {feature.title}
              </h3>
              <p style={{ color: "var(--text-muted)" }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}