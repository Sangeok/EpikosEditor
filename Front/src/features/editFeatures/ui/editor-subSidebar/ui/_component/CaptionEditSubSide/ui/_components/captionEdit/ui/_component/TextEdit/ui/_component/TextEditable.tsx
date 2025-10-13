import { TextElement } from "@/entities/media/types";

interface TextEditProps {
  el: TextElement;
  commitTextEdit: (elementId: string, newText: string) => void;
  cancelEdit: () => void;
}

export default function TextEditable({ el, commitTextEdit, cancelEdit }: TextEditProps) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className="text-sm text-gray-100 whitespace-pre-wrap break-words text-center cursor-text outline-none focus:outline-none"
      onBlur={(e) => commitTextEdit(el.id, e.currentTarget.textContent ?? "")}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          const target = e.currentTarget as HTMLDivElement;
          target.textContent = el.text;
          cancelEdit();
        }
      }}
    >
      {el.text}
    </div>
  );
}
