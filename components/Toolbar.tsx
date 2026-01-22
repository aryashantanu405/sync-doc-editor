"use client";

import { useEffect, useState } from "react";
import { applyFormat } from "@/utils/editorHelpers";
import {
  Link,
  FilePlus,
  Code2,
  Type,
  Save,
  Check,
  Undo2,
  Redo2,
} from "lucide-react";

export default function Toolbar({
  textareaRef,
  dispatch,
  activeSection,
  activeDocPath,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = true,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  dispatch?: any;
  activeSection?: number;
  activeDocPath?: number[];
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}) {
  const [saved, setSaved] = useState(false);

  const btn =
    "flex items-center justify-center w-9 h-9 rounded-md border border-slate-200 bg-white " +
    "text-slate-600 hover:bg-slate-100 hover:border-slate-300 active:scale-95 transition shadow-sm";

  const disabledBtn =
    "flex items-center justify-center w-9 h-9 rounded-md border border-slate-100 bg-slate-50 " +
    "text-slate-300 cursor-not-allowed";

  const safe = (fn: (ta: HTMLTextAreaElement) => void) => {
    const ta = textareaRef.current;
    if (!ta) return;
    fn(ta);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ta = textareaRef.current;
      const mod = e.ctrlKey || e.metaKey;

      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        onUndo?.();
        return;
      }

      if (
        (mod && e.shiftKey && e.key.toLowerCase() === "z") ||
        (mod && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault();
        onRedo?.();
        return;
      }

      if (!ta || !mod) return;

      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          applyFormat(ta, "**");
          break;

        case "i":
          e.preventDefault();
          applyFormat(ta, "*");
          break;

        case "u":
          e.preventDefault();
          applyFormat(ta, "<u>", "</u>");
          break;

        case "1":
          e.preventDefault();
          applyFormat(ta, "\n# ", "");
          break;

        case "2":
          e.preventDefault();
          applyFormat(ta, "\n## ", "");
          break;

        case "3":
          e.preventDefault();
          applyFormat(ta, "\n### ", "");
          break;

        case "0":
          e.preventDefault();
          applyFormat(ta, "\n", "");
          break;

        case "k":
          e.preventDefault();
          applyFormat(ta, "[", "](https://)");
          break;

        case "s":
          e.preventDefault();
          handleSave();
          break;
      }

      if (mod && e.shiftKey && e.key === "Enter" && dispatch) {
        e.preventDefault();
        dispatch({
          type: "ADD_CODEGROUP",
          payload: { sectionIndex: activeSection, docPath: activeDocPath },
        });
      }

      if (mod && e.key === "Enter" && dispatch) {
        e.preventDefault();
        dispatch({
          type: "ADD_MARKDOWN_BLOCK",
          payload: { sectionIndex: activeSection, docPath: activeDocPath },
        });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [textareaRef, dispatch, activeSection, activeDocPath]);

  return (
    <div className="h-12 flex items-center px-3 bg-white border-b shadow-sm">
      <div className="flex items-center gap-2 flex-wrap">

        <button
          className={canUndo ? btn : disabledBtn}
          title="Undo (Ctrl+Z)"
          onClick={canUndo ? onUndo : undefined}
        >
          <Undo2 size={16} />
        </button>

        <button
          className={canRedo ? btn : disabledBtn}
          title="Redo (Ctrl+Shift+Z / Ctrl+Y)"
          onClick={canRedo ? onRedo : undefined}
        >
          <Redo2 size={16} />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <button
          className={btn}
          title="Bold (Ctrl+B)"
          onClick={() => safe((ta) => applyFormat(ta, "**"))}
        >
          <b>B</b>
        </button>

        <button
          className={btn}
          title="Italic (Ctrl+I)"
          onClick={() => safe((ta) => applyFormat(ta, "*"))}
        >
          <i>I</i>
        </button>

        <button
          className={btn}
          title="Underline (Ctrl+U)"
          onClick={() => safe((ta) => applyFormat(ta, "<u>", "</u>"))}
        >
          U
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <button
          className={btn}
          title="H1 (Ctrl+1)"
          onClick={() => safe((ta) => applyFormat(ta, "\n# ", ""))}
        >
          H1
        </button>

        <button
          className={btn}
          title="H2 (Ctrl+2)"
          onClick={() => safe((ta) => applyFormat(ta, "\n## ", ""))}
        >
          H2
        </button>

        <button
          className={btn}
          title="H3 (Ctrl+3)"
          onClick={() => safe((ta) => applyFormat(ta, "\n### ", ""))}
        >
          H3
        </button>

        <button
          className={btn}
          title="Paragraph (Ctrl+0)"
          onClick={() => safe((ta) => applyFormat(ta, "\n", ""))}
        >
          <Type size={16} />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <button
          className={btn}
          title="Insert Link (Ctrl+K)"
          onClick={() => safe((ta) => applyFormat(ta, "[", "](https://)"))}
        >
          <Link size={16} />
        </button>

        {dispatch && (
          <>
            <div className="w-px h-6 bg-slate-200 mx-2" />

            <button
              title="Add Text Block (Ctrl+Enter)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition"
              onClick={() =>
                dispatch({
                  type: "ADD_MARKDOWN_BLOCK",
                  payload: {
                    sectionIndex: activeSection,
                    docPath: activeDocPath,
                  },
                })
              }
            >
              <FilePlus size={14} />
              Text
            </button>

            <button
              title="Add Code Block (Ctrl+Shift+Enter)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-medium transition"
              onClick={() =>
                dispatch({
                  type: "ADD_CODEGROUP",
                  payload: {
                    sectionIndex: activeSection,
                    docPath: activeDocPath,
                  },
                })
              }
            >
              <Code2 size={14} />
              Code
            </button>
          </>
        )}
      </div>

      <div className="ml-auto">
        <button
          onClick={handleSave}
          title="Save (Ctrl+S)"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
        >
          {saved ? (
            <>
              <Check size={16} />
              Saved
            </>
          ) : (
            <>
              <Save size={16} />
              Save
            </>
          )}
        </button>
      </div>
    </div>
  );
}
