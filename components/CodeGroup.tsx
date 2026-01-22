"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type Block = {
  language: string;
  code: string;
};

export default function CodeGroup({ blocks }: { blocks: Block[] }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const code = blocks[active]?.code || "";
  const lines = code.split("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="my-6 rounded-2xl border border-slate-800 overflow-hidden bg-[#0b0f14] shadow-lg">
      {/* Header / Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 bg-[#161b22] border-b border-slate-700">
        {blocks.map((b, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-all
              ${
                i === active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
          >
            {b.language}
            {i === active && (
              <span className="absolute inset-x-1 -bottom-0.5 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
        ))}

        <div className="flex-1" />

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="
            flex items-center gap-1.5
            text-xs px-2.5 py-1 rounded-md
            transition-all
            bg-slate-800 hover:bg-slate-700
            text-slate-300 hover:text-white
          "
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="relative overflow-x-auto">
        <pre className="grid grid-cols-[auto_1fr] text-sm leading-relaxed font-mono">
          {/* Line Numbers */}
          <code className="select-none text-right pr-4 pl-4 py-4 text-slate-500 bg-[#0e141b] border-r border-slate-800">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </code>

          {/* Code */}
          <code className="py-4 pr-6 pl-4 text-slate-200 whitespace-pre">
            {lines.map((line, i) => (
              <div key={i}>{line || " "}</div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
