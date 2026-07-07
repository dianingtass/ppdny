import { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

const DEFAULT_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const normalizeHtml = (html = "") => {
  const trimmed = html.trim();
  return trimmed === "<p><br></p>" ? "" : trimmed;
};

const setEditorHtml = (quill, html) => {
  const normalized = normalizeHtml(html);
  if (!normalized) {
    quill.setText("", "silent");
    return;
  }
  quill.clipboard.dangerouslyPasteHTML(normalized, "silent");
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className = "",
  modules = DEFAULT_MODULES,
}) {
  const { quill, quillRef } = useQuill({
    modules,
    placeholder,
    theme: "snow",
  });
  const latestOnChangeRef = useRef(onChange);

  useEffect(() => {
    latestOnChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!quill) return;

    const initialValue = normalizeHtml(value);
    if (normalizeHtml(quill.root.innerHTML) !== initialValue) {
      setEditorHtml(quill, initialValue);
    }

    const handleTextChange = () => {
      latestOnChangeRef.current?.(normalizeHtml(quill.root.innerHTML));
    };

    quill.on("text-change", handleTextChange);
    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [quill]);

  useEffect(() => {
    if (!quill) return;
    const nextValue = normalizeHtml(value);
    if (normalizeHtml(quill.root.innerHTML) !== nextValue) {
      setEditorHtml(quill, nextValue);
    }
  }, [quill, value]);

  return (
    <div className="rich-text-editor-wrapper relative w-full">
      <style>{`
        /* Remove Quill default borders and overlap */
        .rich-text-editor-wrapper .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background-color: #f9fafb !important;
          padding: 8px 12px !important;
          border-top-left-radius: 10px !important;
          border-top-right-radius: 10px !important;
        }
        .rich-text-editor-wrapper .ql-container.ql-snow {
          border: none !important;
          font-family: inherit !important;
          border-bottom-left-radius: 10px !important;
          border-bottom-right-radius: 10px !important;
        }
        /* Style writing area */
        .rich-text-editor-wrapper .ql-editor {
          min-height: 180px;
          max-height: 350px;
          overflow-y: auto;
          font-size: 0.875rem; /* text-sm */
          line-height: 1.6;
          color: #374151; /* text-gray-700 */
          padding: 12px 16px !important;
        }
        /* Custom scrollbar for writing area */
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar {
          width: 6px;
        }
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-track {
          background: transparent;
        }
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 3px;
        }
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
        /* Style placeholder */
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          font-style: normal !important;
          color: #9ca3af !important; /* text-gray-400 */
          left: 16px !important;
          right: 16px !important;
        }
        /* Style Blockquotes */
        .rich-text-editor-wrapper .ql-editor blockquote {
          border-left: 4px solid #10b981 !important; /* border-green-500 */
          background-color: #f9fafb !important; /* bg-gray-50 */
          padding: 10px 16px !important;
          margin: 12px 0 !important;
          color: #4b5563 !important; /* text-gray-600 */
          font-style: italic !important;
        }
        /* Style Code Blocks */
        .rich-text-editor-wrapper .ql-editor pre {
          background-color: #f3f4f6 !important; /* bg-gray-100 */
          border: 1px solid #e5e7eb !important; /* border-gray-200 */
          border-radius: 8px !important;
          padding: 12px 16px !important;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
          font-size: 0.85em !important;
          color: #1f2937 !important; /* text-gray-800 */
          margin: 12px 0 !important;
          white-space: pre-wrap !important;
        }
      `}</style>
      <div ref={quillRef} className={className} />
    </div>
  );
}
