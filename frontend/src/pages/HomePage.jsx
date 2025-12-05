import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
        content: "This is a simulated response. Wire this to your backend API!",
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

  const bgPrimary = isDarkMode ? "bg-slate-950" : "bg-white";
  const bgSecondary = isDarkMode ? "bg-slate-950/95" : "bg-slate-50";
  const bgCard = isDarkMode ? "bg-slate-900/80" : "bg-white";
  const bgInput = isDarkMode ? "bg-slate-950/80" : "bg-white";
  const textPrimary = isDarkMode ? "text-slate-50" : "text-slate-900";
  const textSecondary = isDarkMode ? "text-slate-400" : "text-slate-600";
  const borderColor = isDarkMode ? "border-slate-800" : "border-slate-200";
  const borderColorDark = isDarkMode ? "border-slate-900" : "border-slate-200";

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} flex flex-col transition-colors duration-300`}>
      
      {/* Top bar */}
      <header className={`h-12 border-b ${borderColor} ${isDarkMode ? "bg-slate-950/90" : "bg-white/90"} backdrop-blur flex items-center justify-between px-4 md:px-6 transition-colors duration-300`}>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 flex items-center justify-center text-[10px] font-bold shadow-lg">
            HA
          </div>
          <span className="text-sm font-semibold tracking-tight">
            History.AI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`hidden sm:inline text-xs ${textSecondary}`}>
            {actualUsername}
          </span>
          <div className={`h-7 w-7 rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-200"} flex items-center justify-center text-[11px] font-medium`}>
            {actualUsername.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className={`${textSecondary} hover:text-red-400 text-sm transition-colors duration-200`}
            title="Logout"
          >
            ⎋
          </button>
        </div>
      </header>

      {/* 3 column layout */}
      <main className="flex-1 flex overflow-hidden">

        {/* LEFT SIDEBAR */}
        <aside className={`hidden md:flex w-60 flex-col border-r ${borderColorDark} ${bgSecondary} px-3 py-4 gap-4 transition-colors duration-300`}>
          <div>
            <p className={`text-[11px] uppercase tracking-[0.18em] ${isDarkMode ? "text-slate-500" : "text-slate-400"} mb-2`}>
              Workspace
            </p>
            <nav className="space-y-1 text-xs">
              <SidebarButton active label="Home" isDark={isDarkMode} />
              <SidebarButton label="Chats" isDark={isDarkMode} />
              <SidebarButton label="Timelines" isDark={isDarkMode} />
              <SidebarButton label="Library" isDark={isDarkMode} />
            </nav>
          </div>

          <div className={`mt-auto text-[10px] ${isDarkMode ? "text-slate-500" : "text-slate-400"} px-1`}>
            Tech History Explorer · © 2025
          </div>
        </aside>

        {/* CENTER CHAT */}
        <section className="flex-1 flex justify-center overflow-hidden px-3 md:px-6 py-4">
          <div className="w-full max-w-3xl flex flex-col h-full gap-3">
            
            <div className="px-1">
              <h1 className="text-lg md:text-xl font-semibold tracking-tight">
                Ask anything about the history of technology.
              </h1>
              <p className={`mt-1 text-xs md:text-sm ${textSecondary}`}>
                Compare eras, unpack complex ideas, and generate study materials in one place.
              </p>
            </div>

            <div className={`flex-1 rounded-2xl border ${borderColorDark} ${isDarkMode ? "bg-slate-950/70" : "bg-white"} flex flex-col overflow-hidden shadow-lg`}>

              <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 space-y-3">
                {messages.length === 0 && (
                  <div className={`h-full flex flex-col items-center justify-center text-center ${isDarkMode ? "text-slate-500" : "text-slate-400"} text-sm`}>
                    <p className="font-medium mb-1">
                      Start a new conversation with History.AI
                    </p>
                    <p className="text-xs max-w-sm">
                      Your questions and answers will appear here.
                    </p>
                  </div>
                )}

                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
                      <div className={`h-7 w-7 rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-200"} flex items-center justify-center text-[10px]`}>
                        {isUser ? actualUsername.charAt(0).toUpperCase() : "AI"}
                      </div>
                      <div className="flex-1">
                        <p className={`text-[11px] ${textSecondary} mb-0.5`}>
                          {isUser ? actualUsername : "History.AI"}
                        </p>
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm ${
                            isUser
                              ? isDarkMode 
                                ? "bg-slate-900 text-slate-50 border border-slate-800"
                                : "bg-slate-100 text-slate-900 border border-slate-200"
                              : isDarkMode
                              ? "bg-slate-900/80 text-slate-100 border border-sky-500/40"
                              : "bg-sky-50 text-slate-900 border border-sky-200"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INPUT */}
              <div className={`border-t ${borderColorDark} ${isDarkMode ? "bg-slate-950/90" : "bg-white/90"} px-3 md:px-4 py-3`}>
                <form onSubmit={handleSubmit} className="flex items-start gap-2">
                  
                  <div className={`hidden sm:flex h-8 w-8 rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-200"} items-center justify-center text-[11px]`}>
                    {actualUsername.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <textarea
                      name="query"
                      rows={1}
                      placeholder='Ask anything...'
                      className={`w-full resize-none rounded-xl border ${borderColor} ${bgInput} px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-sky-500`}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        {[
                          "Compare two eras",
                          "Explain like I'm a student",
                          "Create a quiz",
                          "Timeline of an invention",
                        ].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => {
                              const input = document.querySelector('textarea[name="query"]');
                              input.value = chip;
                              input.focus();
                            }}
                            className={`rounded-full border ${borderColor} px-3 py-1 hover:border-sky-500 transition-all`}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>

                      <button
                        type="submit"
                        className="rounded-full bg-sky-500 px-4 py-1.5 text-xs font-medium text-slate-950 hover:bg-sky-400 shadow-lg shadow-sky-500/25"
                      >
                        Ask
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <aside className={`hidden lg:flex w-72 xl:w-80 flex-col border-l ${borderColorDark} ${bgSecondary} px-3 py-4 gap-4`}>
          
          <div className={`rounded-2xl border ${borderColor} ${bgCard} p-4 shadow-lg`}>
            <h2 className="text-sm font-semibold">User Tools</h2>
            <p className={`text-[11px] ${textSecondary} mt-1`}>
              Personalize how History.AI looks and answers.
            </p>

            <div className={`mt-3 flex items-center justify-between rounded-lg border ${borderColor} px-3 py-2`}>
              <div>
                <span className="text-[11px] font-medium">Theme</span>
                <p className="text-[10px] opacity-70">
                  {isDarkMode ? "Dark mode" : "Light mode"}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative inline-flex h-5 w-9 items-center rounded-full ${isDarkMode ? "bg-sky-500" : "bg-slate-300"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform bg-white rounded-full transition-transform ${
                    isDarkMode ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="mt-2 space-y-2 text-[11px]">
              <ToolToggle label="Concise summary" isDark={isDarkMode} />
              <ToolToggle label="Deep dive explanation" isDark={isDarkMode} />
              <ToolToggle label="Study notes format" isDark={isDarkMode} />
            </div>
          </div>

          {/* Right card completed */}
          <div className={`rounded-2xl border ${borderColor} ${bgCard} p-4 shadow-lg`}>
            <h2 className="text-sm font-semibold">Featured pioneers</h2>
            <p className={`text-[11px] ${textSecondary} mt-1`}>
              Highlights from computing history.
            </p>

            <ul className={`mt-3 space-y-2 text-[11px]`}>
              <li className={`rounded-lg border ${borderColor} px-3 py-2`}>
                Ada Lovelace — First computer algorithm (1843)
              </li>
              <li className={`rounded-lg border ${borderColor} px-3 py-2`}>
                Alan Turing — Computational theory pioneer (1936)
              </li>
              <li className={`rounded-lg border ${borderColor} px-3 py-2`}>
                Grace Hopper — COBOL inventor & debugging pioneer
              </li>
              <li className={`rounded-lg border ${borderColor} px-3 py-2`}>
                Steve Wozniak — Apple I & II Architect (1970s)
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}



/* --- SUPPORTING COMPONENTS (Referenced in UI) --- */

function SidebarButton({ label, active, isDark }) {
  return (
    <button
      className={`w-full text-left px-3 py-1.5 rounded-md transition-all ${
        active
          ? isDark
            ? "bg-sky-600 text-white"
            : "bg-sky-200 text-sky-900"
          : isDark
          ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
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
        className={`h-4 w-7 rounded-full flex items-center transition-all ${
          enabled ? "bg-sky-500" : isDark ? "bg-slate-700" : "bg-slate-300"
        }`}
      >
        <span
          className={`h-3 w-3 bg-white rounded-full transition-all ${
            enabled ? "translate-x-3" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
