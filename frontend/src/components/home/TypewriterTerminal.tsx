"use client";

import { useState, useEffect } from "react";

interface TerminalLine {
  type: "command" | "output" | "success" | "input";
  text: string;
}

const terminalLines: TerminalLine[] = [
  { type: "command", text: 'git clone https://github.com/alex/awesome-project' },
  { type: "output", text: "Cloning into 'awesome-project'..." },
  { type: "output", text: "Receiving objects: 100% (128/128), done." },
  { type: "success", text: "✓ Repository cloned successfully" },
  { type: "command", text: "npm install && npm run dev" },
  { type: "output", text: "Installing dependencies..." },
  { type: "success", text: "✓ Server running at http://localhost:3000" },
  { type: "input", text: "Ready to build something amazing? " },
];

export default function TypewriterTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (visibleLines < terminalLines.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-xl shadow-2xl border border-stone-800/50 bg-[#1e1e1e] font-mono text-sm leading-relaxed">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252525] border-b border-stone-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="text-stone-400 text-xs">alex@dev-machine: ~/projects</div>
        <div className="w-8"></div>
      </div>

      {/* Terminal Body */}
      <div className="p-6 space-y-3 min-h-[320px] text-stone-300">
        {terminalLines.slice(0, visibleLines).map((line, index) => (
          <div key={index} className="flex flex-col animate-fadeIn">
            {line.type === "command" && (
              <div className="flex items-center text-stone-100">
                <span className="text-[#d97757] mr-2">❯</span>
                <span>{line.text}</span>
              </div>
            )}
            {line.type === "output" && (
              <div className="text-stone-400 ml-4">{line.text}</div>
            )}
            {line.type === "success" && (
              <div className="text-green-400 ml-4 font-semibold">{line.text}</div>
            )}
            {line.type === "input" && (
              <div className="flex items-center ml-4 text-stone-100 mt-2">
                <span className="text-blue-400 mr-2">?</span>
                {line.text}
                <span className="w-2 h-4 bg-stone-400 animate-pulse ml-1"></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
