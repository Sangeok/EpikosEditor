import { clsx } from "clsx";
import { MainTopic } from "../../../../../constants/constants";
import Button from "@/shared/ui/atoms/Button/ui/Button";

interface MainTopicListProps {
  topic: string;
  setVideoTopic: (fieldValue: string) => void;
}

export function MainTopicList({ topic, setVideoTopic }: MainTopicListProps) {
  return (
    <div className="flex flex-wrap">
      {MainTopic.map((mainTopicItem, index) => (
        <Button
          onClick={() => {
            setVideoTopic(mainTopicItem);
          }}
          className={clsx(
            "border border-zinc-700 hover:bg-zinc-800 cursor-pointer m-1",
            topic === mainTopicItem && "bg-gray-700"
          )}
          key={index}
        >
          {mainTopicItem}
        </Button>
      ))}
    </div>
  );
}
