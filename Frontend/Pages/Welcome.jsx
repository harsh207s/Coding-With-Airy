import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkWelcomeStatus = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        if (currentUser.has_seen_welcome) {
          navigate(createPageUrl("Home"));
        } else {
          setTimeout(async () => {
            await base44.auth.updateMe({ has_seen_welcome: true });
            navigate(createPageUrl("Home"));
          }, 4000);
        }
      } catch (error) {
        navigate(createPageUrl("Home"));
      }
    };

    checkWelcomeStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Top Text */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3 flex-wrap">
            <Sparkles className="w-10 h-10 md:w-12 md:h-12" />
            <span>Welcome to</span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Learn Coding With Airy
          </h2>
          <p className="text-xl md:text-2xl text-white/90">
            {user?.full_name ? `Hello, ${user.full_name}!` : "Hello!"}
          </p>
        </motion.div>

        {/* Animated Boy Waving */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-12"
        >
          <div className="relative inline-block">
            {/* Animated Circle Background */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
              }}
              className="w-48 h-48 md:w-64 md:h-64 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center"
            >
              {/* Waving Hand Animation */}
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 15, -15, 0],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="text-8xl md:text-9xl"
              >
                👋
              </motion.div>
            </motion.div>

            {/* Sparkle Effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="space-y-4"
        >
          <p className="text-xl md:text-2xl text-white font-medium">
            Let's start your coding journey!
          </p>
          
          {/* Loading Animation */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Developer Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-16"
        >
          <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <p className="text-white/90 text-sm">
              Developed by <span className="font-bold">Harsh Vardhan Singh</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}