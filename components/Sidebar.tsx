"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Search,
} from "lucide-react";

export default function Sidebar({
  sections = [],
  activeSection,
  activeDocPath,
  onSelectDoc,
  onAddSection,
  onRemoveSection,
  onRenameSection,
  onAddDoc,
  onRemoveDoc,
  onRenameDoc,
}: any) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const toggle = (key: string) =>
    setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  const match = (title: string) =>
    title.toLowerCase().includes(search.toLowerCase());

  const filterDocs = (docs: any[]): any[] => {
    if (!search) return docs;

    return docs
      .map((doc) => {
        const children = filterDocs(doc.children || []);

        if (match(doc.title) || children.length > 0) {
          return { ...doc, children };
        }

        return null;
      })
      .filter(Boolean);
  };

  const EditableTitle = ({
    id,
    value,
    onChange,
  }: {
    id: string;
    value: string;
    onChange: (v: string) => void;
  }) => {
    const [temp, setTemp] = useState(value);

    if (editingKey === id) {
      return (
        <input
          autoFocus
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onBlur={() => {
            onChange(temp);
            setEditingKey(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onChange(temp);
              setEditingKey(null);
            }
            if (e.key === "Escape") {
              setEditingKey(null);
            }
          }}
          className="flex-1 bg-white border rounded px-1 text-sm outline-none"
        />
      );
    }

    return <span className="flex-1 truncate select-none">{value}</span>;
  };

  const renderDocs = (
    docs: any[],
    sectionIndex: number,
    path: number[] = [],
    level = 0
  ) =>
    docs.map((doc, i) => {
      const currentPath = [...path, i];
      const key = `${sectionIndex}-${currentPath.join("-")}`;

      const active =
        sectionIndex === activeSection &&
        JSON.stringify(currentPath) === JSON.stringify(activeDocPath);

      const isCollapsed = collapsed[key];
      const hasChildren = doc.children?.length > 0;

      return (
        <div key={i}>
          <div
            style={{ marginLeft: level * 14 }}
            onClick={() => onSelectDoc(sectionIndex, currentPath)}
            onDoubleClick={() => setEditingKey(key)}
            className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition
              ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(key);
                }}
              >
                {isCollapsed ? (
                  <ChevronRight size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            )}

            <FileText size={14} />

            <EditableTitle
              id={key}
              value={doc.title}
              onChange={(v) =>
                onRenameDoc(sectionIndex, currentPath, v)
              }
            />

            <div className="flex gap-1 opacity-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddDoc(sectionIndex, currentPath);
                }}
              >
                <Plus size={14} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveDoc(sectionIndex, currentPath);
                }}
                className="text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {hasChildren &&
            !isCollapsed &&
            renderDocs(doc.children, sectionIndex, currentPath, level + 1)}
        </div>
      );
    });

  return (
    <aside className="w-64 border-r bg-white p-3 overflow-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Documents</h2>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddSection();
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-2 top-2.5 text-slate-400" />
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-7 pr-2 py-1.5 text-sm border rounded-md"
        />
      </div>

      {sections.map((section: any, sIndex: number) => {
        const key = `section-${sIndex}`;
        const filteredDocs = filterDocs(section.docs);

        return (
          <div key={sIndex} className="mb-6">
            <div
              onDoubleClick={() => setEditingKey(key)}
              className="flex items-center gap-2 mb-2 group cursor-pointer"
            >
              <EditableTitle
                id={key}
                value={section.title}
                onChange={(v) => onRenameSection(sIndex, v)}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSection(sIndex);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddDoc(sIndex);
              }}
              className="flex items-center gap-1 text-xs text-slate-500 mb-2"
            >
              <Plus size={12} />
              Add document
            </button>

            {renderDocs(filteredDocs, sIndex)}
          </div>
        );
      })}
    </aside>
  );
}
