"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import CodeGroup from "./CodeGroup";
import { ContentBlock } from "@/types/sync";

export default function Preview({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div
      className="
        mx-auto max-w-3xl px-6 py-6
        prose prose-slate 

        prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4
        prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3
        prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-2

        prose-p:leading-relaxed prose-p:text-slate-700

        prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800

        prose-pre:p-0 prose-pre:bg-transparent
      "
    >
      {blocks.map((block, i) => {
        if (block.type === "markdown") {
          return (
            <ReactMarkdown
              key={i}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {block.value || ""}
            </ReactMarkdown>
          );
        }

        if (block.type === "codegroup") {
          return <CodeGroup key={i} blocks={block.blocks} />;
        }

        return null;
      })}
    </div>
  );
}
