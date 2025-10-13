import TextArea from "@/shared/ui/atoms/TextArea/ui/TextArea";
import { DetailsPlaceHolder } from "@/features/createMediaAsset/B_Topic/constants/constants";

interface TopicDetailsProps {
  topicDetail: string;
  topic: string;
  setTopicDetail: (fieldValue: string) => void;
}

export function TopicDetails({ topicDetail, topic, setTopicDetail }: TopicDetailsProps) {
  return (
    <div>
      <h2>Enter your own topic</h2>
      <TextArea
        value={topicDetail}
        onChange={(event) => {
          setTopicDetail(event.target.value);
        }}
        className="mt-2"
        placeholder={DetailsPlaceHolder[topic as keyof typeof DetailsPlaceHolder]}
      />
    </div>
  );
}
