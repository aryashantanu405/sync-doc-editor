export type CodeBlock = {
  language: string;
  code: string;
};

export type ContentBlock =
  | {
      type: "markdown";
      value: string;
    }
  | {
      type: "codegroup";
      blocks: CodeBlock[];
    };

export type SyncDoc = {
  documentation_id?: string | null;
  title: string;
  slug: string;
  content: ContentBlock[];
  position: number;
};

export type SyncSection = {
  section_id?: string | null;
  title: string;
  slug: string;
  position: number;
  docs: SyncDoc[];
};

export type SyncStructurePayload = {
  project_id: string;
  sections: SyncSection[];
};
