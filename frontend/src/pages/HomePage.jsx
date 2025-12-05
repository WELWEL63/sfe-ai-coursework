import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import logoIcon from "../assets/logo-icon.png";

import turingImg from "../assets/turing.png";
import teslaImg from "../assets/tesla.png";
import vonImg from "../assets/von.png";
import adaImg from "../assets/ada.png";

import { FiLogOut, FiSun, FiMoon } from "react-icons/fi";

// CHARACTER DEFINITIONS
const CHARACTERS = [
  {
    id: "turing",
    name: "Alan Turing",
    subtitle: "Father of Computing",
    img: turingImg,
    intro:
      "Alan sat at his desk in a small corner room filled with scribbled papers.",
  },
  {
    id: "tesla",
    name: "Nikola Tesla",
    subtitle: "Master of Electricity",
    img: teslaImg,
    intro: "Tesla stood before a towering coil, sparks humming through the air.",
  },
  {
    id: "von",
    name: "John von Neumann",
    subtitle: "The Machine Architect",
    img: vonImg,
    intro:
      "Von Neumann leaned forward, stacks of equations neatly aligned on his desk.",
  },
  {
    id: "ada",
    name: "Ada Lovelace",
    subtitle: "The Enchantress of Numbers",
    img: adaImg,
    intro:
      "Ada held her notebook tightly, diagrams of impossible engines filling the pages.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, setIsAuthenticated, setUser } = useContext(AuthContext);

  const actualUsername = user?.username || "Guest";

  const [messages, setMessages] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(CHARACTERS[0]);

  // THEME (dark by default)
  const [isDarkMode, setIsDarkMode] = useState(true);

const toggleTheme = () => setIsDarkMode((prev) => !prev);

// Updated dark gray colors
const themeBg = isDarkMode ? "bg-[#1a1a1a] text-[#f5f5f5]" : "bg-[#fafafa] text-[#111]";
const cardBg = isDarkMode ? "bg-[#2c2c2c]" : "bg-[#f0f0f0]";
const bubbleBg = isDarkMode ? "bg-[#2a2a2a] border-[#3a3a3a]" : "bg-white border-[#dcdcdc]";


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
        content: `${selectedCharacter.name} is thinking... (Simulated response.)`,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.currentTarget.elements.query;
    if (!input.value.trim()) return;
    handleSendMessage(input.value.trim());
    input.value = "";
  };

  return (
    <div className={`min-h-screen flex ${themeBg}`}>
      {/* LEFT SIDEBAR */}
      <aside className={`w-64 ${themeBg} border-r border-[#1f1f1f] flex flex-col`}>
        {/* HEADER */}
<div className="px-6 py-5 flex items-center gap-4 border-b border-[#2c2c2c]">
  {/* Logo */}
  <div className="h-12 w-12 rounded-full bg-[#2c2c2c] overflow-hidden flex items-center justify-center shadow-md">
    <img src={logoIcon} alt="Logo" className="h-10 w-10 object-cover" />
  </div>

  {/* Title */}
  <div>
    <p className="text-lg font-bold text-[#f5f5f5]">History.AI</p>
    <p className="text-sm text-[#c3c3c3]">Powered by Group 10</p>
  </div>
</div>

        {/* CREATE BUTTON */}
        <div className="px-4 py-3">
          <button className="w-full flex items-center justify-center gap-2 rounded-full bg-[#2d2d2d] hover:bg-[#3a3a3a] text-xs py-2">
            + New Chat
          </button>
        </div>

        {/* CHARACTER LIST */}
        <div className="px-4 flex-1 overflow-y-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] mb-2">
            Characters - Select who you want to chat with 
          </p>

          {CHARACTERS.map((char) => (
            <button
              key={char.id}
              onClick={() => {
                setSelectedCharacter(char);
                setMessages([]);
              }}
              className={`w-full flex items-center gap-3 text-left px-2 py-2 rounded-lg 
                hover:bg-[#222] text-[13px] transition
                ${selectedCharacter.id === char.id ? "bg-[#1a1a1a]" : ""}
              `}
            >
              <div className="h-8 w-8 rounded-full bg-[#2d2d2d] overflow-hidden flex items-center justify-center">
                <img src={char.img} alt={char.name} className="h-7 w-7 object-cover" />
              </div>
              <div>
                <p className="font-medium">{char.name}</p>
                <p className="text-[10px] text-[#888]">{char.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

       {/* LOGOUT */}
<div
  className={`mt-auto px-4 py-3 flex items-center justify-between text-[11px] ${
    isDarkMode
      ? "border-t border-[#2c2c2c] text-[#c3c3c3]"
      : "border-t border-[#dcdcdc] text-[#555]"
  }`}
>
  <span>{actualUsername}</span>
  <button
    onClick={handleLogout}
    className="hover:text-red-400 text-lg"
  >
    <FiLogOut />
  </button>
</div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className={`flex-1 flex flex-col ${themeBg}`}>
        {/* TOP BAR */}
        <header className="h-14 border-b border-[#1f1f1f] flex items-center px-6 justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-[#2d2d2d] overflow-hidden flex items-center justify-center">
              <img src={selectedCharacter.img} alt="Character" className="h-8 w-8 object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold">{selectedCharacter.name}</p>
              <p className="text-[11px] text-[#a3a3a3]">{selectedCharacter.subtitle}</p>
            </div>
          </div>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="text-xl p-2 rounded-full hover:bg-[#1f1f1f]"
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>
        </header>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.length === 0 ? (
            <div className="text-sm text-[#a3a3a3] max-w-2xl">
              <p>{selectedCharacter.intro}</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  user={actualUsername}
                  character={selectedCharacter}
                  bubbleBg={bubbleBg}
                />
              ))}
            </div>
          )}
        </div>

        {/* INPUT BAR */}
        <div className="border-t border-[#1f1f1f] px-6 py-3">
          <form
            onSubmit={handleSubmit}
            className={`max-w-3xl mx-auto flex items-center gap-2 ${cardBg} rounded-full px-4 py-2`}
          >
            <input
              name="query"
              placeholder={`Message ${selectedCharacter.name}...`}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#6b6b6b]"
            />
            <button
              type="submit"
              className="h-8 w-8 rounded-full bg-[#2d2d2d] flex items-center justify-center hover:bg-[#3a3a3a]"
            >
              ▶
            </button>
          </form>
          <p className="mt-2 text-[11px] text-[#6b6b6b] text-center">
            This is A.I. and not a real person. Treat everything it says as fiction.
          </p>
        </div>
      </main>
    </div>
  );
}

// MESSAGE BUBBLE
function MessageBubble({ msg, user, character, bubbleBg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className="h-7 w-7 rounded-full bg-[#2d2d2d] overflow-hidden flex items-center justify-center text-[10px]">
        {isUser ? (
          user.charAt(0).toUpperCase()
        ) : (
          <img src={character.img} alt="AI" className="h-7 w-7 object-cover" />
        )}
      </div>

      <div className="max-w-[70%]">
        <p className="text-[11px] text-[#8a8a8a] mb-0.5">
          {isUser ? user : character.name}
        </p>

        <div className={`rounded-2xl px-3 py-2 text-sm border ${bubbleBg}`}>
          {msg.content}
        </div>
      </div>
    </div>
  );
}
