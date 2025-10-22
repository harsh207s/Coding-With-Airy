
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, Code, Trophy, User, Moon, Sun, Menu, X,
  BookOpen, Keyboard, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const motivationalQuotes = [
  "Code is poetry written in logic.",
  "Every expert was once a beginner.",
  "Practice makes progress!",
  "The best way to learn is by doing.",
  "Keep coding, keep growing!",
  "Your only limit is your commitment."
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const navigationItems = [
    { title: "Home", url: createPageUrl("Home"), icon: Home },
    { title: "C Language", url: createPageUrl("C"), icon: Code },
    { title: "C++", url: createPageUrl("CPP"), icon: Code },
    { title: "Python", url: createPageUrl("Python"), icon: Code },
    { title: "Java", url: createPageUrl("Java"), icon: Code },
    { title: "JavaScript", url: createPageUrl("JavaScript"), icon: Code },
    { title: "Typing Practice", url: createPageUrl("TypingPractice"), icon: Keyboard },
    { title: "Profile", url: createPageUrl("Profile"), icon: User },
  ];

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (currentPageName === "Welcome") {
    return children;
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <style>{`
        :root {
          --primary: #6366f1;
          --primary-dark: #4f46e5;
          --secondary: #ec4899;
          --success: #10b981;
          --warning: #f59e0b;
          --background: #fafaf9;
          --surface: #ffffff;
          --text: #1f2937;
          --text-muted: #6b7280;
        }
        
        .dark {
          --background: #0f172a;
          --surface: #1e293b;
          --text: #f1f5f9;
          --text-muted: #94a3b8;
        }
        
        * {
          transition: background-color 0.3s ease, color 0.3s ease;
        }
      `}</style>
      
      <div className="min-h-screen flex" style={{ backgroundColor: "var(--background)", color: "var(--text)" }}>
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-72 border-r" style={{ backgroundColor: "var(--surface)", borderColor: isDarkMode ? "#334155" : "#e5e7eb" }}>
          {/* Logo */}
          <div className="p-6 border-b" style={{ borderColor: isDarkMode ? "#334155" : "#e5e7eb" }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Learn Coding With Airy</h1>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Learn. Practice. Master.</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.url
                    ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg"
                    : "hover:bg-opacity-10 hover:bg-indigo-500"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Quote & Dark Mode Toggle */}
          <div className="p-4 border-t space-y-4" style={{ borderColor: isDarkMode ? "#334155" : "#e5e7eb" }}>
            <div className="px-4 py-3 rounded-lg bg-gradient-to-br from-indigo-50 to-pink-50" style={isDarkMode ? { background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" } : {}}>
              <p className="text-sm italic" style={{ color: "var(--text)" }}>"{currentQuote}"</p>
            </div>
            
            <div className="flex items-center justify-between px-2">
              <Button variant="ghost" onClick={toggleDarkMode} className="flex items-center gap-2">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="text-sm">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full"
            >
              Logout
            </Button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t text-center" style={{ borderColor: isDarkMode ? "#334155" : "#e5e7eb" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Developed by<br />
              <span className="font-semibold">Harsh Vardhan Singh</span>
            </p>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: "var(--surface)", borderColor: isDarkMode ? "#334155" : "#e5e7eb" }}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold">Learn Coding With Airy</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="border-t p-4 space-y-2" style={{ borderColor: isDarkMode ? "#334155" : "#e5e7eb" }}>
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    location.pathname === item.url
                      ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
                      : ""
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
              <Button variant="outline" onClick={handleLogout} className="w-full mt-4">
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="lg:pt-0 pt-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
