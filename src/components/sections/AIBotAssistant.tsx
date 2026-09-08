"use client";

import { useEffect, useRef, useState } from "react";
import {
  PaperPlaneRight,
  Robot,
  ArrowCounterClockwise,
  X,
  ChatCircleDots,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { prefersReducedMotion } from "@/lib/performance";

interface Message {
  sender: "bot" | "user";
  text: string;
  time: string;
}

const INITIAL_MESSAGE: Message = {
  sender: "bot",
  text: "Hi — ask me anything about our web platforms, cyber defense, or pricing.",
  time: "Now",
};

const quickQueries = [
  "Web platforms",
  "Security & ISO",
  "Growth & marketing",
  "Pricing & timelines",
];

const knowledgeBase: Record<string, string> = {
  web: "We build ultra-fast, interactive web platforms using Next.js, WebGL motion UI, and modern micro-animations with sub-second page response times.",
  security: "Our cybersecurity suite includes ISO 27001 zero-trust architecture, threat detection, end-to-end database encryption, and 24/7 SLA monitoring.",
  growth: "We run targeted Google Ads, technical SEO optimizations, and full-funnel video growth campaigns designed to double organic lead conversions.",
  pricing: "Most custom web platforms and IT builds ship within 4 to 8 weeks with complete staging, source code ownership, and 24/7 managed support.",
  default: "Thank you for asking. We deliver custom web platforms, zero-trust cybersecurity, and enterprise software. Use the contact section for a tailored proposal.",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("web") || lower.includes("app") || lower.includes("site") || lower.includes("platform")) return knowledgeBase.web;
  if (lower.includes("secur") || lower.includes("cyber") || lower.includes("iso") || lower.includes("protect")) return knowledgeBase.security;
  if (lower.includes("grow") || lower.includes("market") || lower.includes("ad") || lower.includes("seo")) return knowledgeBase.growth;
  if (lower.includes("price") || lower.includes("cost") || lower.includes("time") || lower.includes("how long") || lower.includes("timeline")) return knowledgeBase.pricing;
  return knowledgeBase.default;
}

export default function AIBotAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [usedQueries, setUsedQueries] = useState<Set<string>>(new Set());
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  }, [messages, isTyping, reduced]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;
    const newMsg: Message = {
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputVal("");
    setIsTyping(true);

    const matchedChip = quickQueries.find((q) => q === userText);
    if (matchedChip) setUsedQueries((prev) => new Set(prev).add(matchedChip));

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: getBotResponse(userText),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 500);
  };

  const handleClear = () => {
    setMessages([INITIAL_MESSAGE]);
    setUsedQueries(new Set());
    setInputVal("");
    setIsTyping(false);
  };

  const messageCount = messages.length - 1;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-expanded={open}
        data-cursor="hover"
        className={`fixed bottom-5 right-5 z-[90] inline-flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
          isDark
            ? "border-white/15 bg-black/70 text-white shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            : "border-zinc-200 bg-white/85 text-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        }`}
      >
        {open ? <X size={18} weight="bold" /> : <ChatCircleDots size={20} weight="bold" />}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white dark:ring-black" />
        )}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="AI assistant"
            className={`fixed bottom-20 right-5 z-[90] flex h-[520px] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border backdrop-blur-xl ${
              isDark
                ? "border-white/12 bg-zinc-950/95 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
                : "border-zinc-200 bg-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            }`}
          >
            <div
              className={`flex items-center justify-between border-b px-4 py-3 ${
                isDark ? "border-white/10" : "border-zinc-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    isDark ? "bg-zinc-800 text-orange-400" : "bg-zinc-100 text-orange-500"
                  }`}
                >
                  <Robot size={14} />
                </span>
                <div>
                  <p className={`text-[12px] font-medium ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Prism assistant
                  </p>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Online · 24/7
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {messageCount > 0 ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    title="New chat"
                    data-cursor="hover"
                    className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-medium transition-colors ${
                      isDark
                        ? "border-white/10 text-zinc-500 hover:text-orange-400"
                        : "border-zinc-200 text-zinc-400 hover:text-orange-500"
                    }`}
                  >
                    <ArrowCounterClockwise size={10} />
                    New
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  data-cursor="hover"
                  className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                    isDark ? "border-white/10 text-zinc-400 hover:text-white" : "border-zinc-200 text-zinc-400 hover:text-zinc-900"
                  }`}
                >
                  <X size={12} weight="bold" />
                </button>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{ scrollbarWidth: "thin", scrollbarColor: isDark ? "#3f3f46 transparent" : "#d4d4d8 transparent" }}
              role="log"
              aria-live="polite"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-end gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      msg.sender === "user"
                        ? "bg-orange-500 text-black"
                        : isDark
                        ? "bg-zinc-800 text-orange-400"
                        : "bg-zinc-100 text-orange-500"
                    }`}
                  >
                    {msg.sender === "user" ? "U" : "AI"}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-orange-500/15 border border-orange-400/30 text-zinc-900 dark:text-white rounded-br-sm"
                        : isDark
                        ? "bg-zinc-900 border border-white/10 text-zinc-200 rounded-bl-sm"
                        : "bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-bl-sm"
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}

              {isTyping ? (
                <div className="flex items-end gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      isDark ? "bg-zinc-800 text-orange-400" : "bg-zinc-100 text-orange-500"
                    }`}
                  >
                    <Robot size={12} />
                  </div>
                  <div
                    className={`rounded-2xl rounded-bl-sm border px-3 py-2 ${
                      isDark ? "bg-zinc-900 border-white/10" : "bg-zinc-50 border-zinc-200"
                    }`}
                  >
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          className="h-1.5 w-1.5 rounded-full bg-orange-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.18 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              <div ref={scrollEndRef} className="h-px" />
            </div>

            <div
              className={`flex flex-wrap gap-1.5 border-t px-3 py-2.5 ${
                isDark ? "border-white/10" : "border-zinc-100"
              }`}
            >
              {quickQueries.map((q) => {
                const isUsed = usedQueries.has(q);
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => !isUsed && handleSend(q)}
                    disabled={isUsed}
                    data-cursor="hover"
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
                      isUsed
                        ? isDark
                          ? "border-white/5 text-zinc-600 line-through opacity-50"
                          : "border-zinc-100 text-zinc-300 line-through opacity-50"
                        : isDark
                        ? "border-white/15 text-zinc-300 hover:border-orange-400/60 hover:text-white"
                        : "border-zinc-200 text-zinc-600 hover:border-orange-400/60 hover:text-zinc-900"
                    }`}
                  >
                    {q}
                  </button>
                );
              })}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputVal);
              }}
              className={`flex items-center gap-2 border-t px-3 py-2.5 ${
                isDark ? "border-white/10" : "border-zinc-100"
              }`}
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about web, security, pricing…"
                aria-label="Ask the assistant"
                className={`flex-1 rounded-full border px-3 py-1.5 text-[12px] outline-none transition-colors ${
                  isDark
                    ? "border-white/12 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-orange-400/60"
                    : "border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:border-orange-400/60"
                }`}
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                data-cursor="hover"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white transition-all hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Send"
              >
                <PaperPlaneRight size={13} weight="bold" />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
