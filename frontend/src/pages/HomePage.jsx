import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import logoIcon from "../assets/logo-icon.png";

import turingImg from "../assets/turing.png";
import teslaImg from "../assets/tesla.png";
import vonImg from "../assets/von.png";
import adaImg from "../assets/ada.png";

import { FiLogOut, FiSun, FiMoon } from "react-icons/fi";

// CHARACTERS
const CHARACTERS = [
  {
    id: "turing",
    name: "Alan Turing",
    subtitle: "Father of Computing",
    img: turingImg,
    intro: "Alan sat at his desk in a small room filled with cryptic blueprints.",
  },
  {
    id: "tesla",
    name: "Nikola Tesla",
    subtitle: "Master of Electricity",
    img: teslaImg,
    intro: "Tesla stood before a massive coil humming with raw power.",
  },
  {
    id: "von",
    name: "John von Neumann",
    subtitle: "Machine Architect",
    img: vonImg,
    intro: "Von Neumann sat precisely, equations ordered perfectly beside him.",
  },
  {
    id: "ada",
    name: "Ada Lovelace",
    subtitle: "Enchantress of Numbers",
    img: adaImg,
    intro: "Ada sketched elegant engines powered not by steam — but logic.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, setIsAuthenticated, setUser } = useContext(AuthContext);

  const actualUsername = user?.username || "Guest";

  const [messages, setMessages] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Theme system
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode((p) => !p);

  const themeBg = isDarkMode ? "bg-[#1a1a1a] text-[#f5f5f5]" : "bg-[#fafafa] text-[#111]";
  const cardBg = isDarkMode ? "bg-[#2c2c2c]" : "bg-[#e5e5e5]";
  const bubbleBg = isDarkMode
    ? "bg-[#2a2a2a] border-[#3a3a3a]"
    : "bg-white border-[#dcdcdc]";

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login", { replace: true });
  };

  const handleSendMessage = (value) => {
    if (!value.trim()) return;

    const userMsg = { id: Date.now(), role: "user", content: value };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        role: "assistant",
        content: `${selectedCharacter.name} is thinking... (Simulated response.)`,
      };
      setMessages((prev) => [...prev, reply]);
    }, 900);
  };

  return (
    <div className={`min-h-screen flex ${themeBg}`}>

      {/* SIDEBAR */}
      <aside className={`w-64 border-r border-[#2c2c2c] flex flex-col ${themeBg}`}>

        {/* Logo + App name */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-[#2c2c2c]">
          <img src={logoIcon} className="h-12 w-12" alt="Logo" />
          <div>
            <p className="font-bold text-lg">History.AI</p>
            <p className="text-xs text-[#bdbdbd]">Powered by Group 10</p>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-4 py-3">
          <button className="w-full py-2 rounded-full bg-[#2d2d2d] hover:bg-[#3a3a3a] text-sm">
            + New Chat
          </button>
        </div>

        {/* Character Selection */}
        <div className="px-4 flex-1 overflow-y-auto">
          <p className="text-[11px] uppercase tracking-wider text-[#6b6b6b] mb-2">
            Choose a character
          </p>

          {CHARACTERS.map((char) => (
            <button
              key={char.id}
              onClick={() => {
                setSelectedCharacter(char);
                setMessages([]);
              }}
              className={`w-full flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#222] transition ${
                selectedCharacter?.id === char.id ? "bg-[#1a1a1a]" : ""
              }`}
            >
              <img src={char.img} className="h-8 w-8 rounded-full" alt="" />
              <div>
                <p className="text-sm font-medium">{char.name}</p>
                <p className="text-[10px] text-[#9a9a9a]">{char.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="px-4 py-3 border-t border-[#2c2c2c] flex items-center justify-between text-xs text-[#c3c3c3]">
          <span>{actualUsername}</span>
          <button onClick={handleLogout} className="text-xl hover:text-red-400" style={{ color: "#6b6b6b" }}>
            <FiLogOut />
          </button>
        </div>

      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col">

        {/* If no character selected → show centered welcome */}
        {!selectedCharacter ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-6">
            <img src={logoIcon} className="w-28 h-28 opacity-90" alt="Logo" />
            <h1 className="text-2xl font-semibold">Welcome, {actualUsername}! 👋</h1>
            <p className="text-sm text-[#9d9d9d] max-w-md">
              Select a historical figure from the left to begin your journey.
            </p>
          </div>
        ) : (
          <>
            {/* Top Bar */}
            <header className="h-14 border-b border-[#2c2c2c] flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <img src={selectedCharacter.img} className="h-9 w-9 rounded-full" alt="" />
                <div>
                  <p className="font-semibold text-sm">{selectedCharacter.name}</p>
                  <p className="text-[11px] text-[#8a8a8a]">{selectedCharacter.subtitle}</p>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-[#2c2c2c] text-xl"
              >
                {isDarkMode ? <FiSun /> : <FiMoon />}
              </button>
            </header>

            {/* Chat Body */}
            <div className="flex-1 px-6 py-4 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-[#9d9d9d] text-sm max-w-xl">{selectedCharacter.intro}</p>
              ) : (
                messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    bubbleBg={bubbleBg}
                    character={selectedCharacter}
                    user={actualUsername}
                  />
                ))
              )}
            </div>

            {/* Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.query;
                handleSendMessage(input.value);
                input.value = "";
              }}
              className="border-t border-[#2c2c2c] px-6 py-3"
            >
              <div
                className={`max-w-3xl mx-auto flex items-center gap-2 ${cardBg} px-4 py-2 rounded-full`}
              >
                <input
                  name="query"
                  placeholder={`Message ${selectedCharacter.name}...`}
                  className="bg-transparent flex-1 outline-none text-sm"
                />
                <button
                  type="submit"
                  className="h-8 w-8 rounded-full bg-[#2d2d2d] hover:bg-[#3a3a3a] flex items-center justify-center"
                >
                  ▶
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

// Message UI Component
function MessageBubble({ msg, user, character, bubbleBg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-2 mb-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <img
        src={isUser ? null : character.img}
        alt=""
        className="h-7 w-7 rounded-full bg-[#2c2c2c] object-cover flex items-center justify-center"
      />
      <div className="max-w-[70%]">
        <p className="text-[11px] text-[#8a8a8a] mb-1">
          {isUser ? user : character.name}
        </p>
        <div className={`px-3 py-2 border rounded-2xl text-sm ${bubbleBg}`}>
          {msg.content}
        </div>
      </div>
    </div>
  );
}
