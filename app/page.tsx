"use client";

import { useEffect, useReducer, useState, useRef } from "react";
import { docReducer, initialState } from "@/store/docReducer";
import { initialData } from "@/data/initialData";
import Preview from "@/components/Preview";
import Sidebar from "@/components/Sidebar";
import Toolbar from "@/components/Toolbar";
import { Trash2 } from "lucide-react";


function getActiveDoc(state: any) {
  const section = state.data.sections[state.activeSection];
  if (!section) return null;

  let docs = section.docs;
  let doc = null;

  for (const index of state.activeDocPath) {
    doc = docs[index];
    if (!doc) return null;
    docs = doc.children ?? [];
  }

  return doc;
}


export default function Home() {

  

  const [state, baseDispatch] = useReducer(docReducer, initialState);

  const undoStack = useRef<any[]>([]);
  const redoStack = useRef<any[]>([]);

  const dispatch = (action: any) => {
    undoStack.current.push(structuredClone(state.data));
    redoStack.current = [];
    baseDispatch(action);
  };

  const undo = () => {
    if (!undoStack.current.length) return;

    const prev = undoStack.current.pop();
    redoStack.current.push(structuredClone(state.data));

    baseDispatch({ type: "SET_DATA", payload: prev });
  };

  const redo = () => {
    if (!redoStack.current.length) return;

    const next = redoStack.current.pop();
    undoStack.current.push(structuredClone(state.data));

    baseDispatch({ type: "SET_DATA", payload: next });
  };

 

  const [activeTextarea, setActiveTextarea] =
    useState<HTMLTextAreaElement | null>(null);

  

  useEffect(() => {
    dispatch({ type: "SET_DATA", payload: initialData });
  }, []);

  

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;

      if (!mod) return;

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state]);

  

  const activeDoc = getActiveDoc(state);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };


  return (
    <main className="h-screen flex flex-col bg-gray-100">

      <Toolbar
  textareaRef={{ current: activeTextarea }}
  dispatch={dispatch}
  activeSection={state.activeSection}
  activeDocPath={state.activeDocPath}
  onUndo={undo}
  onRedo={redo}
  canUndo={undoStack.current.length > 0}
  canRedo={redoStack.current.length > 0}
/>


      <div className="flex flex-1 overflow-hidden">

        <div className="w-64 bg-white border-r">
          <Sidebar
            sections={state.data.sections}
            activeSection={state.activeSection}
            activeDocPath={state.activeDocPath}
            onSelectDoc={(s, path) =>
              dispatch({
                type: "SET_ACTIVE_DOC",
                payload: { sectionIndex: s, docPath: path },
              })
            }
            onAddSection={() => dispatch({ type: "ADD_SECTION" })}
            onRemoveSection={(s) =>
  dispatch({
    type: "REMOVE_SECTION",
    payload: { sectionIndex: s },
  })
}

            onRenameSection={(s, title) =>
              dispatch({
                type: "RENAME_SECTION",
                payload: { sectionIndex: s, title },
              })
            }
            onAddDoc={(s, path) =>
              dispatch({
                type: "ADD_DOC",
                payload: { sectionIndex: s, parentPath: path },
              })
            }
            onRemoveDoc={(s, path) =>
              dispatch({
                type: "REMOVE_DOC",
                payload: { sectionIndex: s, docPath: path },
              })
            }
            onRenameDoc={(s: any, path: any, title: any) =>
              dispatch({
                type: "RENAME_DOC",
                payload: { sectionIndex: s, docPath: path, title },
              })
            }
          />
        </div>

        
        <div className="w-1/2 p-4 overflow-auto bg-gray-50 border-r">
          {activeDoc?.content.map((block: any, i: number) => {
            if (block.type === "markdown") {
              return (
                <div key={i} className="relative mb-4 group">

                  
                  <button
                    className="
                      absolute right-2 top-2
                      p-1 rounded-md
                      text-gray-400 hover:text-red-500
                      hover:bg-red-50
                      opacity-0 group-hover:opacity-100
                      transition
                    "
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_BLOCK",
                        payload: {
                          sectionIndex: state.activeSection,
                          docPath: state.activeDocPath,
                          blockIndex: i,
                        },
                      })
                    }
                  >
                    <Trash2 size={16} />
                  </button>

                  <textarea
                    className="w-full bg-white border border-gray-200 rounded-lg p-4 resize-none outline-none focus:ring-2 focus:ring-blue-200 transition text-gray-800"
                    value={block.value}
                    onFocus={(e) => setActiveTextarea(e.target)}
                    onChange={(e) => {
                      autoResize(e.target);
                      dispatch({
                        type: "UPDATE_MARKDOWN_BLOCK",
                        payload: {
                          sectionIndex: state.activeSection,
                          docPath: state.activeDocPath,
                          blockIndex: i,
                          value: e.target.value,
                        },
                      });
                    }}
                    ref={(el) => el && autoResize(el)}
                  />
                </div>
              );
            }

            if (block.type === "codegroup") {
              return (
                <div
                  key={i}
                  className="relative mb-4 bg-[#1e1e1e] rounded-xl p-4 shadow group"
                >

                  
                  <button
                    className="
                      absolute right-2 top-2
                      p-1 rounded-md
                      text-gray-400 hover:text-red-500
                      hover:bg-red-50
                      opacity-0 group-hover:opacity-100
                      transition
                    "
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_BLOCK",
                        payload: {
                          sectionIndex: state.activeSection,
                          docPath: state.activeDocPath,
                          blockIndex: i,
                        },
                      })
                    }
                  >
                    <Trash2 size={16} />
                  </button>

                  {block.blocks.map((b: any, j: number) => (
                    <div key={j} className="mb-4">
                      <input
                        className="mb-2 bg-[#2d2d2d] text-gray-200 border border-gray-600 rounded px-2 py-1 text-xs"
                        value={b.language}
                        onChange={(e) => {
                          const updated = [...block.blocks];
                          updated[j] = {
                            ...updated[j],
                            language: e.target.value,
                          };
                          dispatch({
                            type: "UPDATE_CODEGROUP",
                            payload: {
                              sectionIndex: state.activeSection,
                              docPath: state.activeDocPath,
                              blockIndex: i,
                              blocks: updated,
                            },
                          });
                        }}
                      />
                      <textarea
                        className="w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm border border-gray-700 rounded-md p-3 outline-none focus:ring-1 focus:ring-blue-500"
                        value={b.code}
                        onChange={(e) => {
                          const updated = [...block.blocks];
                          updated[j] = {
                            ...updated[j],
                            code: e.target.value,
                          };
                          dispatch({
                            type: "UPDATE_CODEGROUP",
                            payload: {
                              sectionIndex: state.activeSection,
                              docPath: state.activeDocPath,
                              blockIndex: i,
                              blocks: updated,
                            },
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              );
            }

            return null;
          })}
        </div>

        
        <div className="w-1/2 p-4 overflow-auto bg-white">
          {activeDoc && <Preview blocks={activeDoc.content} />}
        </div>
      </div>
    </main>
  );
}
