import { useState, useEffect, useContext } from "react"; 
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-icon.png"; 
import logoIcon from "../assets/logo-icon.png";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, setIsAuthenticated, setUser } = useContext(AuthContext);

  const actualUsername = user?.username || "Guest";
  const [messages, setMessages] = useState([]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved !== "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login", { replace: true });
  };

  const handleSendMessage = (value) => {
    if (!value.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: value,
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: " Processing... this is a simulated message. Connect me to the backend API to respond intelligently.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.query;
    if (!input.value.trim()) return;
    handleSendMessage(input.value.trim());
    input.value = "";
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Dark mode colors matching VS black theme
  const bgPrimary = isDarkMode ? "bg-[#121212]" : "bg-white";
  const bgSecondary = isDarkMode ? "bg-[#1e1e1e]" : "bg-slate-50";
  const bgCard = isDarkMode ? "bg-[#1e1e1e]" : "bg-white";
  const bgInput = isDarkMode ? "bg-[#1e1e1e]" : "bg-white";
  const textPrimary = isDarkMode ? "text-white" : "text-slate-900";
  const textSecondary = isDarkMode ? "text-[#c5c5c5]" : "text-slate-600";
  const borderColor = isDarkMode ? "border-[#2c2c2c]" : "border-slate-200";
  const borderColorDark = isDarkMode ? "border-[#2c2c2c]" : "border-slate-200";

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} flex flex-col transition-colors duration-300`}>
      
      {/* Top Bar */}
      <header className={`h-18 border-b ${borderColor} flex items-center justify-between px-4 md:px-6 transition-colors duration-300`}>
        <div className="flex items-center gap-2">
          <img src={logo} alt="App Logo" className="h-15 w-15 rounded-lg shadow-sm object-cover" />
          <span className="text-sm font-semibold tracking-tight">
            History.AI — Study Assistant
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`hidden sm:inline text-xs ${textSecondary}`}>{actualUsername}</span>
          <div className={`h-10 w-10 rounded-full ${isDarkMode ? "bg-[#1e1e1e]" : "bg-slate-200"} flex items-center justify-center text-[16px] font-medium`}>
            {actualUsername.charAt(0).toUpperCase()}
          </div>

          <button
            onClick={handleLogout}
            className={`hover:text-red-400 text-sm ${textSecondary} transition-colors duration-200`}
            title="Logout"
          >
            ⎋
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">

        {/* LEFT SIDEBAR */}
        <aside className={`hidden md:flex w-60 flex-col border-r ${borderColorDark} ${bgSecondary} px-3 py-4 gap-4`}>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#c5c5c5] mb-2">Navigation</p>
            <nav className="space-y-1 text-xs">
              <SidebarButton active label="Dashboard" isDark={isDarkMode} />
              <SidebarButton label="Messages" isDark={isDarkMode} />
              <SidebarButton label="Saved Notes" isDark={isDarkMode} />
              <SidebarButton label="Resources" isDark={isDarkMode} />
            </nav>

            {/* Description */}
            <p className="text-sm text-zinc-400 leading-relaxed mb-4 mt-4 px-2">
              Your <span className="text-cyan-400 font-semibold">AI-powered</span> guide to computing history. 
              Explore the legends who shaped our digital world.
            </p>

            {/* Featured Pioneers Section */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <p className="text-amber-400 font-bold text-sm mb-2 px-2 flex items-center gap-2">
                <span className="text-lg">⭐</span>
                Featured Pioneers
              </p>

              <div className="space-y-3">
                {[
                  { name: "Alan Turing", role: "Father of AI & Cryptography", icon: "🧠", color: "cyan" },
                  { name: "John von Neumann", role: "Computer Architecture", icon: "🖥️", color: "blue" },
                  { name: "Ada Lovelace", role: "First Programmer", icon: "👩‍💻", color: "purple" },
                  { name: "Nikola Tesla", role: "AC Power & Visionary", icon: "⚡", color: "amber" },
                ].map((pioneer, idx) => (
                  <div
                    key={idx}
                    className="group relative p-3 rounded-xl bg-[#1e1e1e]/70 border border-[#2c2c2c] hover:border-cyan-500/40 hover:bg-[#1e1e1e]/80 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:-translate-y-1"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: `rgba(0, 255, 255, 0.05)` }}></div>

                    <div className="relative flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl border border-gray-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" style={{ background: "linear-gradient(135deg, rgba(0,255,255,0.1), rgba(0,255,255,0.05))" }}>
                        {pioneer.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-cyan-400 text-sm mb-1 group-hover:text-cyan-300 transition-colors">
                          {pioneer.name}
                        </p>
                        <p className="text-xs text-zinc-500 leading-tight">
                          {pioneer.role}
                        </p>
                      </div>

                      {/* Arrow */}
                      <svg className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto text-[10px] text-[#c5c5c5]">
            History.AI — Your Smart Study Companion • © 2025
          </div>
        </aside>

        {/* Chat Window */}
        <section className="flex-1 flex justify-center overflow-hidden px-3 md:px-6 py-4">
          <div className="w-full max-w-3xl flex flex-col h-full gap-3">

            <div className="px-1">
              <h1 className="text-lg font-semibold">Ask anything. Learn faster.</h1>
              <p className={`text-xs md:text-sm ${textSecondary} mt-1`}>
                Generate explanations, quizzes, summaries, examples, flashcards, and more — instantly.
              </p>
            </div>

            <div className={`flex-1 rounded-2xl border ${borderColorDark} ${bgCard} flex flex-col overflow-hidden shadow-lg`}>
              
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.length === 0 && (
                  <div className={`h-full flex flex-col items-center justify-center text-center ${textSecondary} text-sm`}>
                    <p className="font-medium mb-1">Start a conversation with History.AI</p>
                    <p className="text-xs max-w-sm">Your messages will appear here.</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} user={actualUsername} isDarkMode={isDarkMode} />
                ))}
              </div>

              <div className={`border-t ${borderColorDark} px-4 py-3`}>
                <form onSubmit={handleSubmit} className="flex items-start gap-2">
                  <textarea
                    name="query"
                    rows={1}
                    placeholder="Type your question..."
                    className={`flex-1 rounded-xl border ${borderColor} ${bgInput} px-3.5 py-2.5 text-sm text-white resize-none`}
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-[#1e1e1e] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#2c2c2c] shadow-lg shadow-black/50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <aside className={`hidden lg:flex w-72 xl:w-80 flex-col border-l ${borderColorDark} ${bgSecondary} px-3 py-4 gap-4`}>
          <div className={`rounded-2xl border ${borderColor} ${bgCard} p-4 shadow-lg`}>
            <h2 className="text-sm font-semibold">Preferences</h2>
            <p className={`text-[11px] ${textSecondary} mt-1`}>Customize how History.AI assists you.</p>

            <div className="mt-3 flex items-center justify-between rounded-lg border px-3 py-2">
              <div>
                <span className="text-[11px] font-medium">Theme</span>
                <p className="text-[10px] opacity-70">{isDarkMode ? "Dark" : "Light"} mode</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative inline-flex h-5 w-9 items-center rounded-full ${isDarkMode ? "bg-[#2c2c2c]" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-4 w-4 bg-white rounded-full transform transition ${isDarkMode ? "translate-x-5" : "translate-x-1"}`} />
              </button>
            </div>

            <div className="mt-2 space-y-2 text-[11px]">
              <ToolToggle label="Short concise answers" isDark={isDarkMode} />
              <ToolToggle label="Detailed explanation mode" isDark={isDarkMode} />
              <ToolToggle label="Study format output" isDark={isDarkMode} />
            </div>
          </div>

          <div className={`rounded-2xl border ${borderColor} ${bgCard} p-4 shadow-lg`}>
            <h2 className="text-sm font-semibold">Suggested Topics</h2>
            <p className={`text-[11px] ${textSecondary} mt-1`}>Quick prompts to explore.</p>

            <ul className="mt-3 text-[11px] space-y-2">
              <li className="border border-[#2c2c2c] px-3 py-2 rounded-lg">Artificial Intelligence</li>
              <li className="border border-[#2c2c2c] px-3 py-2 rounded-lg">Data Structures</li>
              <li className="border border-[#2c2c2c] px-3 py-2 rounded-lg">Cybersecurity Fundamentals</li>
              <li className="border border-[#2c2c2c] px-3 py-2 rounded-lg">Software Engineering Basics</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}

