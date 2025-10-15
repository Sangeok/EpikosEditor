import TextArea from "@/shared/ui/atoms/TextArea/ui/TextArea";

interface ExplanationResultProps {
  explanation: string;
}

export default function ExplanationResult({ explanation }: ExplanationResultProps) {
  return (
    <div className="mt-5 flex flex-col gap-2">
      <label htmlFor="resExplanation">Explanation Result</label>
      <TextArea value={explanation} disabled={true} className="mt-2" placeholder="Check the Explanation..." />
    </div>
  );
}
