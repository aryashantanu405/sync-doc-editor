import { SyncStructurePayload } from "@/types/sync";

type ContentBlock =
  | { type: "markdown"; value: string; html?: string }
  | { type: "codegroup"; blocks: { language: string; code: string }[] };

type DocNode = {
  documentation_id: string;
  title: string;
  position: number;
  content: ContentBlock[];
  children?: DocNode[];
};

type Action =
  | { type: "SET_DATA"; payload: SyncStructurePayload }
  | {
      type: "SET_ACTIVE_DOC";
      payload: { sectionIndex: number; docPath: number[] };
    }
  | { type: "ADD_SECTION" }
  | {
      type: "ADD_DOC";
      payload: { sectionIndex: number; parentPath?: number[] };
    }
  | {
      type: "RENAME_DOC";
      payload: { sectionIndex: number; docPath: number[]; title: string };
    }
  | {
      type: "REMOVE_DOC";
      payload: { sectionIndex: number; docPath: number[] };
    }
  | {
      type: "ADD_MARKDOWN_BLOCK";
      payload: { sectionIndex: number; docPath: number[] };
    }
  | {
      type: "ADD_CODEGROUP";
      payload: { sectionIndex: number; docPath: number[] };
    }
  | {
      type: "UPDATE_MARKDOWN_BLOCK";
      payload: {
        sectionIndex: number;
        docPath: number[];
        blockIndex: number;
        value: string;
      };
    }
  | {
      type: "UPDATE_CODEGROUP";
      payload: {
        sectionIndex: number;
        docPath: number[];
        blockIndex: number;
        blocks: { language: string; code: string }[];
      };
    }
  | {
      type: "REMOVE_BLOCK";
      payload: {
        sectionIndex: number;
        docPath: number[];
        blockIndex: number;
      };
    };

export type DocState = {
  data: SyncStructurePayload;
  activeSection: number;
  activeDocPath: number[];
};

export const initialState: DocState = {
  data: { project_id: "", sections: [] },
  activeSection: 0,
  activeDocPath: [0],
};

/* ---------- helpers ---------- */

function getDocByPath(docs: DocNode[], path: number[]): DocNode {
  let currentDocs = docs;
  let doc!: DocNode;

  for (const idx of path) {
    doc = currentDocs[idx];
    currentDocs = doc.children ?? [];
  }

  return doc;
}

function getParentDocs(docs: DocNode[], path: number[]): DocNode[] {
  let current = docs;
  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]].children!;
  }
  return current;
}

function reindex(list: any[]) {
  list.forEach((item, i) => (item.position = i + 1));
}

/* ---------- reducer ---------- */

export function docReducer(state: DocState, action: Action): DocState {
  const data = structuredClone(state.data);

  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload };

    case "SET_ACTIVE_DOC":
      return {
        ...state,
        activeSection: action.payload.sectionIndex,
        activeDocPath: action.payload.docPath,
      };

    /* =====================================================
       SECTION
    ===================================================== */

    case "ADD_SECTION":
      data.sections.push({
        section_id: crypto.randomUUID(),
        title: "New Section",
        slug: "new-section",
        position: data.sections.length + 1,
        docs: [],
      });
      return { ...state, data };

    /* =====================================================
       DOCS
    ===================================================== */

    case "ADD_DOC": {
      const { sectionIndex, parentPath } = action.payload;
      const section = data.sections[sectionIndex];

      const targetDocs = parentPath
        ? (getDocByPath(section.docs, parentPath).children ||= [])
        : section.docs;

      targetDocs.push({
        documentation_id: crypto.randomUUID(),
        title: "New Doc",
        position: targetDocs.length + 1,
        content: [{ type: "markdown", value: "", html: "" }],
        children: [],
      });

      return {
        ...state,
        data,
        activeSection: sectionIndex,
        activeDocPath: parentPath
          ? [...parentPath, targetDocs.length - 1]
          : [targetDocs.length - 1],
      };
    }

    case "RENAME_DOC": {
      const doc = getDocByPath(
        data.sections[action.payload.sectionIndex].docs,
        action.payload.docPath
      );
      doc.title = action.payload.title;
      return { ...state, data };
    }

    case "REMOVE_DOC": {
      const { sectionIndex, docPath } = action.payload;
      const parent = getParentDocs(
        data.sections[sectionIndex].docs,
        docPath
      );

      parent.splice(docPath[docPath.length - 1], 1);

      reindex(parent);

      return { ...state, data };
    }

    /* =====================================================
       BLOCKS
    ===================================================== */

    case "ADD_MARKDOWN_BLOCK": {
      const doc = getDocByPath(
        data.sections[action.payload.sectionIndex].docs,
        action.payload.docPath
      );
      doc.content.push({ type: "markdown", value: "", html: "" });
      return { ...state, data };
    }

    case "ADD_CODEGROUP": {
      const doc = getDocByPath(
        data.sections[action.payload.sectionIndex].docs,
        action.payload.docPath
      );
      doc.content.push({
        type: "codegroup",
        blocks: [
          { language: "js", code: "" },
          { language: "python", code: "" },
        ],
      });
      return { ...state, data };
    }

    case "UPDATE_MARKDOWN_BLOCK": {
      const doc = getDocByPath(
        data.sections[action.payload.sectionIndex].docs,
        action.payload.docPath
      );

      doc.content[action.payload.blockIndex].value =
        action.payload.value;

      return { ...state, data };
    }

    case "UPDATE_CODEGROUP": {
      const doc = getDocByPath(
        data.sections[action.payload.sectionIndex].docs,
        action.payload.docPath
      );

      doc.content[action.payload.blockIndex].blocks =
        action.payload.blocks;

      return { ...state, data };
    }

    case "REMOVE_BLOCK": {
      const doc = getDocByPath(
        data.sections[action.payload.sectionIndex].docs,
        action.payload.docPath
      );

      if (doc.content.length > 1) {
        doc.content.splice(action.payload.blockIndex, 1);
      }

      return { ...state, data };
    }

    default:
      return state;
  }
}
