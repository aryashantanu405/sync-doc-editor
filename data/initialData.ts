import { SyncStructurePayload } from "@/types/sync";

export const initialData: SyncStructurePayload = {
  project_id: "demo_project",
  sections: [
    {
      section_id: "sec-1",
      title: "Getting Started",
      slug: "getting-started",
      position: 1,
      docs: [
        {
          documentation_id: "doc-1",
          title: "Introduction",
          slug: "introduction",
          position: 1,
          content: [
            {
              type: "markdown",
              value: "# Welcome\nThis is the introduction.",
            },
            {
              type: "codegroup",
              blocks: [
                { language: "js", code: 'console.log("Hello JS")' },
                { language: "python", code: 'print("Hello Python")' },
              ],
            },
            {
              type: "markdown",
              value: "More explanation below the code.",
            },
          ],
        },
      ],
    },
  ],
};