/* SUPPORTING COMPONENTS */
function SidebarButton({ label, active, isDark }) {
  return (
    <button
      className={`w-full text-left px-3 py-1.5 rounded-md transition ${
        active
          ? isDark ? "bg-[#2c2c2c] text-white" : "bg-slate-200 text-slate-900"
          : isDark ? "text-[#c5c5c5] hover:bg-[#2c2c2c] hover:text-white" : "text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function ToolToggle({ label, isDark }) {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="flex items-center justify-between px-2">
      <span>{label}</span>
      <button
        onClick={() => setEnabled((prev) => !prev)}
        className={`h-4 w-7 rounded-full transition flex items-center ${
          enabled ? "bg-[#2c2c2c]" : isDark ? "bg-[#2c2c2c]" : "bg-gray-300"
        }`}
      >
        <span className={`h-3 w-3 bg-white rounded-full transition ${enabled ? "translate-x-3" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

function MessageBubble({ msg, user, isDarkMode }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`h-7 w-7 rounded-full ${isDarkMode ? "bg-[#2c2c2c]" : "bg-slate-200"} flex items-center justify-center text-[10px]`}>
        {isUser ? user.charAt(0).toUpperCase() : <img src={logoIcon} alt="AI Logo" className="h-6 w-6 object-cover" />}
      </div>

      <div className="flex-1">
        <p className={`text-[11px] opacity-60 mb-0.5`}>{isUser ? user : "History.AI"}</p>
        <div className={`rounded-2xl border px-3 py-2 text-sm ${isUser ? (isDarkMode ? "bg-[#1e1e1e] border-[#2c2c2c]" : "bg-slate-200 border-slate-300") : (isDarkMode ? "bg-[#1e1e1e] border-[#2c2c2c]" : "bg-slate-100 border-slate-300")}`}>
          {msg.content}
        </div>
      </div>
    </div>
  );
}
