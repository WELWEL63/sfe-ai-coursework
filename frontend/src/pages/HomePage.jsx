import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiLogOut, FiSun, FiMoon } from "react-icons/fi";

// Assets
import logoIcon from "../assets/logo-icon.png";
import turingImg from "../assets/turing.png";
import teslaImg from "../assets/tesla.png";
import vonImg from "../assets/von.png";
import adaImg from "../assets/ada.png";

// CHARACTERS DATA
const CHARACTERS = [
  { id: "turing", name: "Alan Turing", subtitle: "Father of Computing", img: turingImg, intro: "Alan sat at his desk in a small room filled with cryptic blueprints." },
  { id: "tesla", name: "Nikola Tesla", subtitle: "Master of Electricity", img: teslaImg, intro: "Tesla stood before a massive coil humming with raw power." },
  { id: "von", name: "John von Neumann", subtitle: "Machine Architect", img: vonImg, intro: "Von Neumann sat precisely, equations ordered perfectly beside him." },
  { id: "ada", name: "Ada Lovelace", subtitle: "Enchantress of Numbers", img: adaImg, intro: "Ada sketched elegant engines powered not by steam — but logic." },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, setIsAuthenticated, setUser } = useContext(AuthContext);
  const actualUsername = user?.username || "Guest";

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState(() => JSON.parse(localStorage.getItem("chatHistory")) || []);
  const [isThinking, setIsThinking] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const themeBg = isDarkMode ? "bg-[#1a1a1a] text-white" : "bg-[#fafafa] text-[#111]";
  const cardBg = isDarkMode ? "bg-[#292929]" : "bg-[#ececec]";
  const bubbleBg = isDarkMode ? "bg-[#2b2b2b] border-[#3a3a3a]" : "bg-white border-gray-300";

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login", { replace: true });
  };

  // Start New Chat & Save previous
  const startNewChat = () => {
    if (selectedCharacter && messages.length > 0) {
      const topic = messages.find(m => m.role === "user")?.content || "Conversation";
      const saved = { id: Date.now(), character: selectedCharacter, messages, topic, timestamp: new Date().toISOString() };
      const updatedHistory = [saved, ...chatHistory];
      setChatHistory(updatedHistory);
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    }
    setMessages([]);
    setSelectedCharacter(null);
  };

  // Load chat from history
  const loadChat = chat => {
    setSelectedCharacter(chat.character);
    setMessages(chat.messages);
  };

  // Send message
  const handleSendMessage = value => {
    if (!value.trim() || !selectedCharacter) return;

    const userMsg = { id: Date.now(), role: "user", content: value };
    setMessages(prev => [...prev, userMsg]);

    setIsThinking(true);
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        role: "assistant",
        content: `${selectedCharacter.name} is thinking... (AI Simulated response.)`,
      };
      setMessages(prev => [...prev, reply]);
      setIsThinking(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${themeBg}`}>

      {/* -------------------- LEFT SIDEBAR -------------------- */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#2c2c2c] flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-[#2c2c2c]">
          <img src={logoIcon} className="h-12 w-12" alt="Logo" />
          <div>
            <p className="font-bold text-lg">History.AI</p>
            <p className="text-xs text-gray-400">Powered by Group 10</p>
          </div>
        </div>

        {/* New Chat */}
        <div className="px-4 py-3">
          <button onClick={startNewChat} className="w-full py-2 rounded-full bg-[#2d2d2d] hover:bg-[#3b3b3b] text-sm">+ New Chat</button>
        </div>

        {/* Chat History */}
        <div className="px-4 flex-1 overflow-y-auto mt-4">
          <p className="text-[11px] uppercase text-gray-500 mb-2">Chat History</p>
          {chatHistory.length === 0 && <p className="text-xs text-gray-500 italic">No chats yet...</p>}

          {chatHistory.map(chat => (
            <div key={chat.id} className="flex items-center justify-between w-full mb-2 rounded-lg hover:bg-[#222]">
              <button
                onClick={() => loadChat(chat)}
                className="text-left flex-1 py-2 px-2"
              >
                <p className="text-sm font-medium">{chat.character.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{chat.topic}</p>
                <p className="text-[10px] text-gray-500">{new Date(chat.timestamp).toLocaleString()}</p>
              </button>
              <button
                onClick={() => {
                  const updatedHistory = chatHistory.filter(c => c.id !== chat.id);
                  setChatHistory(updatedHistory);
                  localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
                }}
                className="p-2 text-red-500 hover:text-red-400"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="px-4 py-3 border-t border-[#2c2c2c] flex justify-between text-xs">
          <span>{actualUsername}</span>
          <button onClick={handleLogout} className="text-xl hover:text-red-400 text-gray-500"><FiLogOut /></button>
        </div>
      </aside>

      {/* -------------------- MAIN AREA -------------------- */}
      <main className="flex-1 flex flex-col">

        {!selectedCharacter ? (
          // Welcome Screen with Logo, Text, and Character Cards
          <div className="flex flex-col items-center justify-start h-full text-center gap-6 py-8 px-4 md:px-6">

            {/* Logo on top */}
            <img src={logoIcon} className="w-28 h-28 opacity-90 mb-4" alt="Logo" />

            {/* Welcome Text */}
            <h1 className="text-3xl font-bold">Welcome, {actualUsername}! 👋</h1>
            <p className="text-gray-400 max-w-md mb-6">Select a historical figure below to start chatting and explore their world.</p>

            {/* Character Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {CHARACTERS.map(char => (
                <div
                  key={char.id}
                  className={`flex flex-col items-center p-5 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 ${cardBg} border border-gray-700`}
                  style={{ background: isDarkMode ? 'linear-gradient(145deg, #292929, #1f1f1f)' : 'linear-gradient(145deg, #ececec, #dcdcdc)' }}
                >
                  <img
                    src={char.img}
                    className="h-28 w-28 rounded-full border-4 border-purple-500 shadow-lg mb-4"
                  />
                  <p className="text-xl font-semibold mb-1">{char.name}</p>
                  <p className="text-sm text-gray-400 mb-2">{char.subtitle}</p>
                  <p className="text-sm text-gray-500 mb-4">{char.intro}</p>
                  <button
                    onClick={() => { setSelectedCharacter(char); setMessages([]); }}
                    className={`py-2 px-5 rounded-full ${isDarkMode ? 'bg-[#2d2d2d] hover:bg-[#3a3a3a]' : 'bg-[#444] hover:bg-[#555]'} text-white font-medium transition-all duration-200`}
                  >
                    Chat Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Character Info */}
            <div className="flex items-center gap-4 mb-4 px-6 py-4 border-b border-[#2c2c2c]">
              <img src={selectedCharacter.img} className="h-20 w-20 rounded-full border-2 border-gray-400" />
              <div>
                <p className="text-lg font-semibold">{selectedCharacter.name}</p>
                <p className="text-sm text-gray-400">{selectedCharacter.subtitle}</p>
                <p className="text-sm mt-1 text-gray-500">{selectedCharacter.intro}</p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 px-6 py-4 overflow-y-auto">
              {messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} bubbleBg={bubbleBg} user={actualUsername} character={selectedCharacter} />
              ))}

              {/* Thinking */}
              {isThinking && (
                <div className="flex items-center gap-2 text-sm text-gray-400 italic mt-2">
                  <span>💭</span>
                  <span>{selectedCharacter.name} is thinking... (AI Simulated response.)</span>
                  <div className="flex gap-1 ml-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={e => { e.preventDefault(); handleSendMessage(e.target.query.value); e.target.query.value = ""; }} className="border-t border-[#2c2c2c] px-6 py-3">
              <div className={`max-w-3xl mx-auto flex items-center gap-2 ${cardBg} px-4 py-2 rounded-full`}>
                <input name="query" placeholder={`Ask ${selectedCharacter.name}...`} className="bg-transparent flex-1 outline-none text-sm" />
                <button className="h-8 w-8 rounded-full bg-[#2d2d2d] hover:bg-[#3a3a3a] flex items-center justify-center">▶</button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

// Message Bubble
function MessageBubble({ msg, user, character, bubbleBg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-2 mb-4 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && <img src={character.img} className="h-7 w-7 rounded-full" />}
      <div className="max-w-[70%]">
        <p className="text-[11px] text-gray-400 mb-1">{isUser ? user : character.name}</p>
        <div className={`px-3 py-2 border rounded-2xl text-sm ${bubbleBg}`}>{msg.content}</div>
      </div>
    </div>
  );
}
