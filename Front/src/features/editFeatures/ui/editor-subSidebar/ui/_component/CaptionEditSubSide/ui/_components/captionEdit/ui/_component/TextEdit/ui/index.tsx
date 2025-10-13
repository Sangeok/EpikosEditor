import { TextElement } from "@/entities/media/types";
import TextEditable from "./_component/TextEditable";
import NoEditText from "./_component/NoEditText";

interface TextEditProps {
  editing: { id: string; field: "start" | "end" | "text" } | null;
  element: TextElement;
  commitTextEdit: (elementId: string, newText: string) => void;
  cancelEdit: () => void;
  beginTextEdit: (id: string) => void;
}

export default function TextEdit({ editing, element, commitTextEdit, cancelEdit, beginTextEdit }: TextEditProps) {
  const isEditingText = editing?.id === element.id && editing.field === "text";
  return (
    <div>
      {isEditingText && <TextEditable el={element} commitTextEdit={commitTextEdit} cancelEdit={cancelEdit} />}
      {!isEditingText && <NoEditText el={element} beginTextEdit={beginTextEdit} />}
    </div>
  );
}
