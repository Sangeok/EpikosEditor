import { TextElement } from "@/entities/media/types";

interface NoEditTextProps {
  el: TextElement;
  beginTextEdit: (id: string) => void;
}

export default function NoEditText({ el, beginTextEdit }: NoEditTextProps) {
  return (
    <div
      className="text-sm text-gray-100 whitespace-pre-wrap break-words text-center cursor-text"
      onClick={() => beginTextEdit(el.id)}
    >
      {el.text}
    </div>
  );
}
