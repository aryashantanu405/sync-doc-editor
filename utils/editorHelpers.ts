export function applyFormat(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string = before
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;

  const selectedText =
    start !== end ? value.slice(start, end) : "text";

  const newValue =
    value.slice(0, start) +
    before +
    selectedText +
    after +
    value.slice(end);

  textarea.value = newValue;
  textarea.focus();

  const cursorStart = start + before.length;
  const cursorEnd = cursorStart + selectedText.length;

  textarea.setSelectionRange(cursorStart, cursorEnd);

  // 🔑 CRITICAL: notify React
  textarea.dispatchEvent(
    new Event("input", { bubbles: true })
  );
}

export function applyLinePrefix(
  textarea: HTMLTextAreaElement,
  prefix: string
) {
  const start = textarea.selectionStart;
  const value = textarea.value;

  const lineStart = value.lastIndexOf("\n", start - 1) + 1;

  const newValue =
    value.slice(0, lineStart) +
    prefix +
    value.slice(lineStart);

  textarea.value = newValue;
  textarea.focus();

  const cursor = start + prefix.length;
  textarea.setSelectionRange(cursor, cursor);

  textarea.dispatchEvent(
    new Event("input", { bubbles: true })
  );
}
