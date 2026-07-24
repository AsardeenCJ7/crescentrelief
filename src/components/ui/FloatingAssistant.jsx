import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  "Where should I donate today?",
  "Calculate my Zakat",
  "Emergency appeals",
  "Volunteer opportunities",
];

const FloatingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! 👋 I'm your Crescent Relief assistant. How can I help you make an impact today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text },
      { from: "bot", text: `Thank you for your message about "${text}". Our team will help you find the best way to contribute!` },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-5 md:bottom-8 md:right-8 w-14 h-14 bg-gradient-to-br from-primary to-secondary text-white rounded-full shadow-2xl flex items-center justify-center z-50 group"
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="material-symbols-outlined">close</motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="material-symbols-outlined">smart_toy</motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-44 right-5 md:bottom-28 md:right-8 w-[calc(100vw-40px)] max-w-sm bg-white rounded-3xl shadow-2xl border border-border-light overflow-hidden z-50 flex flex-col"
            style={{ maxHeight: "480px" }}
          >
            {/* Header */}
            <div className="bg-gradient-hero p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[20px]">smart_toy</span>
              </div>
              <div>
                <p className="font-heading font-bold text-white text-sm">Crescent AI</p>
                <p className="text-xs text-white/70">Always here to help</p>
              </div>
              <div className="ml-auto w-2 h-2 bg-green-300 rounded-full animate-pulse-slow" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === "user"
                      ? "bg-primary text-white rounded-tr-sm"
                      : "bg-neutral-100 text-neutral-800 rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="flex-shrink-0 text-xs font-medium text-primary bg-primary-50 border border-primary/15 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border-light flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask me anything..."
                className="flex-1 text-sm px-4 py-2.5 rounded-full border border-border-light bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={() => sendMessage(input)}
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAssistant;
