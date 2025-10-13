import { useCaptionEdit } from "../model/hooks/useCationEdit";
import TextEdit from "./_component/TextEdit/ui";
import ClockField from "./_component/TimeEdit/ui/ClockField";

const hasNoCaption = () => {
  return <div className="p-3 text-sm text-gray-400">No captions loaded</div>;
};

export default function CaptionEdit() {
  const { state: captionEditState, actions: captionEditActions } = useCaptionEdit();

  return (
    <div className="w-full">
      <h4 className="text-md font-medium text-white mb-2">Captions</h4>
      <div className="border border-gray-700 rounded-md max-h-64 overflow-y-auto divide-y divide-gray-800">
        {captionEditState.hasNoTextElement && hasNoCaption()}
        {!captionEditState.hasNoTextElement &&
          captionEditState.sortedTextElements.map((el) => (
            <div key={el.id} className="flex flex-col p-2 gap-2">
              <div className="flex w-full justify-center items-center gap-1 text-sm text-gray-200">
                <ClockField
                  isEditing={captionEditState.editing?.id === el.id && captionEditState.editing.field === "start"}
                  valueSeconds={el.startTime}
                  onBegin={() => captionEditActions.beginEdit(el.id, "start")}
                  onCommit={(text) => captionEditActions.commitClockEdit(el.id, "start", text)}
                  onCancel={captionEditActions.cancelEdit}
                />
                <span className="opacity-70">-</span>
                <ClockField
                  isEditing={captionEditState.editing?.id === el.id && captionEditState.editing.field === "end"}
                  valueSeconds={el.endTime}
                  onBegin={() => captionEditActions.beginEdit(el.id, "end")}
                  onCommit={(text) => captionEditActions.commitClockEdit(el.id, "end", text)}
                  onCancel={captionEditActions.cancelEdit}
                />
              </div>
              <TextEdit
                editing={captionEditState.editing}
                element={el}
                commitTextEdit={captionEditActions.commitTextEdit}
                cancelEdit={captionEditActions.cancelEdit}
                beginTextEdit={captionEditActions.beginTextEdit}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
